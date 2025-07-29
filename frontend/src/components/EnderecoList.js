import React from 'react';

const EnderecoList = ({ enderecos, onEdit, onDelete }) => {

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
            try {
                await onDelete(id);
                alert('Endereço excluído com sucesso!');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro ao excluir endereço. Tente novamente.';
                alert(errorMessage);
            }
        }
    };

    return (
        <div>
            <h2>Lista de Endereços</h2>
            {enderecos.length === 0 ? (
                <p>Nenhum endereço cadastrado.</p>
            ) : (
                <ul>
                    {enderecos.map(endereco => (
                        <li key={endereco.id}>
                            <div><strong>ID:</strong> {endereco.id}</div>
                            <div><strong>Nome:</strong> {endereco.nome}</div>
                            <div><strong>CPF:</strong> {endereco.cpf}</div>
                            <div><strong>CEP:</strong> {endereco.cep}</div>
                            <div><strong>Logradouro:</strong> {endereco.logradouro}</div>
                            <div><strong>Bairro:</strong> {endereco.bairro}</div>
                            <div><strong>Cidade:</strong> {endereco.cidade}</div>
                            <div><strong>Estado:</strong> {endereco.estado}</div>
                            <button onClick={() => onEdit(endereco)}>Editar</button>
                            <button onClick={() => handleDelete(endereco.id)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EnderecoList;
