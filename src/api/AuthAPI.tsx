import { AxiosResponse } from 'axios'; 

import axios from '../axios';
import { API_KEY } from '../config';

// https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password

class AuthAPI {
    public static login(email: string, password: string): Promise<AxiosResponse> {
        return axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + API_KEY,
            { email: email, password: password, returnSecureToken: true }
        );
    }

    public static reLogin(refreshToken: string): Promise<AxiosResponse> {
        return axios.post("https://securetoken.googleapis.com/v1/token?key=" + API_KEY,
            { grant_type: "refresh_token", refresh_token: refreshToken }
        );
    }

    public static sendResetPassword(email: string): Promise<AxiosResponse> {
        return axios.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + API_KEY,
            { requestType: "PASSWORD_RESET", email: email });
    }
};

export default AuthAPI;