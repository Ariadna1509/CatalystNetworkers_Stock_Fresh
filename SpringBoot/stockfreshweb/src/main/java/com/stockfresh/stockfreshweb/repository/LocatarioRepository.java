package com.stockfresh.stockfreshweb.repository;

import com.stockfresh.stockfreshweb.model.Locatario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface LocatarioRepository extends JpaRepository<Locatario, String> 
{
    List<Locatario> findByIdLocatario(String idLocatario);
}