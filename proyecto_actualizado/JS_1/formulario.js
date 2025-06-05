document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para usar esta función.");
        return;
    }

    let idEditando = null;

    const form = document.getElementById("cyclingForm");
    const listaUsuarios = document.getElementById("usuarios");
    const botonEnviar = form.querySelector("button[type='submit']");
    const botonCancelar = document.getElementById("cancelarEdicionBtn");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const tipoBicicleta = document.getElementById("tipo_bicicleta").value;
        const nivel = document.getElementById("nivel").value;

        if (!nombre || !tipoBicicleta || !nivel) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const registro = { nombre, tipo_bicicleta: tipoBicicleta, nivel };

        const url = idEditando
            ? `http://localhost:8000/api/Formulario/${idEditando}`
            : "http://localhost:8000/api/Formulario";

        const metodo = idEditando ? "PUT" : "POST";

        fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(registro)
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error en la solicitud");

            alert(idEditando ? "Registro actualizado correctamente." : "Registro creado correctamente.");
            resetFormulario();
            obtenerUsuarios();
        })
        .catch(error => {
            console.error("Error al enviar:", error);
            alert("Error al procesar el formulario.");
        });
    });

    function editarUsuario(id) {
        fetch(`http://localhost:8000/api/Formulario/${id}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener usuario.");
            return response.json();
        })
        .then(data => {
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("tipo_bicicleta").value = data.tipo_bicicleta;
            document.getElementById("nivel").value = data.nivel;
            idEditando = data.id;

            botonEnviar.textContent = "Actualizar";
            botonCancelar.style.display = "inline-block";
        })
        .catch(error => {
            console.error("Error al cargar usuario:", error);
            alert("No se pudo cargar el usuario para editar.");
        });
    }

    function eliminarUsuario(id) {
        if (!confirm("¿Deseas eliminar este registro?")) return;

        fetch(`http://localhost:8000/api/Formulario/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar usuario.");
            alert("Usuario eliminado correctamente.");
            obtenerUsuarios();
        })
        .catch(error => {
            console.error("Error al eliminar usuario:", error);
            alert("No se pudo eliminar el usuario.");
        });
    }

    botonCancelar.addEventListener("click", function () {
        resetFormulario();
    });

    function resetFormulario() {
        form.reset();
        idEditando = null;
        botonEnviar.textContent = "Guardar";
        botonCancelar.style.display = "none";
    }

    function obtenerUsuarios() {
        listaUsuarios.innerHTML = "";

        fetch("http://localhost:8000/api/Formulario", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor.");

            data.forEach(usuario => {
                const li = document.createElement("li");
                li.innerHTML = `
                    ${usuario.nombre} - ${usuario.tipo_bicicleta} - ${usuario.nivel}
                    <button data-id="${usuario.id}" class="editar">Editar</button>
                    <button data-id="${usuario.id}" class="eliminar">Eliminar</button>
                `;
                listaUsuarios.appendChild(li);
            });

            document.querySelectorAll(".editar").forEach(boton => {
                boton.addEventListener("click", () => editarUsuario(boton.dataset.id));
            });

            document.querySelectorAll(".eliminar").forEach(boton => {
                boton.addEventListener("click", () => eliminarUsuario(boton.dataset.id));
            });
        })
        .catch(error => {
            console.error("Error al obtener usuarios:", error);
            alert("No se pudieron cargar los usuarios.");
        });
    }

    obtenerUsuarios();
});
