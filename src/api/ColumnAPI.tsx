import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import ColumnDTO from '../models/dto/ColumnDTO';
import Column from '../models/types/Column';

class ColumnAPI {
    public static createColumn(dto: ColumnDTO): Promise<Column> {
        return axios.post('column', dto)
            .then(response => (
                {
                    id: uuidv4(),
                    ...dto
                } as Column
            ));
    };

    public static updateColumn(column: Column): Promise<Column> {
        return axios.put('column/' + column.id, column)
            .then(response => column);
    }
};

export default ColumnAPI;