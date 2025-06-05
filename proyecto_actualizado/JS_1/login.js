// JS_1/login.js
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
            alert('¡Inicio de sesión exitoso!');
            window.location.href = 'formulario.html';
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión.');
    }
});
