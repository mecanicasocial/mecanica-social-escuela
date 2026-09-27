const fs = require('fs');
const path = require('path');

const rutaCatalogoLocal = path.join(__dirname, '../mecanica-social-biblioteca/site/catalogo.json');

// Todo lo que un curador escriba DEBAJO de este marcador nunca se borra, sin importar
// cuántas veces se vuelva a correr este script. Antes, el script sobrescribía el archivo
// completo (fs.writeFileSync sin fusionar), lo que habría borrado bibliografía académica
// curada a mano si algún día una fuente de Biblioteca etiquetaba ese curso en 'modulos'.
const MARCADOR_FIN = '<!-- FIN-SINCRONIZADO: todo lo que escribas debajo de esta línea se conserva siempre -->';

function generarBloqueSincronizado(modulo, fuentes) {
  let contenido = `# Bibliografía Oficial - ${modulo}\n\n`;
  contenido += `*Sincronizado automáticamente desde Mecánica Social Biblioteca — no edites a mano esta sección, se sobrescribe en cada corrida. Para agregar contenido propio, escríbelo debajo del marcador de más abajo.*\n\n`;

  if (fuentes.length === 0) {
    contenido += `_Todavía no hay fuentes de Biblioteca etiquetadas para este curso._\n\n`;
  }

  fuentes.forEach(f => {
    contenido += `### [${f.id}] ${f.titulo}\n`;
    contenido += `- **Autor:** ${f.autor || 'S/I'}\n`;
    contenido += `- **Año:** ${f.anio || 'S/I'}\n`;
    contenido += `- **Tipo:** ${f.tipo}\n`;
    contenido += `- **Licencia:** ${f.licencia}\n`;
    contenido += `- **Revisor:** ${f.revisor}\n`;
    if (f.url) contenido += `- **Enlace:** ${f.url}\n`;
    contenido += `\n`;
  });

  contenido += `${MARCADOR_FIN}\n\n`;
  return contenido;
}

function procesarCatalogo(catalogo) {
  const fuentes = catalogo.fuentes || [];
  const mapaCursos = {};

  fuentes.forEach(fuente => {
    (fuente.modulos || []).forEach(modulo => {
      if (!mapaCursos[modulo]) mapaCursos[modulo] = [];
      mapaCursos[modulo].push(fuente);
    });
  });

  // Antes solo se procesaban los cursos que YA tenían al menos una fuente en Biblioteca,
  // así que un curso sin fuentes sincronizadas (como el 02) nunca recibía el mismo
  // encabezado/marcador que los demás y terminaba con un formato distinto. Ahora se
  // recorren TODAS las carpetas de curso, para que la estructura sea idéntica en los 16,
  // tengan o no fuentes sincronizadas todavía.
  const carpetaCursos = path.join(__dirname, 'cursos');
  const todosLosCursos = fs.readdirSync(carpetaCursos).filter(nombre =>
    fs.statSync(path.join(carpetaCursos, nombre)).isDirectory()
  );

  let actualizados = 0;

  todosLosCursos.forEach(modulo => {
    const rutaBiblio = path.join(carpetaCursos, modulo, 'Bibliografia.md');
    mapaCursos[modulo] = mapaCursos[modulo] || [];

    let contenidoManual = '';
    if (fs.existsSync(rutaBiblio)) {
      const actual = fs.readFileSync(rutaBiblio, 'utf8');
      const idx = actual.indexOf(MARCADOR_FIN);
      if (idx !== -1) {
        // Ya tenía marcador: se conserva solo lo que el curador escribió después de él.
        contenidoManual = actual.slice(idx + MARCADOR_FIN.length).replace(/^\n+/, '');
      } else {
        // Primera vez que se sincroniza este archivo y no tiene marcador: todo lo que
        // había antes se trata como contenido manual y se preserva completo debajo,
        // en vez de perderlo.
        contenidoManual = actual.trim() ? actual + '\n' : '';
      }
    }

    const bloqueNuevo = generarBloqueSincronizado(modulo, mapaCursos[modulo]);
    fs.writeFileSync(rutaBiblio, bloqueNuevo + contenidoManual, 'utf8');
    console.log(`[OK] Bibliografía actualizada para: ${modulo} (contenido manual preservado: ${contenidoManual.length} caracteres)`);
    actualizados++;
  });

  console.log(`\nSincronización finalizada. ${actualizados} módulo(s) actualizado(s).`);
}

if (fs.existsSync(rutaCatalogoLocal)) {
  console.log('[INFO] Cargando catalogo.json desde ruta local...');
  const catalogo = JSON.parse(fs.readFileSync(rutaCatalogoLocal, 'utf8'));
  procesarCatalogo(catalogo);
} else {
  console.error('[ERROR] No se encontró el catálogo local en:', rutaCatalogoLocal);
}
