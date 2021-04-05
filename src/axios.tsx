import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3001'
});

instance.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.resolve();
    }
);

instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.resolve();
    }
);

export default instance;