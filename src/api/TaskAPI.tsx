import { v4 as uuidv4 } from 'uuid';

import TaskDTO from '../models/dto/TaskDTO';
import Task from '../models/types/Task';

import API from './API';

import Collections from './Collections';

class TaskAPI extends API<Task> {
    constructor() {
        super(Collections.TASKS);
    }

    public getTasks(): Promise<Task[]> {
        return super.getRecords();
    };

    public createTask(dto: TaskDTO): Promise<Task> {
        const taskID = uuidv4();

        const d: any = {...dto};

        const newTask: Task = {
            id: taskID,
            ...d
        }

        return super.create(taskID, newTask);
    };

    public updateTask(task: Task): Promise<Task> {
        return super.update(task.id, task);
    }

    public deleteTask(id: string): Promise<string> {
        return super.delete(id);
    };
};

export default  new TaskAPI();