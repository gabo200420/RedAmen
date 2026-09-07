---
name: setup-checker
description: Valida el estado del workspace, integridad del config.json y archivos base. No usar para generar ni editar código de la aplicación.
triggers:
  - "chequear estado"
  - "validar workspace"
  - "verificar setup"
  - "diagnostico"
tools:
  - read_file
  - bash
---

# Procedimiento de Diagnóstico
1. Inspecciona el archivo `.agent/config.json` y confirma que la clave `workspace_path` apunte a `.agent/skills`.
2. Comprueba si existe el archivo `.gitignore`.
3. Emite un informe breve indicando que el espacio de trabajo está listo para iniciar el desarrollo.
