# Sitio web de la Escuela

Esta carpeta contiene la página pública de la Escuela de Formación Política "Marcelo Orellana Lagos".

## Cómo se publica

- GitHub Pages está configurado con **GitHub Actions** (Settings → Pages → Source).
- El workflow `.github/workflows/pages.yml` publica **solo esta carpeta (`site/`)**.
- Cada `git push` a la rama `main` vuelve a publicar el sitio. Tarda cerca de un minuto.

## Cómo modificar la página

1. Edita **únicamente `site/index.html`**. Es la única página del sitio.
2. Guarda los cambios: `git add site/index.html`, `git commit -m "mensaje"` y `git push`.
3. En la pestaña **Actions** del repositorio, espera el check verde de "Deploy GitHub Pages".
4. Revisa el sitio en una ventana privada para evitar la caché.

## Reglas

- No crear copias de `index.html` en la raíz ni en `docs/`: no se publican.
- Los archivos fuera de `site/` no son accesibles desde la web. Los enlaces con `../` no funcionan.
- No incluir datos personales de postulantes en esta carpeta.

## Dirección del sitio

https://mecanicasocial.github.io/mecanica-social-escuela/
