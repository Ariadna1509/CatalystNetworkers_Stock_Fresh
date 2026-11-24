        /*
        //Posicion Inicial ojos (centro exacto de los ojos)
        const caja = eye.getBoundingClientRect(); //dimenciones exactas de los ojos
        const cx = caja.left + caja.width / 2; // Coordenadas exactas desde la izquierda del navegador más la mitas del ancho del ojo (osea donde va la pupila)
        const cy = caja.top + caja.height / 2; // Más de los mismo...

        //Puntero (vector) calcular distancias 
        const vx = e.clientX - cx; //e.ClientX/Y coordenadas del mouse X(x2 - x1) (distancia en x)
        const vy = e.clientY - cy; // Y(y2 -y1) (distancia en y)
        //Pitagorazo =>
        const dist = Math.hypot(vx, vy) || 1; // "|| 1" evita divisiones entre 0, en caso de que el mouse este en el ojo, osea distancia = 0 duh...

        const fuerza = Math.min(dist / 140, 1); //Definimos que tanto se puede mover con 
        //respenco a la distacnia que calculamos del ojo al mouse, nunca mayor a "1"
        const x = (vx / dist) * fuerza * 10; //normaliza la dirección (vector unitario) vector / |vector|
        const y = (vy / dist) * fuerza * 10; // el diez es solo para limitar el movimiento de la pupila a 10px es decir su radio.

        eye.querySelector('.pupil').style.transform =
            `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`; //Modificamos el CSS (por defaoult las pupilas ya estan centradas: transform: translate(-50%, -50%);)
            //solo cambiamos los valores de x & y 
    }); */
let figureAbort = null;
function oculatarElementos(){
    buttonLogin.style.display = "none";
    buttonHome.onclick = function() { 
        cargarDashBoard();
    }
}

function inicializarFigura() {
    const figuras = document.querySelectorAll('.figure_1');   
    if (!figuras.length) return;

    if (figureAbort) figureAbort.abort();
    figureAbort = new AbortController();
    const { signal } = figureAbort;

    const id = document.querySelector('#idLocatario');
    const password = document.querySelector('#inputPassword');

    const estado = { foco: null, flash: null };
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function limitar(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function focuss() {
        if (estado.flash === 'error') return { fijo: [0, 0.9] };    
        if (estado.flash === 'ok') return { fijo: [0, -0.8] };      
        if (estado.foco === 'password') return { fijo: [-1, -0.3] };
        if (estado.foco === 'id') {
            const r = id.getBoundingClientRect();
            return {
                x: r.left + limitar(14 + id.value.length * 8.5, 14, r.width - 10),
                y: r.top + r.height / 2,
            };
        }
        return { x: mouse.x, y: mouse.y };
    }

    function actualizar() {
        const t = focuss();

        figuras.forEach((figure) => {
            const f = figure.getBoundingClientRect();
            const dx = t.fijo
                ? t.fijo[0]
                : limitar((t.x - (f.left + f.width / 2)) / (window.innerWidth / 2), -1, 1);
            figure.style.transform = `skewX(${-dx * 3}deg)`;

            figure.querySelectorAll('.eye').forEach((eye) => {
                let px, py;
                if (t.fijo) {
                    [px, py] = t.fijo;
                } else {
                    const c = eye.getBoundingClientRect();
                    const vx = t.x - (c.left + c.width / 2);
                    const vy = t.y - (c.top + c.height / 2);
                    const dist = Math.hypot(vx, vy) || 1;
                    const fuerza = Math.min(dist / 140, 1);
                    px = (vx / dist) * fuerza;
                    py = (vy / dist) * fuerza;
                }

                const radio = eye.offsetWidth * 0.28;
                eye.firstElementChild.style.transform =
                    `translate(calc(-50% + ${px * radio}px), calc(-50% + ${py * radio}px))`;
            });
        });
    }

    function reaccionar(tipo, clases, ms) {
        estado.flash = tipo;
        figuras.forEach((f) => f.classList.add(...clases));
        actualizar();

        setTimeout(() => {
            estado.flash = null;
            figuras.forEach((f) => f.classList.remove(...clases));
            actualizar();
        }, ms);
    }

    document.addEventListener('mousemove', (e) => {
        mouse = { x: e.clientX, y: e.clientY };
        actualizar();
    }, { signal });
    id.addEventListener('focus', () => { estado.foco = 'id'; actualizar(); });
    id.addEventListener('input', actualizar);
    password.addEventListener('focus', () => { estado.foco = 'password'; actualizar(); });
    [id, password].forEach((i) =>
        i.addEventListener('blur', () => { estado.foco = null; actualizar(); })
    ); 

    //Query
    document.querySelector('#form').addEventListener('submit', async function (e) {
        e.preventDefault(); 
        const idClean = id.value.trim();
        const passwordClean = password.value;

        try {
            const respuesta = await fetch(API_BASE + '/api/locatarios/login', {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idLocatario: idClean, contrasena: passwordClean })
            });
            
            if (respuesta.ok) {
                reaccionar('ok', ['salta', 'feliz'], 1600); 
                const locatario = await respuesta.json();
                //alert('¡Bienvenido ' + locatario.nombre + '!');
                setTimeout(() => {
                    localStorage.setItem('idLocatario', locatario.idLocatario);
                    actualizarNav(true);     // marca sesión activa y oculta el botón de login
                    cargarDashBoard();
                }, 500); 
                //SeCIÓN INHABIL 
            
            } else if (respuesta.status === 401) {
                reaccionar('error', ['sacudir', 'tiste'], 1200);
                //alert('ID o contraseña incorrectos.');
            } else {
                alert('Error del servidor (' + respuesta.status + ').');
            }
        } catch (error) {
            console.error(error);
            alert('No se pudo conectar con el servidor.');
    }
});

    const look = document.querySelector('#ver');
    look.addEventListener('click', () => {
        const visible = password.type === 'text';
        password.type = visible ? 'password' : 'text';
        look.textContent = visible ? 'Ver' : 'Ocultar';
        figuras.forEach((f) => f.classList.toggle('timido', !visible));
    });

    (function parpadear() {
        if (!document.body.contains(figuras[0])) return;  
        setTimeout(() => {
            const f = figuras[Math.floor(Math.random() * figuras.length)];
            f.classList.add('parpadea');
            setTimeout(() => f.classList.remove('parpadea'), 140);
            parpadear();
        }, 2200 + Math.random() * 3000);
    })();

    actualizar();
}

document.addEventListener('DOMContentLoaded', inicializarFigura);