import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sistemagestionbocadillos.onrender.com/api', // Revisa el puerto de tu backend en Java
});

export default api;