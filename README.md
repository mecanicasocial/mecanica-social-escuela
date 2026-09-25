# 🏫 Escuela de Formación Política "Marcelo Orellana Lagos"

Plataforma principal y núcleo del ecosistema digital de la ONG Mecánica Social. Diseñada para formar liderazgos institucionales y fortalecer capacidades técnicas en los territorios.

## 🎯 Propósito del Repositorio
Administrar la interfaz web de la academia, la malla modular interactiva y coordinar la ingesta de conocimiento de los estudiantes mediante componentes centralizados.

## 🗺️ Arquitectura del Ecosistema Organizacional
El entorno tecnológico de la ONG opera de forma integrada bajo el modelo de plataforma única:
1. **La Escuela:** Aplicación y portal principal de interacción con el usuario y la Consola de Admisión.
2. **La Biblioteca (Módulo Interno):** Central de contenidos técnicos y marcos legales autorizados. Abastece de forma directa a la Escuela mediante contratos automatizados (`catalogo.json`).
3. **Moodle:** Módulo de aprendizaje evaluativo e interactivo (consume el catálogo unificado de Biblioteca cuando exista).
4. **IA Sandbox (`mecanica-social-ia`):** Clúster de inteligencia artificial que consume los abstracts autorizados desde el repositorio de la Biblioteca para emitir dictámenes automatizados.
