import { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import firebase from '../firebase';

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

    public static sendSupportMessage(email: string, subject: string, content: string): Promise<any> {
        const id = uuidv4();

        return firebase.database().ref("supportMessages/" + id)
            .set({
                id: id,
                email: email,
                subject: subject,
                content: content
            });
    }
};

export default AppAPI;