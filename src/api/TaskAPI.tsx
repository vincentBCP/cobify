import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import TaskDTO from '../models/dto/TaskDTO';
import Task from '../models/types/Task';

class TaskAPI {
    public static createTask(dto: TaskDTO): Promise<Task> {
        return axios.post('task', dto)
            .then(response => (
                {
                    id: uuidv4(),
                    ...dto
                } as Task
            ));
    };
};

export default TaskAPI;