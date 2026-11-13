document.addEventListener('submit', async function (e) {
    if (e.target.id !== 'ResgistroLocal') {
        return; 
    }

    e.preventDefault();
    const idLocatarioSaved =    window.idLocatarioActual || 
                                sessionStorage.getItem('idLocatarioActual');
    const inputNombre = document.getElementById("nombreLocal");
    const inputCorreo = document.getElementById("correoLoc");
    const inputNum = document.getElementById("numLoc");

    if (!inputNombre || !inputCorreo || !inputNum) {
        return;
    }

    const data = { 
        idLocatario: idLocatarioSaved.trim(),
        nombre: inputNombre.value.trim(),
        correoElectronico: inputCorreo.value.trim(),
        numeroTelefono: inputNum.value.trim()
    };

    try {
        const answer = await fetch(API_BASE + '/api/locatarios/registroLocal', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (answer.ok) {
            alert('¡Bienvenido, ' + data.nombre + '!');
            if (typeof cargarPerfil === 'function') {
                console.log("Cargando perfil...")
                cargarPerfil();
            }
        } else {
            const mensajeError = await answer.text();
            alert('Error (' + answer.status + '): ' + mensajeError);
        }
    } catch (err) {
        console.error("Error en Fetch:", err);
        alert('No se pudo conectar al backend.');
    }
});