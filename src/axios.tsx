import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://cobify-59a63-default-rtdb.firebaseio.com/'
});

/*instance.interceptors.request.use(
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