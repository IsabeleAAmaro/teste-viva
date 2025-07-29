import React, { useState, useEffect, useCallback } from 'react';
import { createEndereco, updateEndereco, getEnderecoByCep } from '../api/enderecoApi';
import './EnderecoForm.css';

const EnderecoForm = ({ enderecoToEdit, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''
    });
    const [errors, setErrors] = useState({});
    const [cepError, setCepError] = useState('');

    useEffect(() => {
        if (enderecoToEdit) {
            setFormData(enderecoToEdit);
        } else {
            setFormData({
                nome: '',
                cpf: '',
                cep: '',
                logradouro: '',
                bairro: '',
                cidade: '',
                estado: ''
            });
        }
    }, [enderecoToEdit]);

    const validate = () => {
        const newErrors = {};
        if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
        if (!formData.cpf) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!/^\d{11}$/.test(formData.cpf)) {
            newErrors.cpf = 'CPF deve conter 11 dígitos numéricos';
        }
        if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            let response;
            if (enderecoToEdit) {
                response = await updateEndereco(enderecoToEdit.id, formData);
                alert('Endereço atualizado com sucesso!');
            } else {
                response = await createEndereco(formData);
                alert('Endereço criado com sucesso!');
                setFormData({ nome: '', cpf: '', cep: '', logradouro: '', bairro: '', cidade: '', estado: '' });
            }
            onSaveSuccess(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao salvar endereço';
            alert(errorMessage);
            setErrors({ api: errorMessage });
        }
    };

    const handleCepChange = useCallback(async (cep) => {
        const cepValue = cep.replace(/\D/g, '');
        if (cepValue.length === 8) {
            try {
                const response = await getEnderecoByCep(cepValue);
                const { logradouro, bairro, cidade, estado } = response.data;
                setFormData(prev => ({
                    ...prev,
                    logradouro,
                    bairro,
                    cidade,
                    estado
                }));
                setCepError('');
            } catch (error) {
                setFormData(prev => ({
                    ...prev,
                    logradouro: '',
                    bairro: '',
                    cidade: '',
                    estado: ''
                }));
                setCepError('CEP não encontrado');
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'cep') {
            handleCepChange(value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="endereco-form">
            <h2>{enderecoToEdit ? 'Editar Endereço' : 'Novo Endereço'}</h2>
            {errors.api && <p className="error">{errors.api}</p>}
            <div className="form-group">
                <label>Nome</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
                {errors.nome && <p className="error">{errors.nome}</p>}
            </div>
            <div className="form-group">
                <label>CPF</label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
                {errors.cpf && <p className="error">{errors.cpf}</p>}
            </div>
            <div className="form-group">
                <label>CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
                {errors.cep && <p className="error">{errors.cep}</p>}
                {cepError && <p className="error">{cepError}</p>}
            </div>
            <div className="form-group">
                <label>Logradouro</label>
                <input type="text" name="logradouro" value={formData.logradouro} readOnly />
            </div>
            <div className="form-group">
                <label>Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} readOnly />
            </div>
            <div className="form-group">
                <label>Cidade</label>
                <input type="text" name="cidade" value={formData.cidade} readOnly />
            </div>
            <div className="form-group">
                <label>Estado</label>
                <input type="text" name="estado" value={formData.estado} readOnly />
            </div>
            <button type="submit">{enderecoToEdit ? 'Atualizar' : 'Salvar'}</button>
        </form>
    );
};

export default EnderecoForm;
