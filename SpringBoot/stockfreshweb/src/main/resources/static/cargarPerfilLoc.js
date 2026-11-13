/*async function renderPerfiles() {

    console.log("Entro en la función");
    try {
        const perfil = await fetch('/api/locatarios/perfil', 
            {
            method: 'GET',
            credentials: 'include'
        });

        if (perfil.status === 401) {
            window.location.href = 'InicioSesionV2.html';
            return;
        }
        if (!perfil.ok) {
            throw new Error('Error al obtener los datos del perfil');
        }
        console.log("Si paso todos los if's")
        const datos = await perfil.json();

        //Pruebitas bonitas jsjsjs
        console.log('3. Datos completos recibidos:', datos);
        console.log('4. Objeto locatario:', datos.locatario);
        console.log('5. Arreglo local:', datos.local);
        console.log("holiii");

        // Guardar respaldo en localStorage
        localStorage.setItem('locatario', JSON.stringify(datos.locatario));
        localStorage.setItem('locales', JSON.stringify(datos.local));

        
        const locatario = datos.locatario;

        document.getElementById('nomLoc').value = locatario.nombre;
        document.getElementById('idLoc').value = locatario.idLocatario;
        document.getElementById('correoLoc').value = locatario.correoElectronico;
        document.getElementById('telLoc').value = locatario.numeroCelular;

        
        if (datos.local && datos.local.length > 0) {
            const primerLocal = datos.local[0];
            document.getElementById('nomLocal').textContent = primerLocal.nombre;
            document.getElementById('correoLocal').textContent = primerLocal.correoElectronico;
            document.getElementById('telLocal').textContent = primerLocal.numeroTelefono;
        }
        console.log("Se paso por la cola todo yiyi")

    } catch (error) {
        console.error('Error:', error);
    }
    nombreComp = document.getElementById("nomCompy");
    nombreComp.textContent = "Wassup?"
    console.log("Se paso por la cola todo yiyi2")

}
*/
async function cargarDatosPerfil() {
    console.log('entramos en función cargasDatosPerfil');
    try {
        const respuesta = await fetch(API_BASE + '/api/locatarios/perfil', {
            method: 'GET',
            credentials: 'include'
        });

        if (respuesta.status === 401) {
            console.log("Maybe aquí esta el error, por el que manda a login duh...")
            cargarLogin();
            return;
        }
        if (!respuesta.ok) {
            throw new Error('Error al obtener los datos del perfil');
        }

        const datos = await respuesta.json();
        const locatario = datos.locatario;

        localStorage.setItem('locatario', JSON.stringify(locatario));
        localStorage.setItem('locales', JSON.stringify(datos.local));

        document.getElementById('nomLoc').value = locatario.nombre ?? '';
        document.getElementById('idLoc').value = locatario.idLocatario ?? '';
        document.getElementById('correoLoc').value = locatario.correoElectronico ?? '';
        document.getElementById('telLoc').value = locatario.numeroCelular ?? '';

        if (datos.local && datos.local.length > 0) {
            const primerLocal = datos.local[0];
            document.getElementById('nomLocal').textContent = primerLocal.nombre;
            document.getElementById('correoLocal').textContent = primerLocal.correoElectronico ?? '-';
            document.getElementById('telLocal').textContent = primerLocal.numeroTelefono ?? '-';
        }

        const btnCerrar = document.getElementById('btnCerrarSesion');
        if (btnCerrar) {
            btnCerrar.onclick = cerrarSesion;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cerrarSesion() {
    try {
        await fetch(API_BASE + '/api/locatarios/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
    localStorage.removeItem('locatario');
    localStorage.removeItem('locales');
    sessionStorage.removeItem('idLocatarioActual');
    cargarMain();
}

