import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/enderecos';

const getAllEnderecos = () => {
    return axios.get(API_BASE_URL);
};

const getEnderecoById = (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
};

const createEndereco = (enderecoData) => {
    return axios.post(API_BASE_URL, enderecoData);
};

const updateEndereco = (id, enderecoData) => {
    return axios.put(`${API_BASE_URL}/${id}`, enderecoData);
};

const deleteEndereco = (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
};

const getEnderecoByCep = (cep) => {
    return axios.get(`${API_BASE_URL}/cep/${cep}`);
};

export {
    getAllEnderecos,
    getEnderecoById,
    createEndereco,
    updateEndereco,
    deleteEndereco,
    getEnderecoByCep
};
