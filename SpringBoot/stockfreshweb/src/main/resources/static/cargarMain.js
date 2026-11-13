/*function cargarMain() { 
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
    console.log(">> Dando clic para cargar Perfil.html");
    fetch('Perfil.html').then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar Perfil.html');
            }
            return response.text();
        }).then(html => {
            document.querySelector('.principal').innerHTML = html;
            console.log(">> Perfil.html inyectado con éxito en el DOM");
            if(typeof renderPerfiles === 'function')
                {
                    renderPerfiles();
                }
        }).catch(e => {
            console.error('Error al cargar la vista:', e);
        });
}

function verPerfil() {
    console.log("Cargando perfil....")
    fetch('Perfil.html').then(response => {
        if(!response.ok) 
            {
                throw new Error('No se cargo Perfil.html');
            }
            return response.text();
    }).then(html => {
        document.querySelector('.principal').innerHTML = html;
    }).catch(e => {
        console.error('Errar al cargar la vista', e);
    });
}
*/
function cargarMain() {
    window.location.href = "index.html";
}

// Carga un fragmento HTML dentro de <main class="principal">
async function cargarVista(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('No se pudo cargar ' + url);
    }
    document.querySelector('.principal').innerHTML = await response.text();
}

async function cargarRegistro() {
    try {
        await cargarVista('Registro.html');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarLogin() {
    try {
        await cargarVista('InicioSesionV2.html');
        if (typeof inicializarFigura === 'function') {
            inicializarFigura();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarAgregarPerfil() {
    try {
        await cargarVista('AgregarLocal.html');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarPerfil() {
    console.log('Endposint 1 (cargarPerfil() || cargarMain.js)')
    try {
        await cargarVista('Perfil.html');
        if (typeof cargarDatosPerfil === 'function') {
            await cargarDatosPerfil();
        }
    } catch (error) {
        console.error('Error al cargar la vista:', error);
    }
}

function verPerfil() {
    cargarPerfil();
}

async function cargarDashBoard() {
    console.log('Endpoint 2 | Cargando dashboard ... ');
    try
    {
        await cargarVista('dashBoard.html');
    } catch (e) {
        console.error('Es una simple carga, pero fallo, yiiy', e);
    }
}