import { AxiosResponse } from 'axios'; 
import * as CryptoJS from 'crypto-js';

import axios from '../axios';
import { API_KEY } from '../config';

const SECRET = "Lorem ipsum dolor sit amet";
const EXTRA = "18ZzPgK";
const INDEX_OF_EXTRA = 7;

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

    public static encrypt(str: string): string {
        const encryptionKey = CryptoJS.AES.encrypt(str, SECRET).toString();
        const arr = encryptionKey.split("+");
        // PERSONAL TOUCH: add extra
        arr.splice(INDEX_OF_EXTRA, 0, EXTRA);

        return arr.join('+');
    }

    public static decrypt(encrypted: string): string {
        const arr = encrypted.split("+");
        // remove extra
        arr.splice(INDEX_OF_EXTRA, 1);

        return CryptoJS.AES.decrypt(arr.join('+'), SECRET).toString(CryptoJS.enc.Utf8);
    }
};

export default AuthAPI;