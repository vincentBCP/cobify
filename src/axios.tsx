import axios from 'axios';

import { FIREBASE_CONFIG } from './config';

const instance = axios.create({
    baseURL: FIREBASE_CONFIG.databaseURL
});

instance.interceptors.request.use(
    config => {
        
        /*if (config.url?.endsWith('.json')) { // add auth to realtime database request
            const token = localStorage.getItem("token");

            config.url = config.url + "?auth=" + token;
        }*/

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

/*instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.resolve();
    }
);*/

/*instance.post = (url: string, data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

instance.put = (url: string, data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

instance.get = (url: string, config: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

instance.delete = (url: string, config: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}*/

export default instance;