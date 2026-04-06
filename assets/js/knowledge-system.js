(function () {
  var GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
  var OLLAMA_URL   = 'http://localhost:11434/v1/chat/completions';
  var MARKED_CDN   = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
  var PDFJS_CDN    = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var RL_PAPERS  = JSON.parse(document.getElementById('ks-rl-data').textContent  || '[]');
  var LAB_PAPERS = JSON.parse(document.getElementById('ks-lab-data').textContent || '[]');

  // ── Storage ───────────────────────────────────────────────────────
  var wikiData = {}, _fileHandle = null, _saveTimer = null;

  function getItem(key)      { return wikiData.hasOwnProperty(key) ? wikiData[key] : null; }
  function setItem(key, val) { wikiData[key] = val; scheduleSave(); }

  function scheduleSave() {
    if (!_fileHandle) return;
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(writeToLocalFile, 1000);
  }

  function writeToLocalFile() {
    if (!_fileHandle) return;
    _fileHandle.createWritable().then(function (w) {
      return w.write(JSON.stringify(wikiData, null, 2)).then(function () { return w.close(); });
    }).then(function () {
      var btn = document.getElementById('ks-local-save-btn');
      if (btn) btn.textContent = 'Disk: saved ✓';
      statusEl.textContent = statusLabel() + ' · Saved ✓';
      setTimeout(function () { statusEl.textContent = statusLabel(); }, 2500);
    }).catch(function () { statusEl.textContent = statusLabel() + ' · Disk save failed'; });
  }

  function downloadJson() {
    var url = URL.createObjectURL(new Blob([JSON.stringify(wikiData, null, 2)], { type: 'application/json' }));
    var a = Object.assign(document.createElement('a'), { href: url, download: 'wiki.json' });
    a.click(); URL.revokeObjectURL(url);
  }

  function pickLocalFile() {
    if (!window.showSaveFilePicker) { downloadJson(); return; }
    window.showSaveFilePicker({ suggestedName: 'wiki.json', types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }] })
      .then(function (handle) {
        _fileHandle = handle;
        return writeToLocalFile();
      })
      .then(function () {
        var btn = document.getElementById('ks-local-save-btn');
        if (btn) { btn.textContent = 'Disk: auto-saving ✓'; btn.classList.add('ks-io-btn--active'); }
      })
      .catch(function (e) { if (e.name !== 'AbortError') statusEl.textContent = 'Could not save file'; });
  }

  async function loadFromRepo() {
    try {
      var r = await fetch('/assets/ks-data/wiki.json?_=' + Date.now());
      wikiData = (r.ok ? await r.json() : {}) || {};
    } catch (e) { wikiData = {}; }
  }

  // ── Provider ──────────────────────────────────────────────────────
  var provider = 'groq', apiKey = '', selectedModel = 'llama-3.3-70b-versatile';
  var ollamaModel = '', ollamaRemoteUrl = '', ollamaRemoteModel = '';
  var browseOnly = false;

  function isOllama()    { return provider === 'ollama' || provider === 'ollama-remote'; }
  function ollamaM()     { return provider === 'ollama-remote' ? ollamaRemoteModel : ollamaModel; }
  function ingestModel() { return isOllama() ? ollamaM() : 'llama-3.3-70b-versatile'; }
  function chatModel()   { return isOllama() ? ollamaM() : selectedModel; }
  function statusLabel() {
    if (provider === 'ollama-remote') return 'Ollama Remote · ' + ollamaRemoteModel;
    if (provider === 'ollama')        return 'Ollama · ' + ollamaModel;
    return 'Groq · ' + selectedModel;
  }
  function apiUrl() {
    if (provider === 'ollama-remote') return ollamaRemoteUrl.replace(/\/$/, '') + '/v1/chat/completions';
    return provider === 'ollama' ? OLLAMA_URL : GROQ_URL;
  }
  function apiHeaders() {
    var h = { 'Content-Type': 'application/json' };
    if (provider === 'groq' && apiKey) h['Authorization'] = 'Bearer ' + apiKey;
    return h;
  }

  // ── Wiki data keys ────────────────────────────────────────────────
  var WIKI_PREFIX     = 'ks_wiki_';
  var LAB_WIKI_PREFIX = 'ks_lab_wiki_';
  var WIKI_INDEX_KEY  = 'ks_wiki_index';
  var LAB_INDEX_KEY   = 'ks_lab_wiki_index';
  var WIKI_LOG_KEY    = 'ks_wiki_log';
  var LINT_OUTPUT_KEY = 'ks_lint_output';

  function getIndex(key)          { try { return JSON.parse(getItem(key) || '[]'); } catch(e) { return []; } }
  function saveIndex(key, idx)    { setItem(key, JSON.stringify(idx)); }
  function getPage(prefix, k)     { return getItem(prefix + k); }
  function savePage(prefix, k, c) { setItem(prefix + k, c); }
  function appendLog(action, detail) {
    var ts = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setItem(WIKI_LOG_KEY, (getItem(WIKI_LOG_KEY) || '') + '## [' + ts + '] ' + action + ' | ' + detail + '\n');
  }

  // ── Wiki builders ─────────────────────────────────────────────────
  function snippet(page, rx) {
    if (!page) return '*(not ingested)*';
    var m = page.match(rx);
    return m ? m[1].trim().replace(/\n/g, ' ').slice(0, 160) : '*(summary unavailable)*';
  }

  function buildIndexMd() {
    var labIdx = getIndex(LAB_INDEX_KEY), rlIdx = getIndex(WIKI_INDEX_KEY);
    var total  = labIdx.length + rlIdx.length;
    var md = '# Wiki Index\n*Updated: ' + new Date().toISOString().slice(0, 10) + ' · ' + total + ' page' + (total !== 1 ? 's' : '') + '*\n\n';
    if (labIdx.length) md += '## Lab Papers\n\n' + labIdx.slice().sort(paperSort).map(function (e) {
      return '- **' + e.name + '** *(ingested ' + e.date + ')*\n  ' + snippet(getPage(LAB_WIKI_PREFIX, e.key), /## Research Question\n([\s\S]*?)(?=\n##)/);
    }).join('\n') + '\n\n';
    if (rlIdx.length) md += '## Reading List (External)\n\n' + rlIdx.slice().sort(paperSort).map(function (e) {
      return '- **' + e.name + '** *(ingested ' + e.date + ')*\n  ' + snippet(getPage(WIKI_PREFIX, e.key), /## Summary\n([\s\S]*?)(?=\n##)/);
    }).join('\n') + '\n';
    if (!total) md += '*No pages ingested yet.*\n';
    return md;
  }

  function buildWikiViewMd() {
    var labIdx = getIndex(LAB_INDEX_KEY), rlIdx = getIndex(WIKI_INDEX_KEY);
    var total = labIdx.length + rlIdx.length;
    if (!total) return '*No pages ingested yet. Use the Lab Papers or Reading List tabs to ingest PDFs.*\n';
    var md = '# Wiki · ' + total + ' page' + (total !== 1 ? 's' : '') + ' · ' + new Date().toISOString().slice(0, 10) + '\n\n';
    if (labIdx.length) {
      md += '## Lab Papers\n\n';
      labIdx.slice().sort(paperSort).forEach(function (e) {
        md += (getPage(LAB_WIKI_PREFIX, e.key) || ('### ' + e.name + '\n*(not yet ingested)*')) + '\n\n---\n\n';
      });
    }
    if (rlIdx.length) {
      md += '## Reading List (External)\n\n';
      rlIdx.slice().sort(paperSort).forEach(function (e) {
        md += (getPage(WIKI_PREFIX, e.key) || ('### ' + e.name + '\n*(not yet ingested)*')) + '\n\n---\n\n';
      });
    }
    return md;
  }

  function buildLogMd() {
    var entries = (getItem(WIKI_LOG_KEY) || '').split('\n').filter(function (l) { return l.startsWith('## ['); });
    return entries.length ? entries.slice().reverse().slice(0, 40).join('\n') : '*No activity logged yet.*';
  }

  function wikiSection(prefix, indexKey) {
    var index = getIndex(indexKey);
    if (!index.length) return '(No pages ingested yet.)\n';
    return index.map(function (e) { return getPage(prefix, e.key) || ('#### ' + e.name + '\n(Not yet ingested.)'); }).join('\n\n---\n\n');
  }

  // ── System prompt (cached) ────────────────────────────────────────
  var _prompt = null, _promptKey = '';

  function getCachedSystemPrompt() {
    var k = (getItem(LAB_INDEX_KEY) || '') + (getItem(WIKI_INDEX_KEY) || '');
    if (_prompt && _promptKey === k) return _prompt;
    _promptKey = k;
    _prompt = [
      'You are a research assistant for the LENS Lab (Lens for Empirical Navigation in Software Lab) at Missouri S&T, led by Dr. Mia Mohammad Imran.',
      'Answer questions about the lab\'s research. Be concise and cite specific papers.\n',
      '## Lab\nLENS Lab — Dr. Mia Mohammad Imran, Assistant Professor, CS, Missouri S&T. Research: Software Engineering, NLP, Empirical Methods.\n',
      '## Theme 1: GenAI & Code Quality',
      '- "TODO: Fix the Mess Gemini Created" (TechDebt 2026): GenAI-Induced SATD (GIST) in 81 comments. AI roles: Source, Catalyst, Mitigator, Neutral.',
      '- OLAF (WSESE 2026): LLM annotation pipeline replicating human annotation on SE datasets.',
      '- DePro (FSE-IVR 2026): Test-case-driven LLM debugging. Cuts attempts by 64%, saves 7.6 min vs. humans.',
      '- LLM Vulnerabilities in OSS (LLMSC 2026): Security vulnerabilities in LLM-leveraging open-source systems.',
      '- AI Coding Agent Failures (MSR 2026): 33,000 agentic PRs. Agents fail at bug-fixing; socio-technical misalignment is key.\n',
      '## Theme 2: Toxicity & Derailment in OSS',
      '- Toxicity Ahead (ICSE 2026): F1=0.901 forecasting derailment on 366 GitHub threads using SCDs.',
      '- Derailment Prediction (ArXiV): 70% F1. Markers: 2nd-person pronouns, negation, frustration tone.',
      '- Silent Is Not Silent (FSE-IVR 2025): 40% of bug threads contain toxicity; toxic threads less likely to produce a PR.',
      '- Incivility Dataset (MSR 2024): 338 locked issues, 1,365 comments, 9 uncivil types.\n',
      '## Theme 3: Emotion & Communication in SE',
      '- Cognitive-Load Aware Refactoring (EASE 2026): Automated refactoring for novice code comprehension.',
      '- Novice Emotion on r/learnprogramming (ICSE SEET 2026): 1,500 posts. Frustration/confusion dominate.',
      '- Emotion Causes in SE (ICSE 2024): Top triggers: technical disagreements, ambiguous requirements.',
      '- Figurative Language in SE (ICSE 2024): Metaphors/idioms degrade NLP tool performance.',
      '- Emotion Classifier Benchmark (NLBSE 2024): No single transformer dominates all SE emotion datasets.',
      '- Data Augmentation for Emotion (ASE 2022): Augmentation improves minority-class detection.\n',
      '## Theme 4: Bug Reports & Developer Tools',
      '- LLPut (FSE Companion 2025): LLMs for bug-report input generation.',
      '- Clarification Questions for Web Search (IST 2022): Targeted questions improve developer search quality.',
      '- BugAutoQ (MSR 2021): Neural ranking on 25,000 GitHub issues for follow-up question selection.\n',
      '## Published Datasets',
      '- Incivility: 1,365 comments, 338 locked issues',
      '- Derailment: 366 GitHub threads (Zenodo)',
      '- Emotion corpus (github.com/vcu-swim-lab/SE-Emotion-Study)',
      '- Novice emotion: 1,500 Reddit posts (Zenodo)\n',
      'Answer only about this lab\'s research and the reading list papers below.\n',
      '## Wiki Index\nRead this first to know what pages are available, then use the full pages below for details.\n',
      buildIndexMd(),
      '## Wiki — Lab Papers (full pages)\n' + wikiSection(LAB_WIKI_PREFIX, LAB_INDEX_KEY),
      '## Wiki — Reading List (external papers, full pages)\nThese are papers by OTHER researchers — not this lab\'s publications.\n' + wikiSection(WIKI_PREFIX, WIKI_INDEX_KEY),
    ].join('\n');
    return _prompt;
  }

  // ── DOM refs ──────────────────────────────────────────────────────
  var history = [];
  var connectEl      = document.getElementById('ks-connect');
  var chatEl         = document.getElementById('ks-chat-interface');
  var keyInput       = document.getElementById('ks-api-key');
  var modelSelect    = document.getElementById('ks-model-select');
  var connectBtn     = document.getElementById('ks-connect-btn');
  var messagesEl     = document.getElementById('ks-messages');
  var inputEl        = document.getElementById('ks-input');
  var sendBtn        = document.getElementById('ks-send-btn');
  var statusEl       = document.getElementById('ks-status');
  var suggestionsEl  = document.getElementById('ks-suggestions');
  var ollamaSelEl    = document.getElementById('ks-ollama-model-select');
  var ollamaCustomEl = document.getElementById('ks-ollama-custom');
  var ollamaCustomRow = document.getElementById('ks-ollama-custom-row');
  var remoteUrlInput   = document.getElementById('ks-or-url');
  var remoteModelInput = document.getElementById('ks-or-model');

  modelSelect.value = selectedModel;

  // ── Ollama local model detection ──────────────────────────────────
  function fetchOllamaModels() {
    ollamaSelEl.innerHTML = '<option value="">Detecting models…</option>';
    ollamaSelEl.disabled  = true;
    fetch('http://localhost:11434/api/tags')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var names = (d.models || []).map(function (m) { return m.name; });
        ollamaSelEl.innerHTML = (names.length ? names.map(function (n) { return '<option>' + n + '</option>'; }).join('') : '<option value="">No models installed</option>')
          + '<option value="__custom__">— Enter model name manually —</option>';
        ollamaSelEl.disabled = false;
        ollamaCustomRow.style.display = 'none';
      })
      .catch(function () {
        ollamaSelEl.innerHTML = '<option value="">Ollama not running</option><option value="__custom__">— Enter model name manually —</option>';
        ollamaSelEl.disabled = false;
      });
  }

  ollamaSelEl.addEventListener('change', function () { ollamaCustomRow.style.display = this.value === '__custom__' ? 'block' : 'none'; });
  document.getElementById('ks-ollama-refresh').addEventListener('click', fetchOllamaModels);

  // ── Provider tabs ─────────────────────────────────────────────────
  var PROVIDER_FIELDS = { groq: 'ks-groq-fields', ollama: 'ks-ollama-fields', 'ollama-remote': 'ks-ollama-remote-fields' };

  document.querySelectorAll('.ks-provider-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      provider = tab.dataset.provider;
      document.querySelectorAll('.ks-provider-tab').forEach(function (t) {
        t.classList.toggle('ks-provider-tab--active', t.dataset.provider === provider);
      });
      Object.keys(PROVIDER_FIELDS).forEach(function (p) {
        document.getElementById(PROVIDER_FIELDS[p]).style.display = p === provider ? 'block' : 'none';
      });
      if (provider === 'ollama') fetchOllamaModels();
    });
  });

  // ── Mode tabs ─────────────────────────────────────────────────────
  var PANELS = { query: 'ks-mode-query', lab: 'ks-mode-lab', rl: 'ks-mode-rl', lint: 'ks-mode-lint', wiki: 'ks-mode-wiki' };

  function switchMode(mode) {
    document.querySelectorAll('.ks-mode-tab').forEach(function (t) { t.classList.toggle('ks-mode-tab--active', t.dataset.mode === mode); });
    Object.keys(PANELS).forEach(function (m) { document.getElementById(PANELS[m]).style.display = m === mode ? (m === 'query' ? 'flex' : 'block') : 'none'; });
    if (mode === 'lab')  renderIngestPanel(LAB_PAPERS, 'ks-lab-list', LAB_WIKI_PREFIX, LAB_INDEX_KEY);
    if (mode === 'rl')   renderIngestPanel(RL_PAPERS,  'ks-rl-list',  WIKI_PREFIX,     WIKI_INDEX_KEY);
    if (mode === 'lint') { var saved = getItem(LINT_OUTPUT_KEY); if (saved) renderMarkdown(document.getElementById('ks-lint-output'), saved); }
    if (mode === 'wiki') {
      renderMarkdown(document.getElementById('ks-wiki-index-content'), buildWikiViewMd());
      renderMarkdown(document.getElementById('ks-wiki-log-content'),   buildLogMd());
    }
  }

  document.querySelectorAll('.ks-mode-tab').forEach(function (tab) { tab.addEventListener('click', function () { switchMode(tab.dataset.mode); }); });

  // ── Connect / reset ───────────────────────────────────────────────
  function openChat(browse) {
    browseOnly = !!browse;
    connectEl.style.display = 'none';
    chatEl.style.display    = 'flex';
    document.getElementById('ks-browse-notice').style.display = browseOnly ? 'flex' : 'none';
    statusEl.textContent = browseOnly ? 'Browse mode' : statusLabel();
    if (browseOnly) switchMode('lab'); else inputEl.focus();
  }

  document.getElementById('ks-browse-connect-btn').addEventListener('click', function () {
    chatEl.style.display = 'none'; connectEl.style.display = 'block';
  });

  connectBtn.addEventListener('click', function () {
    if (provider === 'groq') {
      var k = keyInput.value.trim(); if (!k) return;
      apiKey = k; selectedModel = modelSelect.value;
    } else if (provider === 'ollama-remote') {
      var url = remoteUrlInput.value.trim(), mod = remoteModelInput.value.trim(); if (!url || !mod) return;
      ollamaRemoteUrl = url; ollamaRemoteModel = mod;
    } else {
      var m = ollamaSelEl.value === '__custom__' ? ollamaCustomEl.value.trim() : ollamaSelEl.value; if (!m) return;
      ollamaModel = m; apiKey = '';
    }
    openChat(false);
  });

  document.getElementById('ks-browse-btn').addEventListener('click', function () { openChat(true); });
  [keyInput, ollamaCustomEl, remoteUrlInput, remoteModelInput].forEach(function (el) {
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter') connectBtn.click(); });
  });

  document.getElementById('ks-reset-btn').addEventListener('click', function () {
    apiKey = ''; ollamaModel = ''; ollamaRemoteUrl = ''; ollamaRemoteModel = ''; history = []; browseOnly = false;
    chatEl.style.display = 'none'; connectEl.style.display = 'block';
    keyInput.value = ''; remoteUrlInput.value = ''; remoteModelInput.value = '';
  });

  document.getElementById('ks-local-save-btn').addEventListener('click', pickLocalFile);
  document.getElementById('ks-export-btn').addEventListener('click', downloadJson);

  document.getElementById('ks-regen-btn').addEventListener('click', function () {
    if (browseOnly) { statusEl.textContent = 'Connect to regenerate wiki.'; return; }
    var labIdx = getIndex(LAB_INDEX_KEY), rlIdx = getIndex(WIKI_INDEX_KEY);
    if (!labIdx.length && !rlIdx.length) { statusEl.textContent = 'No ingested pages to regenerate.'; return; }

    // Build ordered task list matching index entries to available PDFs
    var tasks = [];
    labIdx.forEach(function (e) {
      var p = LAB_PAPERS.find(function (p) { return p.key === e.key; });
      if (p) tasks.push({ paper: p, prefix: LAB_WIKI_PREFIX, indexKey: LAB_INDEX_KEY, listId: 'ks-lab-list' });
    });
    rlIdx.forEach(function (e) {
      var p = RL_PAPERS.find(function (p) { return p.key === e.key; });
      if (p) tasks.push({ paper: p, prefix: WIKI_PREFIX, indexKey: WIKI_INDEX_KEY, listId: 'ks-rl-list' });
    });

    if (!tasks.length) { statusEl.textContent = 'PDF source files not found — cannot regenerate.'; return; }

    var regenBtn = this;
    regenBtn.disabled = true;
    var done = 0, total = tasks.length;

    function runNext() {
      if (!tasks.length) {
        regenBtn.disabled = false;
        statusEl.textContent = statusLabel() + ' · Regenerated ' + done + '/' + total + ' pages ✓';
        setTimeout(function () { statusEl.textContent = statusLabel(); }, 3000);
        return;
      }
      var task = tasks.shift();
      var fakeBtn = document.createElement('button');
      statusEl.textContent = 'Regenerating (' + (done + 1) + '/' + total + '): ' + task.paper.name + '…';
      ingestPaper(task.paper, fakeBtn, task.prefix, task.indexKey, task.listId, false, function () {
        done++; runNext();
      });
    }

    runNext();
  });

  // ── SSE streaming ─────────────────────────────────────────────────
  function streamResponse(res, onToken) {
    var reader = res.body.getReader(), decoder = new TextDecoder(), buffer = '';
    function pump() {
      return reader.read().then(function (chunk) {
        if (chunk.done) return;
        buffer += decoder.decode(chunk.value, { stream: true });
        var lines = buffer.split('\n'); buffer = lines.pop();
        lines.forEach(function (line) {
          if (!line.startsWith('data: ') || line === 'data: [DONE]') return;
          try { var t = JSON.parse(line.slice(6)).choices[0].delta.content; if (t) onToken(t); } catch (e) {}
        });
        return pump();
      });
    }
    return pump();
  }

  // ── LLM helpers ───────────────────────────────────────────────────
  function llmFetch(body) { return fetch(apiUrl(), { method: 'POST', headers: apiHeaders(), body: JSON.stringify(body) }); }
  function rejectOnError(r) {
    if (!r.ok) return r.json().then(function (e) { throw new Error(e.error && e.error.message || 'API error'); });
    return null;
  }
  async function llmComplete(body) { var r = await llmFetch(body); return rejectOnError(r) || r.json().then(function (d) { return d.choices[0].message.content; }); }
  async function llmStream(body, onToken) { var r = await llmFetch(body); return rejectOnError(r) || streamResponse(r, onToken); }

  // ── Script / markdown / PDF ───────────────────────────────────────
  function loadScript(src, key) {
    return new Promise(function (resolve, reject) {
      if (window[key]) { resolve(window[key]); return; }
      var s = document.createElement('script');
      s.src = src; s.onload = function () { resolve(window[key]); }; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function renderMarkdown(el, md) {
    loadScript(MARKED_CDN, 'marked')
      .then(function (m) { el.innerHTML = m.parse(md, { breaks: true }); })
      .catch(function () { el.textContent = md; });
  }

  async function extractPdfText(url) {
    var lib = await loadScript(PDFJS_CDN, 'pdfjsLib');
    lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    var pdf = await lib.getDocument(url).promise;
    var pages = await Promise.all(Array.from({ length: pdf.numPages }, async function (_, i) {
      var p  = await pdf.getPage(i + 1);
      var tc = await p.getTextContent();
      return tc.items.map(function (it) { return it.str; }).join(' ');
    }));
    return { text: pages.join('\n').replace(/\s+/g, ' ').trim().slice(0, 12000), pages: pdf.numPages };
  }

  // ── Paper sorting ─────────────────────────────────────────────────
  function yearOf(name)    { var m = name.match(/\b(20\d{2})\b/); return m ? +m[1] : 0; }
  function venueTier(name) {
    var u = name.toUpperCase();
    if (/\b(ICSE|FSE|ASE)\b/.test(u)) return 1;
    if (/\b(MSR|EASE|EMSE|TSE|IST|EMNLP|ACL|NAACL|SANER|ICPC|ICSME)\b/.test(u)) return 2;
    return 3;
  }
  function paperType(name, pages) {
    if (pages && pages <= 6) return 'short';
    return /\b(IVR|CHALLENGE|WSESE)\b|TECHDEBT/.test(name.toUpperCase()) ? 'short' : 'full';
  }
  function paperSort(a, b) {
    var y = yearOf(b.name) - yearOf(a.name); if (y) return y;
    var ta = paperType(a.name, a.pages) === 'short' ? 1 : 0, tb = paperType(b.name, b.pages) === 'short' ? 1 : 0;
    return ta !== tb ? ta - tb : venueTier(a.name) - venueTier(b.name);
  }

  // ── Chat ──────────────────────────────────────────────────────────
  suggestionsEl.querySelectorAll('.ks-suggestion').forEach(function (btn) {
    btn.addEventListener('click', function () { switchMode('query'); send(btn.dataset.q); suggestionsEl.style.display = 'none'; });
  });
  sendBtn.addEventListener('click', function () { send(); });
  inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

  function send(text) {
    var q = (text || inputEl.value).trim();
    if (!q || sendBtn.disabled || browseOnly) return;
    inputEl.value = ''; suggestionsEl.style.display = 'none';
    appendMsg('user', q); appendLog('query', q.slice(0, 100));
    history.push({ role: 'user', content: q });
    sendBtn.disabled = true; statusEl.textContent = 'Thinking…';
    var bubble = appendMsg('assistant', '').querySelector('.ks-msg-bubble');
    var fullReply = '';
    llmStream(
      { model: chatModel(), stream: true, messages: [{ role: 'system', content: getCachedSystemPrompt() }].concat(history) },
      function (token) { fullReply += token; bubble.textContent = fullReply; messagesEl.scrollTop = messagesEl.scrollHeight; }
    ).then(function () {
      history.push({ role: 'assistant', content: fullReply });
      sendBtn.disabled = false; statusEl.textContent = statusLabel();
    }).catch(function (err) {
      bubble.textContent = 'Error: ' + (err.message || 'Could not reach API.');
      sendBtn.disabled = false; statusEl.textContent = statusLabel();
    });
  }

  function appendMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'ks-msg ks-msg--' + role;
    div.innerHTML = '<div class="ks-msg-bubble"></div>';
    div.querySelector('.ks-msg-bubble').textContent = text;
    messagesEl.appendChild(div); messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  // ── Ingest panel ──────────────────────────────────────────────────
  function buildPaperItem(paper, prefix, indexKey, listId) {
    var page = getPage(prefix, paper.key), ingested = !!page;
    var item = document.createElement('div');
    item.className = 'ks-ingest-item';
    item.innerHTML =
      '<div class="ks-ingest-item-header"><span class="ks-ingest-title"></span>'
      + '<span class="ks-ingest-badge ks-ingest-badge--' + (ingested ? 'ingested' : 'pending') + '">' + (ingested ? 'Ingested' : 'Not Ingested') + '</span></div>'
      + '<div class="ks-ingest-actions">'
      + '<button class="ks-ingest-btn' + (ingested ? ' ks-ingest-btn--reingest' : '') + '">' + (ingested ? 'Re-ingest' : 'Ingest') + '</button>'
      + '<button class="ks-deep-wiki-btn">Deep Wiki</button>'
      + (ingested ? '<button class="ks-view-wiki-btn">View Wiki Page</button>' : '')
      + (paper.type === 'rl' ? '<button class="ks-summary-btn">' + (getItem(paper.key) ? 'Re-summary' : 'Summary') + '</button>' : '')
      + '</div>'
      + (ingested ? '<div class="ks-wiki-preview" style="display:none;"><div class="ks-wiki-content"></div></div>' : '');

    item.querySelector('.ks-ingest-title').textContent = paper.name;
    item.querySelector('.ks-ingest-btn').addEventListener('click', function () { enqueueIngest(paper, this, prefix, indexKey, listId, false); });
    item.querySelector('.ks-deep-wiki-btn').addEventListener('click', function () { enqueueIngest(paper, this, prefix, indexKey, listId, true); });

    var summaryBtn = item.querySelector('.ks-summary-btn');
    if (summaryBtn) summaryBtn.addEventListener('click', function () { summarizePaper(paper, summaryBtn); });

    if (ingested) {
      var preview = item.querySelector('.ks-wiki-preview');
      var viewBtn = item.querySelector('.ks-view-wiki-btn');
      viewBtn.addEventListener('click', function () {
        var hidden = preview.style.display === 'none';
        if (hidden && !preview.dataset.rendered) { renderMarkdown(preview.querySelector('.ks-wiki-content'), page); preview.dataset.rendered = '1'; }
        preview.style.display = hidden ? 'block' : 'none';
        viewBtn.textContent   = hidden ? 'Hide Wiki Page' : 'View Wiki Page';
      });
    }
    return item;
  }

  function renderIngestPanel(papers, listId, prefix, indexKey) {
    var list = document.getElementById(listId);
    if (!papers.length) { list.innerHTML = '<p class="ks-panel-empty">No PDFs found.</p>'; return; }
    list.innerHTML = '';
    var pagesMap = {};
    getIndex(indexKey).forEach(function (e) { if (e.pages) pagesMap[e.key] = e.pages; });
    var groups = {};
    papers.forEach(function (p) {
      var y = yearOf(p.name) || 'Unknown', t = paperType(p.name, pagesMap[p.key]);
      if (!groups[y]) groups[y] = { full: [], short: [] };
      groups[y][t].push(p);
    });
    Object.keys(groups).sort(function (a, b) { return +b - +a; }).forEach(function (year) {
      var yearEl = document.createElement('div'); yearEl.className = 'ks-ingest-year'; yearEl.textContent = year;
      list.appendChild(yearEl);
      ['full', 'short'].forEach(function (type) {
        var bucket = groups[year][type].slice().sort(function (a, b) { return venueTier(a.name) - venueTier(b.name); });
        if (!bucket.length) return;
        var typeEl = document.createElement('div'); typeEl.className = 'ks-ingest-type ks-ingest-type--' + type;
        typeEl.textContent = type === 'full' ? 'Full Paper' : 'Short Paper';
        list.appendChild(typeEl);
        bucket.forEach(function (p) { list.appendChild(buildPaperItem(p, prefix, indexKey, listId)); });
      });
    });
  }

  // ── Summary ───────────────────────────────────────────────────────
  function summarizePaper(paper, btn) {
    if (browseOnly) { btn.title = 'Connect to generate summary'; return; }
    btn.disabled = true; btn.textContent = 'Generating…';
    statusEl.textContent = 'Generating summary: ' + paper.name + '…';
    extractPdfText(paper.path).then(function (result) {
      return llmComplete({ model: ingestModel(), stream: false, messages: [{ role: 'user', content:
        'Write a reading-list summary for this research paper. The summary must be 4–6 complete sentences and cover ALL of the following:\n'
        + '1. What problem or gap does the paper address and why it matters?\n'
        + '2. What is the research approach, method, or dataset used?\n'
        + '3. What are the key findings or results — include specific numbers, metrics, or named techniques from the paper.\n'
        + '4. What is the main takeaway or contribution for a software engineering researcher?\n\n'
        + 'Rules: plain prose only, no headings, no bullet points, no markdown formatting. '
        + 'Do not start with "This paper". Write every sentence completely — do not trail off or cut short.\n\n'
        + 'Paper title: ' + paper.name + '\n\nExtracted text:\n' + result.text
      }] });
    }).then(function (content) {
      if (content) { setItem(paper.key, content.trim()); localStorage.setItem(paper.key, content.trim()); appendLog('summary', paper.name); }
      btn.disabled = false; btn.textContent = 'Re-summary'; statusEl.textContent = statusLabel();
    }).catch(function (err) {
      statusEl.textContent = 'Error: ' + (err.message || 'Summary failed.');
      btn.disabled = false; btn.textContent = 'Summary';
    });
  }

  // ── Ingest queue ──────────────────────────────────────────────────
  var _ingestQueue = [], _ingestRunning = false;

  function enqueueIngest(paper, btn, prefix, indexKey, listId, deep) {
    if (browseOnly) { btn.title = 'Connect with Groq or Ollama to ingest'; return; }
    btn.disabled = true; btn.textContent = 'Queued…';
    _ingestQueue.push({ paper: paper, btn: btn, prefix: prefix, indexKey: indexKey, listId: listId, deep: !!deep });
    drainIngestQueue();
  }

  function drainIngestQueue() {
    if (_ingestRunning || !_ingestQueue.length) return;
    _ingestRunning = true;
    var task = _ingestQueue.shift();
    if (_ingestQueue.length) statusEl.textContent = _ingestQueue.length + ' more in queue…';
    ingestPaper(task.paper, task.btn, task.prefix, task.indexKey, task.listId, task.deep, function () {
      _ingestRunning = false; drainIngestQueue();
    });
  }

  // ── Ingest prompts ────────────────────────────────────────────────
  var LENS_WIKI   = 'You are building the LENS Lab Wiki (Lens for Empirical Navigation in Software Lab, Missouri S&T). ';
  var LENS_THEMES = 'Toxicity/Derailment in OSS, Emotion in SE, Bug Reports, GenAI & Code Quality';

  function buildIngestPrompt(paper, text, otherIndex, today, isLab, deep) {
    var base = 'Paper title: ' + paper.name + '\n\nExtracted PDF text:\n' + text + '\n\n';
    if (isLab) {
      return LENS_WIKI + 'This paper IS from this lab. Generate a structured wiki page in markdown.\n\n'
        + base + 'Other lab papers already in the wiki:\n' + otherIndex + '\n\n'
        + 'Generate a wiki page with EXACTLY these sections:\n\n'
        + '# [Exact Paper Title]\n**Venue:** [from text]\n**Ingested:** ' + today + '\n\n'
        + '## Research Question\n## Key Concepts\n## Methodology\n## Key Findings\n## Contributions\n## Limitations & Future Work\n## Related Lab Papers\n## How to Cite\n\n'
        + 'Ground every claim in the PDF text. Output only the markdown.';
    }
    var sections = deep
      ? '# [Exact Paper Title from PDF]\n**Authors:** [full author list from PDF]\n**Venue:** [conference/journal name and year]\n**Ingested:** ' + today + '\n\n'
        + '## Problem & Motivation\n## Research Questions\n## Dataset & Study Design\n## Methodology\n## Key Results\n## Takeaways\n## Limitations\n## Connections to LENS Lab\n## Open Questions\n## Citation'
      : '# [Exact Paper Title]\n**Authors/Venue:** [from text]\n**Ingested:** ' + today + '\n\n'
        + '## Summary\n## Key Concepts\n## Methodology\n## Key Findings\n## Contributions\n## Limitations\n## Connections to Lab Research\n## Open Questions';
    var detail = deep ? 'Generate a THOROUGH, DETAILED wiki page. Every section must be substantive — pull specific numbers, quotes, table results, and named methods directly from the PDF. No vague summaries.' : 'Generate a structured wiki page.';
    return LENS_WIKI + 'This is an EXTERNAL paper on the reading list. ' + detail + '\n\n'
      + base + 'Other reading list papers in the wiki:\n' + otherIndex + '\n\nLENS Lab research themes: ' + LENS_THEMES + '.\n\n'
      + 'Generate a wiki page with EXACTLY these sections' + (deep ? '. Be specific and detailed in each.' : ':') + '\n\n'
      + sections + '\n\nGround every claim in the PDF text.' + (deep ? ' Be detailed.' : '') + ' Output only the markdown.';
  }

  async function ingestPaper(paper, btn, prefix, indexKey, listId, deep, done) {
    var isLab = paper.type === 'lab';
    btn.disabled = true; statusEl.textContent = 'Reading PDF: ' + paper.name + '…';
    try {
      var result = await extractPdfText(paper.path);
      var today = new Date().toISOString().slice(0, 10);
      var otherIndex = getIndex(indexKey).map(function (e) { return '- ' + e.name; }).join('\n') || '(none yet)';
      statusEl.textContent = (deep ? 'Deep wiki: ' : 'Building wiki page: ') + paper.name + '…';
      var prompt = buildIngestPrompt(paper, result.text, otherIndex, today, isLab, deep);
      var body = { model: ingestModel(), max_tokens: deep ? 3000 : 1200, stream: deep, messages: [{ role: 'user', content: prompt }] };
      var acc = '', content;
      if (deep) {
        await llmStream(body, function (t) { acc += t; statusEl.textContent = 'Writing: ' + paper.name + ' (' + acc.length + ' chars)…'; });
        content = acc;
      } else {
        content = await llmComplete(body);
      }
      if (content) {
        savePage(prefix, paper.key, content.trim());
        var index = getIndex(indexKey), i = index.findIndex(function (e) { return e.key === paper.key; });
        var entry = { key: paper.key, name: paper.name, date: today, pages: result.pages };
        if (i >= 0) index[i] = entry; else index.push(entry);
        saveIndex(indexKey, index);
        if (!isLab) { var sm = content.match(/## Summary\n([\s\S]*?)(?=\n##)/); if (sm) { var sv = sm[1].trim().slice(0, 500); setItem(paper.key, sv); localStorage.setItem(paper.key, sv); } }
        appendLog((deep ? 'deep-ingest' : isLab ? 'lab-ingest' : 'rl-ingest'), paper.name);
        _prompt = null;
      }
      statusEl.textContent = statusLabel(); btn.disabled = false;
      renderIngestPanel(isLab ? LAB_PAPERS : RL_PAPERS, listId, prefix, indexKey);
    } catch (err) {
      statusEl.textContent = 'Error: ' + (err.message || 'Ingest failed.');
      btn.disabled = false;
    }
    if (done) done();
  }

  // ── Lint ──────────────────────────────────────────────────────────
  function toLintBlock(label, items) {
    return items.length ? '## ' + label + '\n\n' + items.map(function (p) { return '### ' + p.name + '\n' + p.content; }).join('\n\n---\n\n') + '\n\n' : '';
  }

  document.getElementById('ks-lint-btn').addEventListener('click', function () {
    var lintBtn = this, outputEl = document.getElementById('ks-lint-output');
    var labIndex = getIndex(LAB_INDEX_KEY), rlIndex = getIndex(WIKI_INDEX_KEY);
    if (browseOnly) { outputEl.textContent = 'Connect with Groq or Ollama to run the health check.'; return; }
    if (!labIndex.length && !rlIndex.length) { outputEl.textContent = 'No wiki pages ingested yet. Use the Lab Papers or Reading List tabs first.'; return; }
    lintBtn.disabled = true; statusEl.textContent = 'Running wiki health check…'; outputEl.textContent = '';

    var labSecs = labIndex.map(function (e) { return { name: e.name, content: getPage(LAB_WIKI_PREFIX, e.key) || '(page not found)' }; });
    var rlSecs  = rlIndex.map(function (e)  { return { name: e.name, content: getPage(WIKI_PREFIX, e.key)     || '(page not found)' }; });
    var all = labSecs.concat(rlSecs), total = all.reduce(function (s, p) { return s + p.content.length; }, 0);
    if (total > 100000) {
      var ratio = 100000 / total;
      all.forEach(function (p) { p.content = p.content.slice(0, Math.floor(p.content.length * ratio)); });
      labSecs = all.slice(0, labSecs.length); rlSecs = all.slice(labSecs.length);
    }

    var prompt = 'You are health-checking the LENS Lab Wiki (Lens for Empirical Navigation in Software Lab, Missouri S&T).\n\n'
      + 'Here are all ingested wiki pages:\n\n' + toLintBlock('Lab Papers', labSecs) + toLintBlock('Reading List (External)', rlSecs)
      + 'Produce a health-check report with exactly these eight sections. For any section with nothing to report, write "None found." — do not pad.\n\n'
      + '## Contradictions\nTwo or more pages making directly opposing empirical claims. Cite exact pages and conflicting claims.\n\n'
      + '## Stale Claims\nClaims in older pages superseded by newer pages. Name the page, the stale claim, and the newer page.\n\n'
      + '## Orphan Pages\nPages never referenced or cross-linked from any other page.\n\n'
      + '## Missing Concept Pages\nImportant concepts appearing repeatedly but with no dedicated wiki page.\n\n'
      + '## Missing Cross-References\nPairs of pages that clearly relate but do not mention each other. Name both and explain the missing connection.\n\n'
      + '## New Questions & Sources\nSpecific questions the wiki raises but does not answer. Ground each in a specific page or finding.\n\n'
      + '## Reading List → Lab Research Connections\nFor each reading list paper, identify which LENS Lab papers it most directly connects to and explain how. '
      + 'Focus on methodological overlap, shared datasets, complementary findings. Be specific — cite exact findings from both sides.\n\n'
      + '## Future Research Directions\nSuggest 5–8 concrete research directions. Each must: (1) name the gap, (2) identify lab papers it builds on, '
      + '(3) identify reading list papers that inform it, and (4) describe a concrete study design. No vague suggestions.';

    var lintText = '';
    llmStream({ model: chatModel(), stream: true, messages: [{ role: 'user', content: prompt }] },
      function (token) { lintText += token; outputEl.textContent = lintText; }
    ).then(function () {
      setItem(LINT_OUTPUT_KEY, lintText); renderMarkdown(outputEl, lintText);
      appendLog('lint', (labIndex.length + rlIndex.length) + ' pages checked');
      lintBtn.disabled = false; statusEl.textContent = statusLabel();
    }).catch(function (err) {
      outputEl.textContent = 'Error: ' + (err.message || 'Could not reach API.');
      lintBtn.disabled = false; statusEl.textContent = statusLabel();
    });
  });

  // ── Init ──────────────────────────────────────────────────────────
  loadFromRepo().then(function () {
    if (getIndex(LAB_INDEX_KEY).length || getIndex(WIKI_INDEX_KEY).length) openChat(true);
  });

})();
