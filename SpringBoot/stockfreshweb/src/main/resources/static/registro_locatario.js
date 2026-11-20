let datosPaso1 = {};

document.addEventListener('submit', async function (e) {
    const formId = e.target.id;

    if (formId === 'formPaso1' || formId === 'formPaso2') {
        e.preventDefault();
    } else {
        return;  
    }

    if (formId === 'formPaso1') {
        datosPaso1 = {
            nombre: document.getElementById('nombreLocatario').value.trim(),
            correo: document.getElementById('correoLoc').value.trim(),
            celular: document.getElementById('numLoc').value.trim()
        };

        document.getElementById('formPaso1').style.display = 'none';
        document.getElementById('formPaso2').style.display = 'block';
    }

    if (formId === 'formPaso2') {
        try {
            const respuesta = await fetch(API_BASE + '/api/locatarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    idLocatario: document.getElementById('idLocatario').value.trim(),
                    nombre: datosPaso1.nombre,
                    correoElectronico: datosPaso1.correo,
                    numeroCelular: datosPaso1.celular,
                    contrasena: document.getElementById('password').value,
                })
            });

            if (respuesta.ok) {
                alert('¡Registro exitoso en Stock & Fresh!');

                
                const idSaved = document.getElementById('idLocatario').value.trim();

                window.idLocatarioActual = idSaved;

                sessionStorage.setItem('idLocatarioActual', idSaved);
                
                
                await cargarAgregarPerfil();

            } else {
                const mensajeError = await respuesta.text();
                alert('Error al registrar (' + respuesta.status + '): ' + mensajeError);
            }
        } catch (err) {
            console.error("Error en la petición Fetch:", err);
            alert('No se pudo conectar con el servidor backend.');
        }
    }
});