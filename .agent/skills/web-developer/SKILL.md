---
name: web-developer
description: Construye y modifica sitios web usando exclusivamente HTML5 semántico, CSS3 moderno y JavaScript vanilla. No usar para React, Vue, Vite o gestores de paquetes npm.
triggers:
  - "pagina web"
  - "sitio web"
  - "html"
  - "css"
  - "javascript"
  - "maquetar"
tools:
  - read_file
  - write_file
---

# Reglas de Desarrollo Web Nativo
1. **Estructura de Archivos Obligatoria:**
   - `index.html`: Solo HTML5 semántico (`<header>`, `<main>`, `<section>`, `<footer>`). Prohibido código CSS o JS inline.
   - `css/styles.css`: CSS3 con variables (Custom Properties), Flexbox y CSS Grid. Enfoque Mobile-First.
   - `js/main.js`: Vanilla JavaScript moderno (ES6+), modular y sin dependencias externas ni CDNs no autorizados.

2. **Criterios de Calidad:**
   - La interfaz debe ser responsive (adaptable a móviles y escritorio).
   - Uso obligatorio de etiquetas semánticas para accesibilidad (a11y).
   - No generar archivos `.min.js` ni bundlers.
