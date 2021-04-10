import TaskAPI from '../../api/TaskAPI';

import TaskDTO from '../../models/dto/TaskDTO';

import * as actionTypes from './actionTypes';

export const createTask = (dto: TaskDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            TaskAPI
            .createTask(dto)
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