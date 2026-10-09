let catalogoFuentes = [];
// TODO: reemplazar por la URL real del backend
const API_BASE_URL = "PENDIENTE_URL_REAL";

function cargarBibliografia() {
        const url = "https://mecanicasocial.github.io/mecanica-social-biblioteca/site/catalogo.json";
        fetch(url)
                .then(res => res.json())
                .then(data => {
                        catalogoFuentes = data.fuentes || [];
                        renderizarFuentes(catalogoFuentes);
                })
                .catch(err =>
                        console.error("❌ Error cargando biblioteca:", err)
                );
}

async function evaluarPostulacionIA() {

	const textarea =
		document.getElementById("postulacion-texto");

	const checkbox =
		document.getElementById("acepta-politica");

	const output =
		document.getElementById("ia-output");

	const boton =
		document.getElementById("btn-evaluar-ia");

	if (!textarea || !checkbox || !output || !boton) {
		return;
	}

	output.classList.remove("hidden");
	output.style.color = "";

	boton.disabled = true;

	try {

		const payload = {
			texto_formulario: textarea.value,
			acepta_politica_privacidad: checkbox.checked,
			version_terminos: "v2.0",
			locale: "es-CL"
		};

		const response = await fetch(
			`${API_BASE_URL}/v1/postulacion-publica`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload)
			}
		);

		if (response.status === 202) {

			const data = await response.json();

			output.style.color = "";
			output.textContent = data.mensaje;

			setTimeout(() => {
				boton.disabled = false;
			}, 5000);

			return;
		}

		if (response.status === 400) {

			const data = await response.json();

			output.style.color = "red";
			output.textContent = data.detail;

			boton.disabled = false;
			return;
		}

		if (response.status === 429) {

			output.style.color = "red";
			output.textContent =
				"Demasiados intentos, por favor espera unos minutos.";

			boton.disabled = false;
			return;
		}

		if (response.status === 422) {

			const data = await response.json();

			output.style.color = "red";

			output.textContent =
				data.detail ||
				"El formulario contiene errores.";

			boton.disabled = false;
			return;
		}

		output.style.color = "red";

		output.textContent =
			"No fue posible procesar la solicitud.";

		boton.disabled = false;

	} catch (error) {

		console.error(error);

		output.style.color = "red";

		output.textContent =
			"Error de conexión. Inténtalo nuevamente.";

		boton.disabled = false;
	}
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

document.addEventListener("DOMContentLoaded", () => {
	cargarBibliografia();

	// Vincular el botón de la consola de admisión si existe en la interfaz
	const btnEvaluar = document.getElementById("btn-evaluar-ia");
	if (btnEvaluar) {
		btnEvaluar.addEventListener("click", evaluarPostulacionIA);
	}
});
