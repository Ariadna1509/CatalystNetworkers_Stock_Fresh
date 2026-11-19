function inicializarCanasta() {
    const canasta = document.getElementById('canastaMascota');
    const globo = document.getElementById('globoCanasta');
    if (!canasta) return; 

    const ojos = canasta.querySelectorAll('.ojo');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    
    function actualizar() {
        ojos.forEach((ojo) => {
            const c = ojo.getBoundingClientRect();
            const vx = mouse.x - (c.left + c.width / 2);
            const vy = mouse.y - (c.top + c.height / 2);
            const dist = Math.hypot(vx, vy) || 1;
            const fuerza = Math.min(dist / 140, 1);
            const px = (vx / dist) * fuerza;
            const py = (vy / dist) * fuerza;

            const radio = ojo.offsetWidth * 0.28;
            const pupila = ojo.firstElementChild;
            if (pupila) {
                pupila.style.transform = `translate(calc(-50% + ${px * radio}px), calc(-50% + ${py * radio}px))`;
            }
        });
    }

    document.addEventListener('mousemove', (e) => {
        mouse = { x: e.clientX, y: e.clientY };
        actualizar();
    });

    
    (function parpadear() {
        setTimeout(() => {
            canasta.classList.add('parpadea');
            setTimeout(() => canasta.classList.remove('parpadea'), 140);
            parpadear();
        }, 2200 + Math.random() * 3000);
    })();

   
    const frases = [
        "¡Bienvenido al módulo de venta!",
        "Este módulo le permite",
        "Registrar una venta",
        "Eliminar venta",
        "Modificar venta",
        "Consultar todas sus ventas"
    ];
    let indice = 0;
    let timerHabla;

    if (globo) {
        globo.textContent = frases[0];

        globo.addEventListener('click', (e) => {
            e.stopPropagation();

          
            if (indice >= frases.length - 1) {
                canasta.classList.remove('hablando');
                return;
            }

            clearTimeout(timerHabla);

        
            indice++;
            const fraseActual = frases[indice];
            globo.textContent = fraseActual;
            globo.classList.add('visible');

            
            canasta.classList.remove('hablando');
            void canasta.offsetWidth;
            canasta.classList.add('hablando');

            
            const totalPalabras = fraseActual.trim().split(/\s+/).length;
            const duracion = Math.max(900, totalPalabras * 380);

            timerHabla = setTimeout(() => {
                canasta.classList.remove('hablando');
            }, duracion);
        });
    }

    
    actualizar();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCanasta);
} else {
    inicializarCanasta();
}