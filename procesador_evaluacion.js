const fs = require('fs');
const path = require('path');

// Parser manual básico para leer el archivo YAML institucional de la ONG
function cargarYamlBasico(rutaYaml) {
    const contenido = fs.readFileSync(rutaYaml, 'utf-8');
    const lineas = contenido.split('\n');
    const ponderaciones = {};
    let capturar = false;

    for (let linea of lineas) {
        if (linea.includes('criterios_admisión_intake:')) {
            capturar = true;
            continue;
        }
        if (capturar) {
            if (linea.trim() && !linea.startsWith('  ')) {
                capturar = false;
            } else if (linea.includes(':')) {
                const [clave, valor] = linea.split(':');
                ponderaciones[clave.trim()] = parseFloat(valor.trim());
            }
        }
    }
    return ponderaciones;
}

function evaluarLotePostulantes(carpetaSamples, rutaYamlReglas, carpetaSalida) {
    // Cargar ponderaciones del YAML v1.1.0
    const criterios = cargarYamlBasico(rutaYamlReglas);
    const pMision = criterios['alineacion_mision'] || 0.40;
    const pDisponibilidad = criterios['disponibilidad_tiempo'] || 0.30;
    const pImpacto = criterios['impacto_territorial'] || 0.30;

    console.log("================================================================");
    console.log("🚀 MOTOR DE EVALUACIÓN EN LOTE CONSOLIDADO EN NODE.JS");
    console.log("================================================================");
    console.log(`Ponderaciones: Misión (${pMision*100}%) | Tiempo (${pDisponibilidad*100}%) | Impacto (${pImpacto*100}%)\n`);

    if (!fs.existsSync(carpetaSalida)) {
        fs.mkdirSync(carpetaSalida, { recursive: true });
    }

    // Escanear los archivos JSON de postulantes
    const archivos = fs.readdirSync(carpetaSamples).filter(f => f.startsWith('postulante_') && f.endsWith('.json'));

    archivos.sort().forEach(archivo => {
        const rutaJson = path.join(carpetaSamples, archivo);
        const datos = JSON.parse(fs.readFileSync(rutaJson, 'utf-8'));

        const nombre = datos.postulante?.nombre_completo || "Anónimo";
        const comuna = datos.postulante?.comuna || "Desconocida";
        const idPostulacion = datos.metadata?.id || "INT-UNKNOWN";

        // Métricas base de entrada
        const scoreMision = datos.auditoria_ia_previa?.score_alineacion_mision || 1.0;
        const horas = datos.postulacion?.horas_disponibilidad_semanal || 0;
        const scoreDisponibilidad = Math.min(horas / 10.0, 1.0);
        const scoreImpacto = datos.postulante?.organizacion_base ? 1.0 : 0.5;

        // Ecuación matemática y escalado institucional (1.0 a 4.0)
        const scoreFinal = (scoreMision * pMision) + (scoreDisponibilidad * pDisponibilidad) + (scoreImpacto * pImpacto);
        const scoreFinalRedondeado = Math.round(scoreFinal * 4 * 100) / 100;

        // Estructura oficial del contrato de salida JSON de la Escuela
        const resultadoFinal = {
            "id_solicitud": idPostulacion,
            "componente_evaluado": "Motor Automatizado de Admisiones (YAML v1.1.0)",
            "score_final_ponderado": scoreFinalRedondeado,
            "desglose_criterios": {
                "alineacion_mision_score": Math.round(scoreMision * 4 * 100) / 100,
                "disponibilidad_tiempo_score": Math.round(scoreDisponibilidad * 4 * 100) / 100,
                "impacto_territorial_score": Math.round(scoreImpacto * 4 * 100) / 100
            },
            "analisis_justificado": `El postulante ${nombre} de la comuna de ${comuna} ha sido evaluado exitosamente en lote mediante el procesador estable de Node.js.`
        };

        // Guardar archivo físico en el disco
        const rutaSalida = path.join(carpetaSalida, `real_evaluacion_${idPostulacion}.json`);
        fs.writeFileSync(rutaSalida, JSON.stringify(resultadoFinal, null, 4), 'utf-8');

        console.log(`✅ Procesado: ${nombre.padEnd(23)} | Comuna: ${comuna.padEnd(16)} | Score: ${scoreFinalRedondeado.toFixed(2)}/4.00`);
    });

    console.log("\n🎉 ¡PROCESAMIENTO EN LOTE COMPLETADO CON ÉXITO ABSOLUTO!");
}

evaluarLotePostulantes("data/samples", "prompts/formulario-intake-v1.0.0.yaml", "data/output");
