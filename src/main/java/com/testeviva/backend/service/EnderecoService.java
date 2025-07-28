package com.testeviva.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gtbr.ViaCepClient;
import com.gtbr.domain.Cep; 
import com.testeviva.backend.model.Endereco;
import com.testeviva.backend.repository.EnderecoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 

public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public Endereco salvarEndereco(Endereco endereco) {

        if (!isValidCpfFormat(endereco.getCpf())) {
            throw new IllegalArgumentException("CPF em formato inválido ou com dígitos verificadores incorretos.");
            //TODO: exceção de negócio personalizada?
        }

        if (enderecoRepository.findByCpf(endereco.getCpf()).isPresent()) {
            throw new IllegalArgumentException("Já existe um usuário com este CPF.");
            //TODO: exceção de negócio personalizada?
        }

       try {
            Cep viaCepData = ViaCepClient.findCep(endereco.getCep());

            if (viaCepData == null || viaCepData.getLogradouro() == null || viaCepData.getLogradouro().isEmpty()) {
                throw new IllegalArgumentException("CEP não encontrado ou inválido na ViaCEP.");
            }

            endereco.setLogradouro(viaCepData.getLogradouro());
            endereco.setBairro(viaCepData.getBairro());
            endereco.setCidade(viaCepData.getLocalidade());
            endereco.setEstado(viaCepData.getUf());

        } catch (Exception e) {
            System.err.println("Erro ao buscar CEP: " + e.getMessage());
            throw new RuntimeException("Falha na comunicação com a API. Tente novamente.", e);
        }

        return enderecoRepository.save(endereco);
    }

    public Endereco atualizarEndereco(Long id, Endereco enderecoAtualizado) {
        Optional<Endereco> enderecoExistenteOpt = enderecoRepository.findById(id);

        if (enderecoExistenteOpt.isEmpty()) {
            throw new IllegalArgumentException("Endereço não encontrado para atualização.");
        }

        Endereco enderecoExistente = enderecoExistenteOpt.get();

        if (!isValidCpfFormat(enderecoAtualizado.getCpf())) {
            throw new IllegalArgumentException("CPF em formato inválido ou com dígitos verificadores incorretos.");
        }

        if (enderecoRepository.existsByCpfAndIdNot(enderecoAtualizado.getCpf(), id)) {
            throw new IllegalArgumentException("O CPF informado já pertence a outro usuário.");
        }

        if (!enderecoExistente.getCep().equals(enderecoAtualizado.getCep())) {

            try {
                Cep viaCepData = ViaCepClient.findCep(enderecoAtualizado.getCep());

                if (viaCepData == null || viaCepData.getLogradouro() == null || viaCepData.getLogradouro().isEmpty()) {
                        throw new IllegalArgumentException("Novo CEP não encontrado ou inválido na ViaCEP. Verifique o número.");
                }

                enderecoExistente.setLogradouro(viaCepData.getLogradouro());
                enderecoExistente.setBairro(viaCepData.getBairro());
                enderecoExistente.setCidade(viaCepData.getLocalidade());
                enderecoExistente.setEstado(viaCepData.getUf());

                } catch (RuntimeException e) {
                    System.err.println("Erro na chamada ViaCEP da biblioteca ao atualizar: " + e.getMessage());
                    throw new RuntimeException("Falha na comunicação com o serviço ViaCEP. Por favor, tente novamente.", e);
                }

            } else {
                enderecoExistente.setLogradouro(enderecoAtualizado.getLogradouro());
                enderecoExistente.setBairro(enderecoAtualizado.getBairro());
                enderecoExistente.setCidade(enderecoAtualizado.getCidade());
                enderecoExistente.setEstado(enderecoAtualizado.getEstado());
            }

            enderecoExistente.setNome(enderecoAtualizado.getNome());
            enderecoExistente.setCpf(enderecoAtualizado.getCpf());
            enderecoExistente.setCep(enderecoAtualizado.getCep());

        return enderecoRepository.save(enderecoExistente);
    }

    public List<Endereco> listarTodosEnderecos() {
        return enderecoRepository.findAll();
    }


    private boolean isValidCpfFormat(String cpf) {

        if (cpf == null) return false;
        cpf = cpf.replaceAll("\\D", "");

        if (cpf.length() != 11) return false;

        // Verifica se todos os dígitos são iguais (ex: 00000000000, 11111111111 etc.)
        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            // Cálculo do primeiro dígito verificador
            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }
            int firstCheckDigit = 11 - (sum % 11);
            if (firstCheckDigit >= 10) firstCheckDigit = 0;

            // Cálculo do segundo dígito verificador
            sum = 0;
            for (int i = 0; i < 10; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }
            int secondCheckDigit = 11 - (sum % 11);
            if (secondCheckDigit >= 10) secondCheckDigit = 0;

            // Verifica se os dígitos calculados são iguais aos informados
            return firstCheckDigit == Character.getNumericValue(cpf.charAt(9)) &&
                secondCheckDigit == Character.getNumericValue(cpf.charAt(10));
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public void deletarEndereco(Long id) {
        if (!enderecoRepository.existsById(id)) {
            throw new IllegalArgumentException("Endereço não encontrado para exclusão.");
        }
        enderecoRepository.deleteById(id);
    }

}
