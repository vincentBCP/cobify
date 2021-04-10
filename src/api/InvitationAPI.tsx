import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import InvitationDTO from '../models/dto/InvitationDTO';
import Invitation from '../models/types/Invitation';

class InvitationAPI {
    public static sendInvitation(dto: InvitationDTO): Promise<Invitation> {
        return axios.post('invitation', dto)
            .then(response => (
                {
                    id: uuidv4(),
                    ...dto,
                    link: ""
                } as Invitation
            ));
    };

    public static deleteInvitation(id: string): Promise<string> {
        return axios.delete('invitation/' + id)
            .then(response => id);
    };
};

export default InvitationAPI;