---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

Mia Mohammad Imran is an Assistant Professor in the Department of Computer Science at Missouri University of Science and Technology. His research interests encompass Software Engineering, Empirical Study, Machine Learning, LLMs, and NLP. My particular focus is in various aspects of bug reports, code quality, and novice programmers.

<div class="quick-links">
  <a href="/posts/documents/CV.pdf" class="pill">CV</a>
  <a href="https://linkedin.com/in/imranraad" class="pill" target="_blank" rel="noopener">LinkedIn</a>
  <a href="https://github.com/imranraad07" class="pill" target="_blank" rel="noopener">GitHub</a>
  <a href="https://scholar.google.com/citations?user=uVCaRjAAAAAJ&hl=en" class="pill" target="_blank" rel="noopener">Google Scholar</a>
  <a href="mailto:imranm@mst.edu" class="pill">Email</a>
</div>


*I'm currently seeking collaborations with industry partners and enthusiastic undergraduate students to join my research team. Please contact me if you are interested.*

### News

- **Jan 2026** — Our Short Paper [“TODO: Fix the Mess Gemini Created”: Towards Understanding GenAI-Induced Self-Admitted Technical Debt](/posts/documents/TechDebt_26_SATD_in_SA_genAI_Comments.pdf) got accepted at TechDebt 2026! First paper of Mujahid (Congrats Mujahid)!

- **Jan 2026** — Our MSR 2026 Mining Challenge paper [Where Do AI Coding Agents Fail? An Empirical Study of Failed Agentic Pull Requests in GitHub](https://arxiv.org/abs/2601.15195) got accepted.

- **Dec 2025** — Our paper [**Toxicity Ahead: Forecasting Conversational Derailment on GitHub**](/posts/documents/ICSE_2026_Derailment.pdf) got accepted at ICSE 2026 (Research Track)!

- **Dec 2025** — Our paper [**Learning Programming in Informal Spaces: Using Emotion as a Lens to Understand Novice Struggles on r/learnprogramming**](/posts/documents/ICSE_SEET_2026.pdf) got accepted at ICSE-SEET 2026!

- **Dec 2025** — Our extended abstract [OLAF: Towards Robust LLM-Based Annotation Framework in Empirical Software Engineering](https://se-llm-annotation-olaf.github.io/olaf/) got accepted at WSESE Workshop 2026 (ICSE Companion)!

- **Summer 2025** — [Best Reviewer award at EASE 2025!](/posts/documents/ReviewerAward-Mia.pdf)

- **March 2025** — Our paper [**”Silent Is Not Actually Silent”: An Investigation of Toxicity on Bug Report Discussion**](https://arxiv.org/pdf/2503.10072) got accepted at FSE-IVR 2026!

- **March 2025** — Our paper [LLPut: Investigating Large Language Models for Bug Report-Based Input Generation](https://dl.acm.org/doi/pdf/10.1145/3696630.3728701) got accepted at LLanMER 2025 (FSE Companion)!



### Research

My research broadly sits at the intersection of **Software Engineering**, **NLP**, and **Empirical Methods**. Below are my active research themes with links to related papers.

---

**GenAI & Code Quality**

Empirical study of how generative AI tools affect software development practice and quality.


- **"TODO: Fix the Mess Gemini Created": Towards Understanding GenAI-Induced Self-Admitted Technical Debt**
  *International Conference on Technical Debt (TechDebt) 2026* \[[PDF](/posts/documents/TechDebt_26_SATD_in_SA_genAI_Comments.pdf)\] \[[Zenodo](https://zenodo.org/records/18194031)\]
  Investigates how developers explicitly acknowledge AI-generated technical debt in source code comments.
  <div class="finding"><strong>Key finding:</strong> Among 81 annotated comments, 15 cases of GenAI-Induced SATD (GIST) were identified — a new category where developers admit AI-generated code introduced debt requiring future fixes. AI plays four roles in SATD: Source, Catalyst, Mitigator, and Neutral. Also Cognitive form of technical Debt was observed.</div>

- **OLAF: Towards Robust LLM-Based Annotation Framework in Empirical Software Engineering**
  *WSESE Workshop 2026, ICSE Companion* \[[PDF](/posts/documents/WSESE_2026.pdf)\] \[[Project](https://se-llm-annotation-olaf.github.io/olaf/)\]
  Proposes a robust LLM-based annotation framework to support large-scale labeling in empirical SE research.
  <div class="finding"><strong>Key finding:</strong> LLM-based annotation can closely replicate human judgment on SE datasets, with structured prompting strategies significantly improving annotation consistency and scalability.</div>

- **Where Do AI Coding Agents Fail? An Empirical Study of Failed Agentic Pull Requests in GitHub**
  *Mining Software Repositories (MSR) — Mining Challenge 2026* \[[ArXiV](https://arxiv.org/abs/2601.15195)\]
  Analyzes 33,000 agent-authored pull requests on GitHub to identify what makes AI-generated contributions fail to merge.
  <div class="finding"><strong>Key finding:</strong> AI agents succeed most at documentation and CI/CD tasks but fail most at bug-fixing. Rejected PRs touch more files and make larger changes — but socio-technical misalignment (e.g., implementing features maintainers didn't want) is a major underexplored failure driver.</div>

---

**Toxicity & Conversational Derailment in Open Source Software**

Understanding and mitigating harmful communication in open source developer communities.

- **Toxicity Ahead: Forecasting Conversational Derailment on GitHub**
  *International Conference on Software Engineering (ICSE) 2026* \[[PDF](/posts/documents/ICSE_2026_Derailment.pdf)\] \[[Replication](https://zenodo.org/records/15725618)\]
  Proactively forecasts toxic derailment in GitHub issue threads using LLM-generated Summaries of Conversation Dynamics (SCDs).
  <div class="finding"><strong>Key finding:</strong> Achieved F1 = 0.901 (Qwen) and F1 = 0.852 (Llama) on 159 toxic + 207 non-toxic threads. The model generalizes to external benchmarks (F1 = 0.797 on Raman et al.), outperforming few-shot baselines.</div>

- **Understanding and Predicting Derailment in Toxic Conversations on GitHub**
  \[[ArXiV](https://arxiv.org/pdf/2503.02191)\] \[[Replication](https://anonymous.4open.science/r/derailment-oss-replication-C8B1)\]
  A comprehensive empirical study of derailment patterns in toxic OSS conversations with LLM-based prediction.
  <div class="finding"><strong>Key finding:</strong> Achieved 70% F1-score in derailment prediction. Linguistic markers like second-person pronouns, negation terms, and "Bitter Frustration and Impatience" emotion tone are strong early predictors of impending toxicity.</div>

- ***"Silent Is Not Actually Silent"*: An Investigation of Toxicity on Bug Report Discussion**
  *Foundations of Software Engineering — Ideas, Visions and Reflections (FSE-IVR) 2026* \[[ArXiV](https://arxiv.org/pdf/2503.10072)\] \[[Replication](https://zenodo.org/records/15015619)\]
  Qualitatively investigates the nature and impact of toxicity specifically within bug report discussions.
  <div class="finding"><strong>Key finding:</strong> ~40% of analyzed bug threads (81 of 203) contained toxicity. Top drivers: misaligned perceptions of bug severity/priority, unresolved tool frustrations, and communication lapses. Toxic threads are measurably less likely to produce a linked PR resolution.</div>

- **Incivility in Open Source Projects: A Comprehensive Annotated Dataset of Locked GitHub Issue Threads**
  *Mining Software Repositories (MSR) 2024* \[[PDF](/posts/documents/Incivility_SE.pdf)\] \[[Repo](https://github.com/vcu-swim-lab/incivility-dataset)\]
  Releases a large annotated dataset of locked GitHub issues spanning 2013–2023 to support incivility research in OSS.
  <div class="finding"><strong>Key finding:</strong> From 338 locked ("too-heated") issues, 1,365 comments were annotated across 9 uncivil feature types, 8 triggers, 5 target categories, and 7 consequence types — the most comprehensive OSS incivility dataset to date.</div>

---

**Emotion & Communication in Software Engineering**

Using emotion as a lens to study and improve developer communication.

- **Learning Programming in Informal Spaces: Using Emotion as a Lens to Understand Novice Struggles on r/learnprogramming**
  *ICSE — Software Engineering Education and Training (SEET) 2026* \[[PDF](/posts/documents/ICSE_SEET_2026.pdf)\] \[[Replication](https://zenodo.org/records/17145615)\]
  Studies emotional experiences of novice programmers through 1,500 annotated posts from r/learnprogramming.
  <div class="finding"><strong>Key finding:</strong> Frustration and confusion dominate novice programming struggles. DBSCAN clustering revealed distinct emotional patterns tied to specific learning barriers — pointing to the need for affect-aware intelligent tutoring in informal learning spaces.</div>

- **Uncovering the Causes of Emotions in Software Developer Communication Using Zero-shot LLMs**
  *International Conference on Software Engineering (ICSE) 2024* \[[PDF](/posts/documents/Emotion_Cause_SE.pdf)\] \[[Repo](https://github.com/vcu-swim-lab/SE-Emotion-Cause-Replication)\]
  Applies zero-shot LLMs to identify root causes of emotions expressed in developer communications.
  <div class="finding"><strong>Key finding:</strong> Zero-shot LLMs can identify emotion causes in SE texts without fine-tuning. Technical disagreements, ambiguous requirements, and unresponsive collaborators are the most frequent emotional triggers in developer communication.</div>

- **Shedding Light on Software Engineering-specific Metaphors and Idioms**
  *International Conference on Software Engineering (ICSE) 2024* \[[PDF](/posts/documents/Figurative_Language_SE.pdf)\] \[[Repo](https://github.com/vcu-swim-lab/SE-Figurative-Language)\]
  Studies the prevalence and role of figurative language in software engineering texts.
  <div class="finding"><strong>Key finding:</strong> Figurative language is pervasive in SE communication and significantly degrades NLP tool performance — SE-specific models must account for domain idioms to avoid systematic misinterpretation.</div>

- **Emotion Classification In Software Engineering Texts: A Comparative Analysis of Pre-trained Transformers**
  *Natural Language Processing in Software Engineering (NLBSE) 2024* \[[PDF](/posts/documents/Emotion_SE_LLM.pdf)\]
  Benchmarks pre-trained transformer models for emotion classification across SE communication datasets.
  <div class="finding"><strong>Key finding:</strong> No single transformer dominates across all SE emotion datasets — performance varies significantly by data source, showing that domain-aware model selection is critical rather than defaulting to general-purpose LLMs.</div>

- **Data Augmentation for Improving Emotion Recognition in Software Engineering Communication**
  *Automated Software Engineering (ASE) 2022* \[[PDF](/posts/documents/Emotion_SE_Data_Augmentation.pdf)\] \[[Repo](https://github.com/vcu-swim-lab/SE-Emotion-Study)\]
  Applies data augmentation strategies to address severe label scarcity in SE emotion recognition.
  <div class="finding"><strong>Key finding:</strong> Data augmentation consistently improves minority-class emotion detection — demonstrating that class imbalance, not model capacity, is the primary bottleneck in SE emotion recognition.</div>

---

**Bug Reports & Developer Tools**

Improving software quality through better bug reporting and developer tooling.

- **LLPut: Investigating Large Language Models for Bug Report-Based Input Generation**
  *ACM Foundations of Software Engineering (FSE) Companion 2025* \[[ACM](https://dl.acm.org/doi/pdf/10.1145/3696630.3728701)\] \[[Replication](https://zenodo.org/records/15092886)\]
  Evaluates LLMs for automatically generating failure-reproducing test inputs from bug report descriptions.
  <div class="finding"><strong>Key finding:</strong> LLMs show promise for bug-report-based input generation but struggle with complex reproduction steps and environment-specific bugs — pointing to gaps that future LLM-based testing tools must address.</div>

- **Using Clarification Questions to Improve Software Developers' Web Search**
  *Information and Software Technology (IST) 2022* \[[PDF](/posts/documents/Web_CQ.pdf)\] \[[Repo](https://github.com/vcu-swim-lab/Query-Expansion-Questions)\]
  Uses targeted clarification questions to expand and refine developer web search queries for better results.
  <div class="finding"><strong>Key finding:</strong> Asking developers a small number of clarification questions about their intent significantly improves query quality and search result relevance, outperforming standard query expansion baselines.</div>

- **Automatically Selecting Follow-up Questions for Deficient Bug Reports**
  *Mining Software Repositories (MSR) 2021* \[[PDF](/posts/documents/BugAutoQ.pdf)\] \[[Repo](https://github.com/vcu-swim-lab/BugAutoQ)\]
  Automatically ranks follow-up questions to elicit missing information from incomplete bug reports, trained on 25,000 GitHub issues.
  <div class="finding"><strong>Key finding:</strong> Neural ranking models substantially outperform retrieval baselines in selecting the most relevant follow-up questions — showing that bug report deficiencies follow learnable patterns that can be addressed automatically.</div>

---


### Reviewing and Community Services
 
**Conference Committee**: 
 * AIware 2026
 * FSE 2026 (Idea and Vision Track)
 * SANER 2026 (Short Paper Track)
 * EASE 2026 (Short Paper Track)
 * SIGCSE TS 2026 (Experience Reports and Tools Track)
 * EASE 2025 (Short Paper Track)
 * EASE 2025 (Learnings & Reflections within the Learnings/Reflections of Evaluation and Assessment projects in Software Engineering-track)
 * AI IDE 2025 (FSE Workshop)

**Journals:** Reviewer at journals such as IEEE Transactions on Software Engineering, Empirical Software Engineering, Information and Software Technology, Automated Software Engineering.

### Prospective students

If you are already an undergrad student student at Missouri S&T, please feel free to email me to talk about potential research opportunities.

**Not Hiring PhD or Master's students.**

If you're interested in joining my research team, please contact me at imranm@mst.edu. In your email, include a brief introduction, interests and attach your CV (if you can). I am currently recruiting students at all levels, from undergraduate and masters (if you are already in Missouri S&T), to graduate. If you don't hear back from me within a week, feel free to send a follow-up message as things can get busy. 

When you are emailing, here is a guideline you can follow: [Link](https://uvasrg.github.io/prospective/)


### Advising

- Abdullah Al Mujahid, PhD (2025-)

- Fariha Fariha Tanjim Shifat, PhD (2025-)


### Previously Advised

- Hariswar Baburaj (2026)

- Carson Kempf, Undergraduate (2025)

- Piper Jeffries, Undergraduate (2025)

