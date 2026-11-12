package com.stockfresh.stockfreshweb.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.stockfresh.stockfreshweb.model.Local;
import java.util.List;


public interface LocalReposity extends JpaRepository<Local, Long>
{
    List<Local> findByIdLocatario(String idLocatario);
}
