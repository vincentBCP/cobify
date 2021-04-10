import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import InvitationDTO from '../models/dto/InvitationDTO';
import Invitation from '../models/types/Invitation';

const path = "invitations/";
const extension = ".json";

class InvitationAPI {
    public static getInvitations(): Promise<Invitation[]> {
        return axios.get(path + extension)
            .then(response => {
                const data: any = response.data || {};

                return Object.keys(data).map(key =>
                    ({...data[key]} as Invitation))
            });
    };

    public static sendInvitation(dto: InvitationDTO): Promise<Invitation> {
        const invitationID = uuidv4();

        const newInvitation: Invitation = {
            id: invitationID,
            ...dto,
            link: ""
        };

        return axios.put(path + invitationID + extension, newInvitation)
            .then(response => newInvitation);
    };

    public static deleteInvitation(id: string): Promise<string> {
        return axios.delete(path + id + extension)
            .then(response => {
                console.log(response);
                return id
            });
    };
};

export default InvitationAPI;