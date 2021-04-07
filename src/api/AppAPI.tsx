import { AxiosResponse } from 'axios'; 

import UserDetails from '../models/types/UserDetails';

import axios from '../axios';

class AppAPI {
    public static updateUserDetails(userDetails: UserDetails): Promise<AxiosResponse> {
        // return axios.post('publicInfo', userDetails);
        return new Promise((resolve, reject) => {
            axios.post('publicInfo', userDetails)
            .then(response => {
                setTimeout(() => {
                    resolve(response);
                }, 1000);
            })
            .catch(error => reject(error));
        });
    };

    public static requestCode(email: string): Promise<AxiosResponse> {
        // return axios.get('requestCode?e=' + email);
        return new Promise((resolve, reject) => {
            axios.get('requestCode?e=' + email)
            .then(response => {
                setTimeout(() => {
                    resolve(response);
                }, 1000);
            })
            .catch(error => reject(error));
        });
    };

    public static checkCode(code: string): Promise<AxiosResponse> {
        return axios.get('checkCode?c=' + code);
    };

    public static updateEmail(email: string): Promise<AxiosResponse> {
        return axios.post('updateEmail', { email: email });
    }
};

export default AppAPI;