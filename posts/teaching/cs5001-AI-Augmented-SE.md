---
layout: page
title: CS 5001 – Spring 2026
section: teaching
permalink: /posts/teaching/cs5001/
---

## Some Helpful Items

- [Excalidraw](https://excalidraw.com/)
- [Padlet] (https://padlet.com/)

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
