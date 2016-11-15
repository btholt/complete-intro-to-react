---
layout: default
---

<div>
  {% for post in site.posts reversed %}
    <a href="{{ post.url | prepend: site.baseurl }}"><h1>{{post.title}}</h1></a>
    {{post.content}}
  {% endfor %}
</div>