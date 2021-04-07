import { AxiosResponse } from 'axios'; 

import axios from '../axios';

import GuestDTO from '../models/dto/GuestDTO';

class GuestAPI {
    public static sendGuestInvitation(dto: GuestDTO): Promise<AxiosResponse> {
        return axios.post('guest', dto);
    };
};

export default GuestAPI;