import { v4 as uuidv4 } from 'uuid';

import InvitationDTO from '../models/dto/InvitationDTO';
import Invitation from '../models/types/Invitation';

import API from './API';

class InvitationAPI extends API<Invitation> {
    constructor() {
        super("invitations");
    }

    public getInvitations(): Promise<Invitation[]> {
        return super.getRecords();
    };

    public sendInvitation(dto: InvitationDTO): Promise<Invitation> {
        const invitationID = uuidv4();

        const newInvitation: Invitation = {
            id: invitationID,
            ...dto,
            link: ""
        };

        return super.create(invitationID, newInvitation);
    };

    public deleteInvitation(id: string): Promise<string> {
        return super.delete(id);
    };
};

export default new InvitationAPI();