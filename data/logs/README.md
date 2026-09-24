# 📁 REGISTRO DE AUDITORÍA Y HISTORIAL DE LOGS DE ADMISIÓN IA
## ONG MECÁNICA SOCIAL • ÁREA DE TRANSPARENCIA

Este directorio almacena los reportes de salida (el historial de git conserva cada versión) generados por la Consola de Admisión Inteligente de la Escuela Marcelo Orellana Lagos.

### 📐 Estructura Mandatoria del Log:
Cada archivo de registro guardado en esta carpeta debe adoptar la nomenclatura `log_YYYYMMDD_ID.json` y estructurarse bajo los siguientes campos clave:
- `id_solicitud`: Identificador único cruzado con el perfil original.
- `timestamp`: Marca de tiempo ISO 8601 del procesamiento algorítmico.
- `score_ponderado`: Puntuación final sobre 100.0 según los pesos YAML.
- `salvaguarda_sesgo`: Confirmación explícita de mitigación territorial.
- `revisor_humano`: Campo de firma digital reservado para la mesa directiva.

---
*El historial acumulado en esta carpeta es auditable por comisiones civiles y veedurías del Tercer Sector chileno.*
