import { AxiosResponse } from 'axios'; 

import axios from '../axios';

class InvitationAPI {
    public static deleteInvitation(id: string): Promise<AxiosResponse> {
        return axios.delete('invitation/' + id);
    };
};

export default InvitationAPI;