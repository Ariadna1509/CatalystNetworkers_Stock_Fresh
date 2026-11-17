let sesionActiva = false;

const RUTAS_NAV = {
    ventasInfo: 'Ventas.html',
    cajaInfo: 'Caja.html',
    gestionInfo: 'gestioninventario.html',
    historialInfo: 'historial.html',
    reportesInfo: 'reportesyg.html'
};

function cargarMain() {
    window.location.href = "index.html";
}

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

function actualizarNav(logueado) {
    sesionActiva = logueado;

    for (const [id, ruta] of Object.entries(RUTAS_NAV)) {
        const link = document.getElementById(id);
        if (!link) continue;

        if (logueado) {
            link.href = ruta;
            link.classList.remove('nav-disabled');
            link.removeAttribute('aria-disabled');
        } else {
            link.removeAttribute('href');
            link.classList.add('nav-disabled');
            link.setAttribute('aria-disabled', 'true');
        }
    }

    const login = document.getElementById('button-login-dom');
    if (login) login.style.display = logueado ? 'none' : '';
}

function irHome() {
    if (sesionActiva) {
        cargarDashBoard();
    } else {
        cargarMain();
    }
}

async function cargarDashBoard() { 
    try {
        await cargarVista('dashBoard.html');
        actualizarNav(true);
    } catch (e) {
        console.error('No se pudo cargar el dashboard', e);
    }
}

async function verificarSesion() {
    actualizarNav(false); // estado seguro mientras responde el backend
    try {
        const r = await fetch(API_BASE + '/api/locatarios/me', { credentials: 'include' });
        actualizarNav(r.ok);
    } catch (e) {
        actualizarNav(false);
    }
}

document.addEventListener('DOMContentLoaded', verificarSesion);