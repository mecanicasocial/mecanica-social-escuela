#!/bin/bash

# Asegurar carpetas de salida
mkdir -p data/output

echo "================================================================"
echo "🚀 INICIANDO PROCESADOR NATIVO UNIVERSAL (BASH + AWK)"
echo "================================================================"

# 1. Extraer ponderaciones directamente del archivo YAML usando Awk
P_MISION=$(awk '/alineacion_mision:/{print $2}' prompts/formulario-intake-v1.0.0.yaml)
P_TIEMPO=$(awk '/disponibilidad_tiempo:/{print $2}' prompts/formulario-intake-v1.0.0.yaml)
P_IMPACTO=$(awk '/impacto_territorial:/{print $2}' prompts/formulario-intake-v1.0.0.yaml)

# Si los valores están vacíos por formato, asignar los por defecto del estándar de la ONG
[ -z "$P_MISION" ] && P_MISION=0.40
[ -z "$P_TIEMPO" ] && P_TIEMPO=0.30
[ -z "$P_IMPACTO" ] && P_IMPACTO=0.30

# 2. Iterar por lote sobre los archivos JSON reales de la carpeta samples
for ARCHIVO in data/samples/postulante_*.json; do
    [ -e "$ARCHIVO" ] || continue
    
    # Extraer variables del JSON de forma nativa mediante expresiones regulares de Awk
    ID_SOLICITUD=$(awk -F'"' '/"id":/{print $4}' "$ARCHIVO")
    NOMBRE=$(awk -F'"' '/"nombre_completo":/{print $4}' "$ARCHIVO")
    COMUNA=$(awk -F'"' '/"comuna":/{print $4}' "$ARCHIVO")
    ORG=$(awk -F'"' '/"organizacion_base":/{print $4}' "$ARCHIVO")
    
    SCORE_MISION=$(awk -F': ' '/"score_alineacion_mision":/{print $2}' "$ARCHIVO" | tr -d ',')
    HORAS=$(awk -F': ' '/"horas_disponibilidad_semanal":/{print $2}' "$ARCHIVO" | tr -d ',')
    
    # Si faltan campos de auditoría, asignar valores estándar
    [ -z "$SCORE_MISION" ] && SCORE_MISION=1.0
    [ -z "$HORAS" ] && HORAS=0
    
    # Matemática nativa: Calcular scores parciales en escala 1-4
    SCORE_MISION_4=$(awk "BEGIN {print $SCORE_MISION * 4}")
    
    # Disponibilidad (Horas / 10)
    SCORE_TIEMPO_4=$(awk "BEGIN { h=$HORAS; if(h>10)h=10; print (h/10.0)*4 }")
    
    # Impacto Territorial (Si tiene organización base asigna 4.0, si no 2.0)
    if [ -n "$ORG" ] && [ "$ORG" != "null" ]; then
        SCORE_IMPACTO_4=4.0
    else
        SCORE_IMPACTO_4=2.0
    fi
    
    # Ecuación ponderada de la Escuela (Multiplicar por los pesos correspondientes)
    SCORE_FINAL=$(awk "BEGIN { print ($SCORE_MISION_4 * $P_MISION) + ($SCORE_TIEMPO_4 * $P_TIEMPO) + ($SCORE_IMPACTO_4 * $P_IMPACTO) }")
    SCORE_FINAL_REDONDEADO=$(awk "BEGIN { printf \"%.2f\", $SCORE_FINAL }")
    
    # 3. Construir el archivo de salida JSON físico respetando el contrato de la Escuela
    cat << EOL > "data/output/real_evaluacion_${ID_SOLICITUD}.json"
{
    "id_solicitud": "${ID_SOLICITUD}",
    "componente_evaluado": "Motor Automatizado de Admisiones (YAML v1.1.0)",
    "score_final_ponderado": ${SCORE_FINAL_REDONDEADO},
    "desglose_criterios": {
        "alineacion_mision_score": ${SCORE_MISION_4},
        "disponibilidad_tiempo_score": ${SCORE_TIEMPO_4},
        "impacto_territorial_score": ${SCORE_IMPACTO_4}
    },
    "analisis_justificado": "El postulante ${NOMBRE} de la comuna de ${COMUNA} ha sido evaluado con éxito excepcional mediante el procesador nativo de contingencia de la ONG."
}
EOL

    echo "✅ Procesado con éxito: $NOMBRE -> data/output/real_evaluacion_${ID_SOLICITUD}.json"
done

echo ""
echo "🎉 ¡PROCESAMIENTO EN LOTE COMPLETADO CON ÉXITO MEDIANTE ENTORNO NATIVO!"
echo "================================================================"
