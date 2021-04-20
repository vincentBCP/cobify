import { AxiosResponse } from 'axios';

import axios from '../axios';

class AppAPI {
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