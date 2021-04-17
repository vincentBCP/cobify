import TaskAPI from '../../api/TaskAPI';
import StorageAPI from '../../api/StorageAPI';

import TaskDTO from '../../models/dto/TaskDTO';
import Task from '../../models/types/Task';

import * as actionTypes from './actionTypes';

export const getTasks = () => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            TaskAPI
            .getTasks()
            .then(tasks => {
                dispatch({
                    type: actionTypes.SET_TASKS,
                    payload: tasks
                });

                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        })
    }
};

export const createTask = (dto: TaskDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            const promises: any[] = [];

            dto.attachments?.forEach((file: any) => {
                if (!(file instanceof File)) return;

                promises.push(StorageAPI.upload(file as File))
            });

            const req = promises.length > 0 ? Promise.all(promises) : Promise.resolve([]);
            
            req
            .then(attachments => {
                const data: any = {...dto};
                data.attachments = attachments || [];// replace list of File with empty array

                return TaskAPI.createTask(data);
            })
            .then(task => {
                dispatch({
                    type: actionTypes.ADD_TASK,
                    payload: task
                });

                resolve(task);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const updateTask = (task: Task) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            TaskAPI
            .updateTask(task)
            .then(task => {
                dispatch({
                    type: actionTypes.UPDATE_TASK,
                    payload: task
                });

                resolve(task);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const deleteTask = (id: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            TaskAPI
            .deleteTask(id)
            .then(id => {
                dispatch({
                    type: actionTypes.DELETE_TASK,
                    payload: id
                });

                resolve(id);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

