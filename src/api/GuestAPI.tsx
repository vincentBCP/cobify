import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import GuestDTO from '../models/dto/GuestDTO';
import Guest from '../models/types/Guest';

const path = "guests/";
const extension = ".json";

class GuestAPI {
    public static getGuests(): Promise<Guest[]> {
        return axios.get(path + extension)
            .then(response => {
                const data: any = response.data || {};

                return Object.keys(data).map(key =>
                    ({...data[key]} as Guest));
            });
    };

    public static createGuest(dto: GuestDTO): Promise<Guest> {
        const guestID = uuidv4();

        const newGuest: Guest = {
            id: guestID,
            ...dto,
            displayName: dto.firstName + " " + dto.lastName,
            initials: ((dto.firstName).charAt(0).toUpperCase() + (dto.lastName).charAt(0)).toUpperCase()
        };

        return axios.put(path + guestID + extension, newGuest)
            .then(response => newGuest);
    };

    public static updateGuest(guest: Guest): Promise<Guest> {
        return axios.put(path + guest.id + extension, {
            ...guest,
            displayName: guest.firstName + " " + guest.lastName,
            initials: ((guest.firstName).charAt(0).toUpperCase() + (guest.lastName).charAt(0)).toUpperCase()
        })
            .then(response => guest);
    };

    public static deleteGuest(id: string): Promise<string> {
        return axios.delete(path + id + extension)
            .then(response => {
                console.log(response);
                return id;
            });
    };
};

export default GuestAPI;