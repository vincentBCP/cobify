import { AxiosResponse } from 'axios'; 

import UserDetails from '../models/types/UserDetails';

import axios from '../axios';

class AppAPI {
    public static updateUserDetails(userDetails: UserDetails): Promise<AxiosResponse> {
        return axios.post('publicInfo', userDetails);
    };
};

export default AppAPI;