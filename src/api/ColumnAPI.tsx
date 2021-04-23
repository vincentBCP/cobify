import { v4 as uuidv4 } from 'uuid';

import ColumnDTO from '../models/dto/ColumnDTO';
import Column from '../models/types/Column';

import API from './API';

class ColumnAPI extends API<Column> {
    constructor() {
        super("columns");
    }

    public getColumns(): Promise<Column[]> {
        return super.getRecords();
    };

    public createColumn(dto: ColumnDTO): Promise<Column> {
        const columnID = uuidv4();

        const newColumn: Column = {
            id: columnID,
            ...dto
        };

        return super.create(columnID, newColumn);
    };

    public updateColumn(column: Column): Promise<Column> {
        return super.update(column.id, column);
    }

    public deleteColumn(id: string): Promise<string> {
        return super.delete(id);
    };
};

export default new ColumnAPI();