function cargarMain() { 
    window.location.href = "index.html"; 
}

function cargarRegistro(){
    fetch('Registro.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar Registro.html');
            }
            return response.text();
        })
        .then(html => {
            document.querySelector('.principal').innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function cargarLogin() {
    fetch('InicioSesionV2.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar InicioSesionV2.html');
            }
            return response.text();
        })
        .then(html => {
            document.querySelector('.principal').innerHTML = html;
            if (typeof inicializarFigura === 'function') {
                inicializarFigura();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function cargarAgregarPerfil() {
    fetch('AgregarLocal.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar AgregarLocal.html');
            }
            return response.text();
        })
        .then(html => {
            document.querySelector('.principal').innerHTML = html;
            const inputIdLocal = document.getElementById('idLocatarioLocal');
            if (inputIdLocal && window.idLocatarioActual) {
                inputIdLocal.value = window.idLocatarioActual;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function cargarPerfil() {
    fetch('Perfil.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar Perfil.html');
            }
            return response.text();
        })
        .then(html => {
            document.querySelector('.principal').innerHTML = html;
        })
        .catch(e => {
            console.error('Error:', e);
        });
}