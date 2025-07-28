// frontend/src/api/enderecoApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/enderecos';

const enderecoApi = {
  // Criar um novo endereço
  createEndereco: (enderecoData) => {
    return axios.post(API_BASE_URL, enderecoData);
  },

  // Listar todos os endereços
  getAllEnderecos: () => {
    return axios.get(API_BASE_URL);
  },

  // Atualizar um endereço existente
  updateEndereco: (id, enderecoData) => {
    return axios.put(`${API_BASE_URL}/${id}`, enderecoData);
  },

  // Deletar um endereço
  deleteEndereco: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};

export default enderecoApi;