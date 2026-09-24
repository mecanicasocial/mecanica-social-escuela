// Motor de pre-calificación de admisiones - Escuela Marcelo Orellana Lagos
// Uso: node procesador_evaluacion.js
// Lee las ponderaciones desde prompts/formulario-intake-v1.0.0.yaml
// y las fichas desde data/samples/postulante_*.json.
// IMPORTANTE: es una PRE-CALIFICACIÓN. La decisión final la toma siempre el comité humano.

const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const RUTA_YAML = path.join(RAIZ, 'prompts', 'formulario-intake-v1.0.0.yaml');
const CARPETA_FICHAS = path.join(RAIZ, 'data', 'samples');
const CARPETA_SALIDA = path.join(RAIZ, 'data', 'output');

const ESCALA_MAX = 4;        // escala de 0 a 4, igual que la escala humana del YAML
const UMBRAL_REVISION = 3.0; // por debajo de este puntaje se marca "revisión requerida"

// Lee la versión y las ponderaciones del bloque criterios_admisión_intake.
function cargarReglas(rutaYaml) {
    const lineas = fs.readFileSync(rutaYaml, 'utf-8').split(/\r?\n/);
    const pesos = {};
    let version = 'desconocida';
    let dentro = false;

    for (const linea of lineas) {
        const v = linea.match(/^version:\s*"?([^"\s]+)"?/);
        if (v) version = v[1];

        if (/^criterios_admisi[oó]n_intake:/.test(linea)) { dentro = true; continue; }
        if (dentro) {
            if (linea.trim() && !linea.startsWith('  ')) { dentro = false; continue; }
            const m = linea.match(/^\s+([a-z_]+):\s*([0-9.]+)\s*$/);
            if (m) pesos[m[1]] = parseFloat(m[2]);
        }
    }

    const claves = ['alineacion_mision', 'disponibilidad_tiempo', 'impacto_territorial'];
    for (const c of claves) {
        if (typeof pesos[c] !== 'number' || Number.isNaN(pesos[c])) {
            throw new Error(`Falta la ponderación "${c}" en ${rutaYaml}`);
        }
    }
    const suma = claves.reduce((acc, c) => acc + pesos[c], 0);
    if (Math.abs(suma - 1) > 0.001) {
        throw new Error(`Las ponderaciones deben sumar 1.0 y suman ${suma}`);
    }
    return { version, pesos };
}

const redondear = (n) => Math.round(n * 100) / 100;

function evaluarFicha(datos, pesos, version) {
    const id = datos.metadata && datos.metadata.id;
    const nombre = datos.postulante && datos.postulante.nombre_completo;
    const horas = datos.postulacion && datos.postulacion.horas_disponibilidad_semanal;
    const scoreMisionIA = datos.auditoria_ia_previa && datos.auditoria_ia_previa.score_alineacion_mision;

    // Si falta un dato clave NO se inventa un puntaje: se deriva a revisión humana.
    const faltantes = [];
    if (!id) faltantes.push('metadata.id');
    if (!nombre) faltantes.push('postulante.nombre_completo');
    if (typeof horas !== 'number') faltantes.push('postulacion.horas_disponibilidad_semanal');
    if (typeof scoreMisionIA !== 'number') faltantes.push('auditoria_ia_previa.score_alineacion_mision');

    if (faltantes.length > 0) {
        return {
            id: id || 'SIN-ID',
            nombre: nombre || 'SIN-NOMBRE',
            resultado: {
                id_solicitud: id || 'SIN-ID',
                componente_evaluado: `Motor de pre-calificación (YAML v${version})`,
                estado: 'DATOS_INCOMPLETOS',
                campos_faltantes: faltantes,
                revision_humana: 'PENDIENTE',
                analisis_justificado: 'No se calculó puntaje porque faltan datos obligatorios. Requiere revisión humana.'
            }
        };
    }

    const comuna = (datos.postulante && datos.postulante.comuna) || 'no informada';
    const tieneOrg = Boolean(datos.postulante && datos.postulante.organizacion_base);

    // Cada criterio en escala 0 a 1
    const cMision = Math.min(Math.max(scoreMisionIA, 0), 1);
    const cTiempo = Math.min(Math.max(horas, 0) / 10, 1);
    const cImpacto = tieneOrg ? 1.0 : 0.5;

    const final = (cMision * pesos.alineacion_mision)
                + (cTiempo * pesos.disponibilidad_tiempo)
                + (cImpacto * pesos.impacto_territorial);
    const scoreFinal = redondear(final * ESCALA_MAX);

    return {
        id,
        nombre,
        score: scoreFinal,
        comuna,
        resultado: {
            id_solicitud: id,
            componente_evaluado: `Motor de pre-calificación (YAML v${version})`,
            estado: scoreFinal >= UMBRAL_REVISION ? 'RECOMENDADO_PARA_COMITE' : 'REVISION_REQUERIDA',
            score_final_ponderado: scoreFinal,
            escala: `0 a ${ESCALA_MAX}`,
            desglose_criterios: {
                alineacion_mision_score: redondear(cMision * ESCALA_MAX),
                disponibilidad_tiempo_score: redondear(cTiempo * ESCALA_MAX),
                impacto_territorial_score: redondear(cImpacto * ESCALA_MAX)
            },
            revision_humana: 'PENDIENTE',
            analisis_justificado: `Pre-calificación automática de ${nombre} (comuna: ${comuna}). Es solo una recomendación: el comité humano debe ratificar la decisión final.`
        }
    };
}

function main() {
    const { version, pesos } = cargarReglas(RUTA_YAML);
    const pct = (n) => `${redondear(n * 100)}%`;

    console.log('=== Pre-calificación de admisiones ===');
    console.log(`Reglas: YAML v${version}`);
    console.log(`Ponderaciones: misión ${pct(pesos.alineacion_mision)} | tiempo ${pct(pesos.disponibilidad_tiempo)} | impacto ${pct(pesos.impacto_territorial)}`);
    console.log(`Umbral de revisión: ${UMBRAL_REVISION} de ${ESCALA_MAX}\n`);

    fs.mkdirSync(CARPETA_SALIDA, { recursive: true });

    const archivos = fs.readdirSync(CARPETA_FICHAS)
        .filter((f) => f.startsWith('postulante_') && f.endsWith('.json'))
        .sort();

    if (archivos.length === 0) {
        console.error('No se encontraron fichas postulante_*.json en data/samples');
        process.exit(1);
    }

    let incompletas = 0;
    for (const archivo of archivos) {
        let datos;
        try {
            datos = JSON.parse(fs.readFileSync(path.join(CARPETA_FICHAS, archivo), 'utf-8'));
        } catch (e) {
            console.error(`ERROR: ${archivo} no es un JSON válido (${e.message})`);
            incompletas++;
            continue;
        }

        const r = evaluarFicha(datos, pesos, version);
        const salida = path.join(CARPETA_SALIDA, `real_evaluacion_${r.id}.json`);
        fs.writeFileSync(salida, JSON.stringify(r.resultado, null, 4) + '\n', 'utf-8');

        if (r.resultado.estado === 'DATOS_INCOMPLETOS') {
            incompletas++;
            console.log(`AVISO ${archivo}: datos incompletos (${r.resultado.campos_faltantes.join(', ')})`);
        } else {
            console.log(`OK ${r.nombre.padEnd(22)} | ${r.comuna.padEnd(16)} | ${r.score.toFixed(2)}/${ESCALA_MAX}.00 | ${r.resultado.estado}`);
        }
    }

    console.log(`\nProcesadas: ${archivos.length}. Con problemas: ${incompletas}.`);
    console.log('Recuerda: todos los resultados quedan PENDIENTES de revisión humana.');
    if (incompletas > 0) process.exit(1);
}

main();
