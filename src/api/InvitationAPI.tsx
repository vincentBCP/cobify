import { AxiosResponse } from 'axios'; 

import axios from '../axios';

import InvitationDTO from '../models/dto/InvitationDTO';

class InvitationAPI {
    public static sendInvitation(dto: InvitationDTO): Promise<AxiosResponse> {
        // return axios.post('invitation', dto);
        return new Promise((resolve, reject) => {
            axios.post('invitation', dto)
            .then(response => {
                setTimeout(() => {
                    resolve(response);
                }, 1000);
            })
            .catch(error => reject(error));
        });
    };

    public static deleteInvitation(id: string): Promise<AxiosResponse> {
        return axios.delete('invitation/' + id);
    };
};

export default InvitationAPI;