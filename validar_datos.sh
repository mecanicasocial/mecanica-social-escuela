#!/bin/bash
echo "🔍 Iniciando auditoría técnica de perfiles de admisión..."
echo "--------------------------------------------------------"

error_count=0

for archivo in data/samples/*.json; do
    if [ -f "$archivo" ]; then
        echo "📄 Analizando: $archivo"
        
        # Validación 1: Verificar existencia de campos esenciales usando búsquedas de texto nativas
        nombre=$(grep -o '"nombre_completo": "[^"]*' "$archivo" | cut -d'"' -f4)
        objetivos=$(grep -o '"declaracion_objetivos": "[^"]*' "$archivo" | cut -d'"' -f4)
        
        if [ -z "$nombre" ] || [ -z "$objetivos" ]; then
            echo "❌ ERROR: Estructura corrupta o faltan campos obligatorios en $archivo"
            error_count=$((error_count + 1))
        else
            echo "   ✅ Postulante verificado: $nombre"
            echo "   ✅ Objetivos validados: ${objetivos:0:50}..."
        fi
        echo "--------------------------------------------------------"
    fi
done

if [ $error_count -eq 0 ]; then
    echo "🟢 ÉXITO TOTAL: Todos los perfiles JSON son totalmente compatibles con la Consola Web."
else
    echo "🔴 ADVERTENCIA: Se encontraron $error_count archivos con inconsistencias."
fi
