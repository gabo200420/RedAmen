---
name: web-developer
description: Construye interfaces web modernas utilizando exclusivamente HTML5 semántico, CSS3 avanzado y JavaScript vanilla. Aplica estándares visuales contemporáneos (Design Tokens, microinteracciones, layout fluido). No usar para frameworks (React/Vue) ni paquetes npm.
triggers:
  - "pagina web"
  - "sitio web"
  - "html"
  - "css"
  - "javascript"
  - "maquetar"
  - "diseno"
  - "ui"
tools:
  - read_file
  - write_file
---

# Reglas de Arquitectura y Código
1. **Estructura de Archivos:**
   - `index.html`: Marcado semántico riguroso (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`). Prohibido estilos o scripts inline.
   - `css/styles.css`: Estilos centrales desacoplados del markup.
   - `js/main.js`: Lógica interactiva vanilla modular (ES6+).

# Estándares de Diseño UI/UX Moderno
1. **Sistema de Tokens CSS (en `:root`):**
   - **Paleta de Color:** Definir variables semánticas (`--bg-primary`, `--bg-surface`, `--text-primary`, `--text-muted`, `--accent`, `--border-subtle`). Evitar contrastes crudos de negro `#000000` sobre blanco `#ffffff`.
   - **Escala de Espaciado:** Basada estrictamente en múltiplos de 4px u 8px (`0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem`).
   - **Tipografía Fluida:** Escalar tamaños de fuente usando `clamp()` para evitar saltos bruscos entre resoluciones.

2. **Acabado Visual y Componentes:**
   - **Bordes y Superficies:** Usar bordes semitransparentes sutiles (`1px solid rgba(255, 255, 255, 0.08)` o `rgba(0, 0, 0, 0.08)`) y radios de borde consistentes (`8px` a `16px`).
   - **Elevación:** Prohibidas sombras duras; emplear sombras multicapa difusas con baja opacidad.
   - **Microinteracciones:** Todas las transiciones de botones y enlaces deben ser suaves (`transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1)`). Definir estados explícitos para `:hover`, `:active` y `:focus-visible`.

3. **Responsividad:**
   - Enfoque *Mobile-First*.
   - Prohibido el uso de anchos fijos en contenedores principales (`width: 1200px`); utilizar `width: 100%`, `max-width` y `margin-inline: auto`.
