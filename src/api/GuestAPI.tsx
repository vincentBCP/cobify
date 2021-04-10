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

    public static updateGuest(guest: Guest): Promise<Guest> {
        return axios.put('guest/' + guest.id, guest)
            .then(response => guest);
    };
};

export default GuestAPI;