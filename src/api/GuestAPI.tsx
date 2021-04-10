import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import GuestDTO from '../models/dto/GuestDTO';
import Guest from '../models/types/Guest';

class GuestAPI {
    public static createGuest(dto: GuestDTO): Promise<Guest> {
        return axios.post('guest', dto)
            .then(response => {
                return {
                    id: uuidv4(),
                    ...dto
                } as Guest;
            });
    };
};

export default GuestAPI;