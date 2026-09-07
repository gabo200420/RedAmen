---
name: security-auditor
description: Audita archivos HTML y JS en busca de vulnerabilidades comunes de frontend (XSS, secretos expuestos, eval). No usar para escribir código nuevo.
triggers:
  - "auditar seguridad"
  - "chequear vulnerabilidades"
  - "escanear codigo"
  - "security check"
tools:
  - read_file
  - bash
---

# Procedimiento de Auditoría de Seguridad Frontend
1. **Detección de XSS:**
   - Busca instancias de `.innerHTML`, `document.write` o eventos HTML inline (`onclick="..."`, `onload="..."`). Si existen, exige reemplazarlas por `textContent` o `addEventListener`.
2. **Detección de Ejecución Dinámica:**
   - Comprueba que no existan llamadas a `eval()`.
3. **Escaneo de Credenciales:**
   - Verifica que no haya llaves de API, tokens JWT o contraseñas hardcodeadas en ningún archivo `.js` o `.html`.
4. **Cabeceras y Enlaces Externos:**
   - Confirma que todos los enlaces con `target="_blank"` contengan el atributo `rel="noopener noreferrer"` para prevenir ataques de tabnabbing inverso.
5. **Resultado:**
   - Emite un reporte tabular con los archivos analizados, hallazgos (Severidad: Alta, Media, Baja) y la corrección exacta sugerida.
