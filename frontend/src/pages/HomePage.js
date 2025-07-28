import React, { useState, useEffect } from 'react';
import EnderecoForm from '../components/EnderecoForm';
import EnderecoList from '../components/EnderecoList';
import { getAllEnderecos, deleteEndereco } from '../api/enderecoApi';

const HomePage = () => {
    const [enderecos, setEnderecos] = useState([]);
    const [enderecoToEdit, setEnderecoToEdit] = useState(null);

    const fetchEnderecos = async () => {
        try {
            const response = await getAllEnderecos();
            setEnderecos(response.data);
        } catch (error) {
            console.error('Erro ao buscar endereços:', error);
        }
    };

    useEffect(() => {
        fetchEnderecos();
    }, []);

    const handleSaveSuccess = (savedEndereco) => {
        fetchEnderecos();
        setEnderecoToEdit(null);
    };

    const handleEdit = (endereco) => {
        setEnderecoToEdit(endereco);
    };

    const handleDelete = async (id) => {
        try {
            await deleteEndereco(id);
            alert('Endereço excluído com sucesso!');
            fetchEnderecos();
        } catch (error) {
            alert('Erro ao excluir endereço');
        }
    };

    return (
        <div>
            <h1>Gerenciamento de Endereços</h1>
            <EnderecoForm
                enderecoToEdit={enderecoToEdit}
                onSaveSuccess={handleSaveSuccess}
            />
            <EnderecoList
                enderecos={enderecos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default HomePage;
