document.getElementById("openForm").addEventListener("click", function (event) {
    event.preventDefault();
    let formContainer = document.getElementById("formContainer");

    // Verifica si el formulario ya está insertado
    if (!document.getElementById("cyclingForm")) {
        fetch("formulario.html")
            .then(response => response.text())
            .then(html => {
                formContainer.innerHTML = html;
                formContainer.scrollIntoView({ behavior: "smooth" });
                cargarFormularioJS();
            })
            .catch(error => console.error("Error cargando el formulario:", error));
    } else {
        formContainer.scrollIntoView({ behavior: "smooth" });
    }
});

function cargarFormularioJS() {
    let script = document.createElement("script");
    script.src = "formulario.js"; // Asegúrate de que la ruta es correcta
    script.defer = true;
    document.body.appendChild(script);
}
