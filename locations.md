---
layout: default
title: Locations
permalink: /locations/
---

The following list of locations is not in any order. It is generated every time this site
is rebuilt. If you want to see the expected order of this module, you can go to the main page [[Descent into Avernus]] for the scenarios, which will link to the needed locations.

<ul>
{%- for note in site.notes -%}
    {%- if note.tags contains 'location' -%}
        <li style="padding-bottom: 0.6em; list-style: none;"><a href="{{ site.baseurl }}/{{note.url}}">{{ note.title }}</a></li>
    {%- endif -%}
{%- endfor -%}
</ul>
