document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("cyclingForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById("nombre").value;
        const tipoBicicleta = document.getElementById("tipoBicicleta").value;
        const nivel = document.getElementById("nivel").value;
        
        const registro = { nombre, tipoBicicleta, nivel };

        fetch("https://reqres.in/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registro)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Usuario registrado:", data);
            guardarLocalmente(registro); // Cambiado data por registro
            mostrarRegistros();
            obtenerUsuarios();
        })
        .catch(error => console.error("Error al registrar:", error));
    });

    function guardarLocalmente(registro) {
        let registros = JSON.parse(localStorage.getItem("registrosCiclismo")) || [];
        registros.push(registro);
        localStorage.setItem("registrosCiclismo", JSON.stringify(registros));
    }

    function mostrarRegistros() {
        const recordsList = document.getElementById("recordsList");
        recordsList.innerHTML = "";
        const registros = JSON.parse(localStorage.getItem("registrosCiclismo")) || [];
        
        registros.forEach((registro, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${registro.nombre} - ${registro.tipoBicicleta} - ${registro.nivel}`;
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.addEventListener("click", function () {
                registros.splice(index, 1);
                localStorage.setItem("registrosCiclismo", JSON.stringify(registros));
                mostrarRegistros();
            });
            
            listItem.appendChild(deleteBtn);
            recordsList.appendChild(listItem);
        });
    }

    function obtenerUsuarios() {
        let registros = JSON.parse(localStorage.getItem("registrosCiclismo")) || [];
        let lista = document.getElementById("usuarios");
        lista.innerHTML = "";

        registros.forEach(registro => {
            let item = document.createElement("li");
            item.textContent = `${registro.nombre} - ${registro.tipoBicicleta} - ${registro.nivel}`;
            lista.appendChild(item);
        });
    }

    // Asegurar que el botón "Cargar Usuarios" existe antes de asignar el evento
    const cargarUsuariosBtn = document.getElementById("cargarUsuariosBtn");
    if (cargarUsuariosBtn) {
        cargarUsuariosBtn.addEventListener("click", obtenerUsuarios);
    }

    mostrarRegistros();
    obtenerUsuarios();
});
