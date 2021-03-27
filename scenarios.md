---
layout: home
title: Scenarios
permalink: /scenarios/
---

The following list of scenarios is not in any order. It is generated every time this site
is rebuilt. If you want to see the expected order of this module, you can go to the main page [[Descent into Avernus]].

<ul>
{%- for note in site.notes -%}
    {%- if note.tags contains 'scenario' -%}
        <li style="padding-bottom: 0.6em; list-style: none;"><a href="{{ site.baseurl }}/{{note.url}}">{{ note.title }}</a></li>
    {%- endif -%}
{%- endfor -%}
</ul>
