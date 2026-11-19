function inicializarCanasta() {
    const canasta = document.getElementById('canastaMascota');
    const globo = document.getElementById('globoCanasta');
    const boton = document.getElementById('botonCanasta');
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
        "¡Bienvenido al módulo de reportes y gráficas!",
        "Este módulo le permite",
        "Consultar gráficas",
        "Ver total de ventas",
        "Ver total de transacciones",
        "Ver total de productos"
    ];
    let indice = 0;
    let timerHabla;

    function decir(texto) {
        globo.textContent = texto;
        // reinicia la animación de la boca
        canasta.classList.remove('hablando');
        void canasta.offsetWidth;
        canasta.classList.add('hablando');

        clearTimeout(timerHabla);
        const totalPalabras = texto.trim().split(/\s+/).length;
        const duracion = Math.max(900, totalPalabras * 380);
        timerHabla = setTimeout(() => canasta.classList.remove('hablando'), duracion);
    }

    function siguienteFrase() {
        indice = (indice + 1) % frases.length;   // al terminar, vuelve a empezar
        decir(frases[indice]);
    }

    if (globo && boton) {
        globo.textContent = frases[0];

        // Clic en la canasta (o en el globo) = siguiente mensaje
        boton.addEventListener('click', siguienteFrase);
        globo.addEventListener('click', siguienteFrase);

        // También funciona con teclado (Enter o Espacio)
        boton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                siguienteFrase();
            }
        });
    }

    actualizar();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCanasta);
} else {
    inicializarCanasta();
}