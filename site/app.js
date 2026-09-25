function cargarBibliografia() {
	const url = "https://github.io";
	fetch(url).then(res => res.json()).then(data => {
		const container = document.getElementById("bibliografia-dinamica");
		if(container === null) return;
		container.innerHTML = "";
		data.fuentes.forEach(f => {
			const card = document.createElement("div");
			card.className = "fuente-card";
			card.innerHTML = `<h5>${f.titulo}</h5><p><strong>Autor:</strong> ${f.autor} (${f.anio})</p><p>${f.resumen}</p><a href="${f.url}" target="_blank">Ver Documento →</a>`;
			container.appendChild(card);
		});
	}).catch(err => console.error("Error:", err));
}
document.addEventListener("DOMContentLoaded", cargarBibliografia);
