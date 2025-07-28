package com.testeviva.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.testeviva.backend.model.Endereco;


@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    Optional<Endereco> findByCpf(String cpf);

    boolean existsByCpfAndIdNot(String cpf, Long id);

}
