let catalogoFuentes = [];

function cargarBibliografia() {
	const url = "https://github.io";
	fetch(url)
		.then(res => res.json())
		.then(data => {
			catalogoFuentes = data.fuentes;
			renderizarFuentes(catalogoFuentes);
		})
		.catch(err => console.error("❌ Error cargando biblioteca:", err));
}

function renderizarFuentes(fuentes) {
	const container = document.getElementById("bibliografia-dinamica");
	if (container === null) return;
	container.innerHTML = "";
	
	if (fuentes.length === 0) {
		container.innerHTML = "<p>No se encontraron fuentes asociadas.</p>";
		return;
	}

	fuentes.forEach(f => {
		const card = document.createElement("div");
		card.className = "fuente-card";
		card.innerHTML = `<h5>${f.titulo}</h5><p><strong>Autor:</strong> ${f.autor} (${f.anio})</p><p>${f.resumen}</p><a href="${f.url}" target="_blank">Ver Documento →</a>`;
		container.appendChild(card);
	});
}

function evaluarPostulacionIA() {
	const textarea = document.getElementById("postulacion-texto");
	const textoPostulacion = textarea ? textarea.value.toLowerCase() : "";
	const outputTerminal = document.getElementById("ia-output");
	
	if (!textoPostulacion.trim()) {
		if (outputTerminal) outputTerminal.innerText = "⚠️ Por favor, escribe tus motivaciones antes de evaluar.";
		return;
	}

	if (outputTerminal) outputTerminal.innerHTML = "⏳ [IA-SANDBOX]: Analizando vectores de interés territorial...\n";

	setTimeout(() => {
		let recomendadas = [];
		// Motor asociativo de palabras clave estratégico
		if (textoPostulacion.includes("ley") || textoPostulacion.includes("transparencia") || textoPostulacion.includes("municipal") || textoPostulacion.includes("gobierno")) {
			recomendadas = catalogoFuentes.filter(f => f.id === "ley-transparencia-municipal" || f.tipo === "documento-oficial");
		} else {
			// Si no hay match específico, sugerir las primeras aprobadas por defecto
			recomendadas = catalogoFuentes.slice(0, 2);
		}

		if (outputTerminal) {
			outputTerminal.innerHTML = `🤖 [DICTAMEN IA]: Perfil analizado con éxito.\n\n📚 **Lectura Crítica Recomendada para tu Módulo:**\n`;
			recomendadas.forEach(r => {
				outputTerminal.innerHTML += `• ${r.titulo} (${r.autor})\n`;
			});
		}
		
		// Filtrar y destacar visualmente la rejilla con la bibliografía idónea
		renderizarFuentes(recomendadas);
	}, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
	cargarBibliografia();
	
	// Vincular el botón de la consola de admisión si existe en la interfaz
	const btnEvaluar = document.getElementById("btn-evaluar-ia");
	if (btnEvaluar) {
		btnEvaluar.addEventListener("click", evaluarPostulacionIA);
	}
});
