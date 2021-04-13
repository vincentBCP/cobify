import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import ColumnDTO from '../models/dto/ColumnDTO';
import Column from '../models/types/Column';

const path = "columns/";
const extension = ".json";

class ColumnAPI {
    public static getColumns(): Promise<Column[]> {
        return axios.get(path + extension)
            .then(response => {
                const data: any = response.data || {};

                return Object.keys(data).map(key =>
                    ({...data[key]} as Column))
            });
    };

    public static createColumn(dto: ColumnDTO): Promise<Column> {
        const columnID = uuidv4();

        const newColumn: Column = {
            id: columnID,
            ...dto
        };

        return axios.put(path + columnID + extension, newColumn)
            .then(response => newColumn);
    };

    public static updateColumn(column: Column): Promise<Column> {
        return axios.put(path + column.id + extension, column)
            .then(response => column);
    }

    public static deleteColumn(id: string): Promise<string> {
        return axios.delete(path + id + extension)
            .then(response => id);
    };
};

export default ColumnAPI;