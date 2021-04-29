import { AxiosResponse } from 'axios'; 
import * as CryptoJS from 'crypto-js';

import axios from '../axios';

import firebase from '../firebase';
import { FIREBASE_CONFIG } from '../config';

const SECRET = "Lorem ipsum dolor sit amet";
const EXTRA = "18ZzPgK";
const INDEX_OF_EXTRA = 7;

class AuthAPI {
    public signin(email: string, password: string): Promise<string> {
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user: any = userCredential.user;

                return this.encrypt(user.refreshToken);
            });
    }

    public signup(email: string, password: string) {
        return axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + 
            FIREBASE_CONFIG.apiKey,
            { email: email, password: "D3f@ult!", returnSecureToken: true}
        );
    }

    public signupAndLogin(email: string, password: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    public isLoggedIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    resolve(user);
                    return;
                }

                reject({response: {status: 401, data: { error: { message: "Unauthorized." } }}});
            })
        });
    }

    public deleteAccount(): Promise<any> {
        var user = firebase.auth().currentUser;

        if (!user) return Promise.resolve();
        
        return user.delete();
    }

    public reLogin(refreshToken: string): Promise<AxiosResponse> {
        const token = this.decrypt(refreshToken);

        return axios.post("https://securetoken.googleapis.com/v1/token?key=" + 
            FIREBASE_CONFIG.apiKey,
            { grant_type: "refresh_token", refresh_token: token }
        );
    }

    public sendResetPassword(email: string): Promise<void> {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    private encrypt(str: string): string {
        const encryptionKey = CryptoJS.AES.encrypt(str, SECRET).toString();
        const arr = encryptionKey.split("+");
        // PERSONAL TOUCH: add extra
        arr.splice(INDEX_OF_EXTRA, 0, EXTRA);

        return arr.join('+');
    }

    private decrypt(encrypted: string): string {
        const arr = encrypted.split("+");
        // remove extra
        arr.splice(INDEX_OF_EXTRA, 1);

        return CryptoJS.AES.decrypt(arr.join('+'), SECRET).toString(CryptoJS.enc.Utf8);
    }
};

export default new AuthAPI();