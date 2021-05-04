import { v4 as uuidv4 } from 'uuid';

import Label from '../models/types/Label';
import LabelDTO from '../models/dto/LabelDTO';

import API from './API';

import Collections from './Collections';

class LabelAPI extends API<Label> {
    constructor() {
        super(Collections.LABELS);
    }

    public getLabels(): Promise<Label[]> {
        return super.getRecords();
    };

    public createLabel(dto: LabelDTO): Promise<Label> {
        const labelID = uuidv4();

        const d: any = {...dto};

        const newLabel: Label = {
            id: labelID,
            ...d
        }

        return super.create(labelID, newLabel);
    };

    public deleteLabel(id: string): Promise<string> {
        return super.delete(id);
    };
};

export default new LabelAPI();