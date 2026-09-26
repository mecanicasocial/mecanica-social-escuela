const fs = require('fs');
const path = require('path');

const rutaCatalogoLocal = path.join(__dirname, '../mecanica-social-biblioteca/site/catalogo.json');

function procesarCatalogo(catalogo) {
  const fuentes = catalogo.fuentes || [];
  const mapaCursos = {};

  fuentes.forEach(fuente => {
    (fuente.modulos || []).forEach(modulo => {
      if (!mapaCursos[modulo]) mapaCursos[modulo] = [];
      mapaCursos[modulo].push(fuente);
    });
  });

  let actualizados = 0;
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
      actualizados++;
    }
  });
  console.log(`\nSincronización finalizada. ${actualizados} módulos actualizados.`);
}

if (fs.existsSync(rutaCatalogoLocal)) {
  console.log('[INFO] Cargando catalogo.json desde ruta local...');
  const catalogo = JSON.parse(fs.readFileSync(rutaCatalogoLocal, 'utf8'));
  procesarCatalogo(catalogo);
} else {
  console.error('[ERROR] No se encontró el catálogo local en:', rutaCatalogoLocal);
}
