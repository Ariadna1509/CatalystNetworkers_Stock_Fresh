package com.stockfresh.stockfreshweb.controller;

import com.stockfresh.stockfreshweb.model.Local;
import com.stockfresh.stockfreshweb.model.Locatario;
import com.stockfresh.stockfreshweb.repository.LocalReposity;
import com.stockfresh.stockfreshweb.repository.LocatarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;



@RestController
@CrossOrigin(origins = "http://localhost:5500", allowCredentials = "true")
@RequestMapping("/api/locatarios")

public class LocatarioController {

    private final LocalReposity localReposity;

    public record RegistroLocalRequest(
        String idLocatario,
        String nombre,
        String correoElectronico,
        String numeroTelefono
    ) {}
    
    public record RegistroRequest(
        String idLocatario, 
        String nombre, 
        String correoElectronico,
        String contrasena, 
        String numeroCelular) {}

    public record LoginRequest(
        String idLocatario, 
        String contrasena) {}

    private final LocatarioRepository locatarioRepository;
    //private final LocalReposity localReposity;

    public LocatarioController(LocatarioRepository locatarioRepository, LocalReposity localReposity){
        this.locatarioRepository = locatarioRepository;
        this.localReposity = localReposity;
    }

    @PostMapping("/registro")

    public ResponseEntity<?> registrar(@RequestBody RegistroRequest datos, HttpServletRequest request) {
        if (
            vacio(datos.idLocatario()) || 
            vacio(datos.nombre()) || 
            vacio(datos.correoElectronico()) || 
            vacio(datos.contrasena())
        ) 
        {
            return ResponseEntity.badRequest().body("Completa todos los campos obligatorios");
        }

        String id = datos.idLocatario().trim();

        if (locatarioRepository.existsById(id)) {
            return ResponseEntity.status(409).body("El ID ya existe");
        }

        //Creamos nuevo locatario
        Locatario nuevo = new Locatario();

        nuevo.setIdLocatario(id);
        nuevo.setNombre(datos.nombre().trim());
        nuevo.setCorreoElectronico(datos.correoElectronico().trim());
        nuevo.setNumeroCelular(datos.numeroCelular());
        nuevo.setContrasena(datos.contrasena()); 
        nuevo.setRol("Locatario");                                        

        try {

            locatarioRepository.save(nuevo);

            HttpSession sesionAntigua = request.getSession(false);
            if(sesionAntigua != null)
                {
                    sesionAntigua.invalidate();
                }
            HttpSession sesion = request.getSession(true);
            sesion.setAttribute("rol", "Locatario");
            sesion.setAttribute("idLocatario", nuevo.getIdLocatario());
            sesion.setAttribute("nombre", nuevo.getNombre());

        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(409).body("Ese correo ya está registrado");
            
        }
        return ResponseEntity.ok(Map.of
            (
            "mensaje", "Registro exitoso",
            "idLocatario", nuevo.getIdLocatario(),
            "nombre", nuevo.getNombre(),
            "rol", "Locatario"
        ));
    }

    //Registramos Local 
    @PostMapping("/registroLocal")
    public ResponseEntity<?> registroLocal(@RequestBody RegistroLocalRequest datos) {
        if(
            vacio(datos.nombre())||
            vacio(datos.correoElectronico())||
            vacio(datos.numeroTelefono())) 
            {
                return ResponseEntity.badRequest().body("Completa los datos");
            }

            String idLocatarioTrim = datos.idLocatario().trim();

            if(!locatarioRepository.existsById(idLocatarioTrim))
                {
                    return ResponseEntity.status(404).body("El locatario no existe yiyi");
                }

            Local nuevo = new Local();

            nuevo.setIdLocatario(idLocatarioTrim);
            nuevo.setNombre(datos.nombre.trim());
            nuevo.setCorreoElectronico(datos.correoElectronico.trim());
            nuevo.setNumeroTelefono(datos.numeroTelefono);

            try 
            {
                localReposity.save(nuevo);
            } 
            catch (DataIntegrityViolationException e) 
            {
                return ResponseEntity.status(404).body("Error");
            }
        return ResponseEntity.ok(Map.of("mensaje", "Registro exitoso"));
    }
    

    @PostMapping("/login")

    public ResponseEntity<?> login(@RequestBody LoginRequest datos, HttpServletRequest request) {

        if (vacio(datos.idLocatario()) || vacio(datos.contrasena())) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }

        Optional<Locatario> locatarioOpt = locatarioRepository.findById(datos.idLocatario().trim());

        if (locatarioOpt.isEmpty() || !datos.contrasena().equals(locatarioOpt.get().getContrasena())) 
        {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }

        Locatario l = locatarioOpt.get();
        
        HttpSession vieja = request.getSession(false);
        if (vieja != null) {
            vieja.invalidate();
        }
        
        HttpSession sesion = request.getSession(true);
        sesion.setAttribute("idLocatario", l.getIdLocatario());
        sesion.setAttribute("nombre", l.getNombre());
        sesion.setAttribute("rol", l.getRol());

        return ResponseEntity.ok(Map.of(
                "idLocatario", l.getIdLocatario(),
                "nombre", l.getNombre(),
                "rol", l.getRol())); 
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession sesion) {
        Object id = sesion.getAttribute("idLocatario");   
        if (id == null) {
            return ResponseEntity.status(401).body("No hay sesión activa");
        }
        return ResponseEntity.ok(Map.of(
        "idLocatario", id,
        "nombre", String.valueOf(sesion.getAttribute("nombre")),
        "rol", String.valueOf(sesion.getAttribute("rol"))));
    }
 
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession sesion) {
        sesion.invalidate();
        return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada"));
    }

    private boolean vacio(String texto) {
        return texto == null || texto.isBlank();
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> datosPerfil(HttpSession sesion) {
        Object id = sesion.getAttribute("idLocatario");
        if(id == null)
        {
            return ResponseEntity.status(401).body("Sesion cerrada, inicia sesión");
        }

        String idLocatario = id.toString();

        Optional<Locatario> locatarioOpt = locatarioRepository.findById(idLocatario);
        if(locatarioOpt.isEmpty())
        {
            return ResponseEntity.status(404).body("Locatario no encontrado");
        }

        List<Local> locales = localReposity.findByIdLocatario(idLocatario);
        Locatario locatario = locatarioOpt.get();
        
        locatario.setContrasena(null);
        return ResponseEntity.ok(Map.of(
            "locatario", locatario,
            "local", locales
        ));
    }
}