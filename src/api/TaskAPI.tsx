import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import TaskDTO from '../models/dto/TaskDTO';
import Task from '../models/types/Task';

const path = "tasks/";
const extension = ".json";

class TaskAPI {
    public static getTasks(): Promise<Task[]> {
        return axios.get(path + extension)
            .then(response => {
                const data: any = response.data || {};

                return Object.keys(data).map(key =>
                    ({...data[key]} as Task))
            });
    };

    public static createTask(dto: TaskDTO): Promise<Task> {
        const taskID = uuidv4();

        const newTask: Task = {
            id: taskID,
            ...dto
        }

        return axios.put(path + taskID + extension, newTask)
            .then(response => newTask);
    };

    public static updateTask(task: Task): Promise<Task> {
        return axios.put(path + task.id + extension, task)
                .then(response => task);
    }
};

export default TaskAPI;