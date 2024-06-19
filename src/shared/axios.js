import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://test.taxivoshod.ru/api/test/',
    timeout: 10000,
});

export default instance;
