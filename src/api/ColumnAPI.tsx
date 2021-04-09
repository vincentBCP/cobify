import { AxiosResponse } from 'axios'; 

import axios from '../axios';

import ColumnDTO from '../models/dto/ColumnDTO';

class ColumnAPI {
    public static createColumn(dto: ColumnDTO): Promise<AxiosResponse> {
        return axios.post('column', dto);
    };
};

export default ColumnAPI;