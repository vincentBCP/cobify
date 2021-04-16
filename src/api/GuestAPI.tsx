import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import GuestDTO from '../models/dto/GuestDTO';
import Guest from '../models/types/Guest';

import { API_KEY } from '../config';

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
        return new Promise((resolve, reject) => {
            const guestID = uuidv4();

            const newGuest: Guest = {
                id: guestID,
                ...dto,
                displayName: dto.firstName + " " + dto.lastName,
                initials: ((dto.firstName).charAt(0).toUpperCase() + (dto.lastName).charAt(0)).toUpperCase()
            };

            axios.put(path + (dto.email.split("@")[0] + "_" + guestID) + extension, newGuest)
            .then(response => {
                return axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY,
                    { email: response.data.email, password: "D3f@ult!", returnSecureToken: true});
            })
            .then(response => {
                resolve(newGuest);
            })
            .catch(error => reject(error));
        });
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
            .then(response => id);
    };
};

export default GuestAPI;