# 🏫 Escuela de Formación Política "Marcelo Orellana Lagos"

Plataforma principal y núcleo del ecosistema digital de la ONG Mecánica Social. Diseñada para formar liderazgos institucionales y fortalecer capacidades técnicas en los territorios.

## 🎯 Propósito del Repositorio

Este repositorio integra:

- Modelo académico y metodología de trabajo.
- Malla curricular y planificación de cursos.
- Guías docentes y fichas de actividades.
- Plantillas de entregables.
- Modelo de Inteligencia Artificial de apoyo a la Escuela.
- Marco de uso responsable de IA.
- Referencias a la bibliografía gobernada en `mecanica-social-biblioteca` (este repositorio ya no mantiene fuentes propias, solo referencias sincronizadas por ID — ver `sincronizar_bibliografia.js`).
- Proyectos de aprendizaje y laboratorio de innovación social.
- Sitio web público desplegable con GitHub Pages.
- Flujos de trabajo para revisión y publicación.

## 🗺️ Arquitectura del Ecosistema Organizacional

El entorno tecnológico de la ONG opera de forma integrada bajo el modelo de plataforma única:

1. **La Escuela:** Aplicación y portal principal de interacción con el usuario y la Consola de Admisión.
2. **La Biblioteca (Módulo Interno):** Central de contenidos técnicos y marcos legales autorizados. Abastece de forma directa a la Escuela mediante contratos automatizados (`catalogo.json`).
3. **Moodle:** Módulo de aprendizaje evaluativo e interactivo (consume el catálogo unificado de Biblioteca cuando exista).
4. **IA Sandbox (`mecanica-social-ia`):** Clúster de inteligencia artificial que consume los abstracts autorizados desde el repositorio de la Biblioteca para emitir dictámenes automatizados.

## Estructura del repositorio

```text
mecanica-social-escuela/
├── docs/
│   ├── institucional/
│   ├── escuela/
│   ├── metodologia/
│   ├── ia/
│   ├── bibliografia/
│   ├── evaluacion/
│   └── proyectos/
├── cursos/
│   ├── 01-democracia-ciudadania/
│   ├── 02-historia-politica-chile/
│   ├── 03-estado-instituciones/
│   ├── 04-constitucion-derechos/
│   ├── 05-politicas-publicas/
│   ├── 06-presupuesto-publico/
│   ├── 07-liderazgo-social/
│   ├── 08-comunicacion-publica/
│   ├── 09-pensamiento-critico/
│   ├── 10-participacion-ciudadana/
│   ├── 11-diseno-proyectos/
│   ├── 12-tecnologia-ia/
│   ├── 13-etica-servicio-publico/
│   ├── 14-innovacion-social/
│   ├── 15-incidencia-gestion/
│   └── 16-proyecto-final/
├── plantillas/
├── prompts/
├── data/
├── site/
├── sincronizar_bibliografia.js
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
└── .devcontainer/
```

## Principio de seguridad

**No almacenar en un repositorio público datos personales, antecedentes sensibles, evaluaciones individuales, credenciales, documentos jurídicos reservados ni información interna que no haya sido autorizada para publicación.**

Se recomienda separar:

1. **Repositorio público:** contenidos educativos, metodología, bibliografía, plantillas y proyectos publicables.
2. **Repositorio institucional privado:** documentación administrativa, contratos, datos personales, evaluaciones y archivos reservados.

## Flujo de trabajo

`Idea → Issue → Planificación → Desarrollo → Revisión → Pull Request → Aprobación → Publicación → Evaluación`

## Sitio

La carpeta `site/` contiene una versión estática de la plataforma y se publica mediante GitHub Pages (ver `.github/workflows/pages.yml`).

## Licenciamiento

Antes de publicar materiales de terceros, verificar sus licencias. Las referencias bibliográficas se incluyen como referencias y no como copias de obras protegidas — la gobernanza de licencias de cada fuente vive en `mecanica-social-biblioteca` (campo `licencia` de cada ficha).
