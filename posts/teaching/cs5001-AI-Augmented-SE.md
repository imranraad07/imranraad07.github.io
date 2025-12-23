---
layout: page
title: CS 5001 – Spring 2026
section: teaching
permalink: /posts/teaching/cs5001/
---

## Some Helpful Items

- [Excalidraw](https://excalidraw.com/)
- [Padlet](https://padlet.com/)
- [Standford CS146S: The Modern Software Developer](https://themodernsoftware.dev/)
- [CMU 17-316/616: AI Tools for Software Development](https://ai-developer-tools.github.io/)
- [USU DATA5570 - Building Software With Artificial Intelligence](https://catalog.usu.edu/courses/DATA5570)
- [A Whole New World](https://annievella.com/posts/a-whole-new-world/)
- [Wikipedia: AI-assisted software development](https://en.wikipedia.org/wiki/AI-assisted_software_development)
- [IBM: AI in software development](https://www.ibm.com/think/topics/ai-in-software-development)
- [ByteByteGo](https://bytebytego.com/) 

## Toos
- Copilot
- Aider.chat
- Ollama
- Qodo[https://www.codium.ai/qodo/]
- replit[https://replit.com/]
- [CircleCI](https://circleci.com/)
- [zencoder.ai](https://zencoder.ai/)
- [Antigravity](https://antigravity.google/)
- [Cursor](https://cursor.com/)
- [Kiro](https://kiro.dev/)

## Topics We will Cover

- [Prompt Engineering](https://www.promptingguide.ai/)
- [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)
- Coding Agent
- Modern Terminals

## Course Materials

<ul>
  {% assign folder = "posts/teaching/CS_5001_Spring_2026_cs5001-AI-Augmented-SE" %}

  {% for file in site.static_files %}
    {% if file.path contains folder %}
      <li>
        <a href="{{ file.path | relative_url }}">
          {{ file.name }}
        </a>
      </li>
    {% endif %}
  {% endfor %}
</ul>
