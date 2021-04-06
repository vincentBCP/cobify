import { AxiosResponse } from 'axios'; 

import UserDetails from '../models/types/UserDetails';

import axios from '../axios';

class AppAPI {
    public static updateUserDetails(userDetails: UserDetails): Promise<AxiosResponse> {
        return axios.post('publicInfo', userDetails);
    };

    public static requestCode(email: string): Promise<AxiosResponse> {
        return axios.get('requestCode?e=' + email);
    };

    public static checkCode(code: string): Promise<AxiosResponse> {
        return axios.get('checkCode?c=' + code);
    };

    public static updateEmail(email: string): Promise<AxiosResponse> {
        return axios.post('updateEmail', { email: email });
    }
};

export default AppAPI;