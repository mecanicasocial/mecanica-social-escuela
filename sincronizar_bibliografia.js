const fs = require('fs');
const path = require('path');

const rutaCatalogo = '../mecanica-social-biblioteca/site/catalogo.json';

if (!fs.existsSync(rutaCatalogo)) {
  console.log('[INFO] No se encontró catalogo.json local. Se utilizará la versión de repositorio.');
  process.exit(0);
}

const catalogo = JSON.parse(fs.readFileSync(rutaCatalogo, 'utf8'));
const fuentes = catalogo.fuentes || [];

const mapaCursos = {};

fuentes.forEach(fuente => {
  (fuente.modulos || []).forEach(modulo => {
    if (!mapaCursos[modulo]) mapaCursos[modulo] = [];
    mapaCursos[modulo].push(fuente);
  });
});

Object.keys(mapaCursos).forEach(modulo => {
  const rutaBiblio = path.join(__dirname, 'cursos', modulo, 'Bibliografia.md');
  if (fs.existsSync(path.dirname(rutaBiblio))) {
    let contenido = `# Bibliografía Oficial - ${modulo}\n\n`;
    contenido += `*Sincronizado automáticamente desde Mecánica Social Biblioteca*\n\n`;

    mapaCursos[modulo].forEach(f => {
      contenido += `### [${f.id}] ${f.titulo}\n`;
      contenido += `- **Tipo:** ${f.tipo}\n`;
      contenido += `- **Licencia:** ${f.licencia}\n`;
      contenido += `- **Revisor:** ${f.revisor}\n\n`;
    });

    fs.writeFileSync(rutaBiblio, contenido, 'utf8');
    console.log(`[OK] Bibliografía actualizada para: ${modulo}`);
  }
});
