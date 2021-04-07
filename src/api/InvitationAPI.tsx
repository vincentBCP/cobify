import { AxiosResponse } from 'axios'; 

import axios from '../axios';

import InvitationDTO from '../models/dto/InvitationDTO';

class InvitationAPI {
    public static sendInvitation(dto: InvitationDTO): Promise<AxiosResponse> {
        return axios.post('invitation', dto);
    };

    public static deleteInvitation(id: string): Promise<AxiosResponse> {
        return axios.delete('invitation/' + id);
    };
};

export default InvitationAPI;