#!/bin/bash

echo "================================================================"
echo "🚀 INICIANDO SIMULADOR DE EVALUACIÓN EN MASA - CONSOLA VIRTUAL IA"
echo "================================================================"
echo "Cargando directrices del prompt base desde docs/ia/02-prompt-base.md..."
echo ""

# Crear carpeta de salida para resguardar los resultados
mkdir -p data/output

# Ciclo para procesar quirúrgicamente cada una de las tres fichas json existentes
for i in 01 02 03; do
    FICHERO="data/samples/postulante_${i}.json"
    
    if [ -f "$FICHERO" ]; then
        # Extraer el nombre del postulante mediante herramientas de texto nativas
        NOMBRE=$(grep -o '"nombre_completo": "[^"]*' "$FICHERO" | cut -d'"' -f4)
        COMUNA=$(grep -o '"comuna": "[^"]*' "$FICHERO" | cut -d'"' -f4)
        
        echo "⏳ Evaluando Ficha #$i: [$NOMBRE] de la comuna de [$COMUNA]..."
        
        # Simular de forma estricta el formato de salida JSON estructurado exigido por el motor YAML
        cat << EOL > "data/output/resultado_postulante_${i}.json"
{
  "id_solicitud": "INT-2026-BATCH${i}",
  "componente_evaluado": "Formulario Intake Virtual v1.1.0",
  "score_final_ponderado": 3.4,
  "desglose_criterios": {
    "Seccion_1_Diagnostico": "Adecuado - Presenta datos del territorio chileno.",
    "Seccion_2_Propuesta": "En desarrollo - Requiere profundizar enfoque de Marco Logico.",
    "Seccion_3_Matriz_Impacto": "Adecuado - Cumple con la Declaracion de Etica de IA."
  },
  "analisis_justificado": "El postulante demuestra una solida alineacion con la mision de ONG Mecanica Social. Evaluacion pre-calificada bajo la Matriz de Alineacion de la Escuela Marcelo Orellana Lagos."
}
EOL
        echo "✅ Logs generados exitosamente en: data/output/resultado_postulante_${i}.json"
        echo "----------------------------------------------------------------"
    else
        echo "❌ Archivo $FICHERO no encontrado en el taller."
    fi
done

echo "🎉 ¡PROCESAMIENTO EN MASA COMPLETADO CON EXÍTÓ EXCEPCIONAL!"
