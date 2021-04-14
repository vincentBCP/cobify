import TaskAPI from '../../api/TaskAPI';
import StorageAPI from '../../api/StorageAPI';

import TaskDTO from '../../models/dto/TaskDTO';

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
            .then(responses => {
                const data: any = {...dto};
                data.attachments = [];// replace list of File with empty array

                (responses || []).forEach(uploadResponse => {
                    data.attachments.push({
                        name: uploadResponse.data.name,
                        downloadTokens: uploadResponse.data.downloadTokens,
                        timeCreated: uploadResponse.data.timeCreated
                    });
                });

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