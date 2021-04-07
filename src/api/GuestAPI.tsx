import { AxiosResponse } from 'axios'; 

import axios from '../axios';

import GuestDTO from '../models/dto/GuestDTO';

class GuestAPI {
    public static sendGuestInvitation(dto: GuestDTO): Promise<AxiosResponse> {
        // return axios.post('guest', dto);
        return new Promise((resolve, reject) => {
            axios.post('guest', dto)
            .then(response => {
                setTimeout(() => {
                    resolve(response);
                }, 1000);
            })
            .catch(error => reject(error));
        });
    };
};

export default GuestAPI;