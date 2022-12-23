## Trips

<ul>
  {% for page in site.pages %}
  {% if page.is_trip %}
  <li>
    <a href="{{ page.url }}">{{ page.title }}</a>
  </li>
  {% endif %}
  {% endfor %}
</ul>
