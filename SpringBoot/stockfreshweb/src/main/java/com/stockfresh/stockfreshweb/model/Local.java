package com.stockfresh.stockfreshweb.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table (name="LOCAL")
public class Local {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name="idLocal")
    private long idLocal;
    //Hacemos Link 
    @Column (name="idLocatario", nullable = false, length = 50)
    private String idLocatario;
    @Column (name="nombre", nullable = false, length = 100)
    private String nombre;
    @Column (name="correoElectronico", nullable = true, length = 100)
    private String correoElectronico;
    @Column (name="numeroTelefono", nullable = true, length = 15)
    private String numeroTelefono;
    

    //Constructor para el JPA
    public Local(){}
    
    public long getIdLocal() {
        return idLocal;
    }
    public void setIdLocal(int idLocal) {
        this.idLocal = idLocal;
    }
    public String getIdLocatario() {
        return idLocatario;
    }
    public void setIdLocatario(String idLocatario) {
        this.idLocatario = idLocatario;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getCorreoElectronico() {
        return correoElectronico;
    }
    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }
    public String getNumeroTelefono() {
        return numeroTelefono;
    }
    public void setNumeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
    }
    
    
}
