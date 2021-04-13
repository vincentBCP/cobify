import TaskAPI from '../../api/TaskAPI';

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