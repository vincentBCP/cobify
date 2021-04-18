import TaskAPI from '../../api/TaskAPI';
import StorageAPI from '../../api/StorageAPI';

import TaskDTO from '../../models/dto/TaskDTO';
import Task from '../../models/types/Task';

import * as actionTypes from './actionTypes';
import IAttachment from '../../models/interfaces/IAttachment';

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

export const updateTaskAndAttachments = (task: Task, dto: TaskDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            const attachmentsToDelete: any = [];
            const updatedTask = {...task};

            const newAttachments: IAttachment[] = [];

            updatedTask.attachments?.forEach((attachment: IAttachment) => {
                const publicURL = StorageAPI.getAttachmentPublicUrl(attachment);

                if (!(dto.attachments || []).includes(publicURL)) {
                    // remove/delete attachment if it is not in the dto
                    attachmentsToDelete.push(StorageAPI.delete(attachment));
                } else {
                    newAttachments.push(attachment);
                }
            });

            const deleteRequest = attachmentsToDelete.length > 0 ? Promise.all(attachmentsToDelete) : Promise.resolve([]);

            deleteRequest
            .then(() => {
                const attachmentsToAdd: any[] = [];

                dto.attachments?.forEach((file: any) => {
                    if (!(file instanceof File)) return;
    
                    attachmentsToAdd.push(StorageAPI.upload(file as File))
                });

                const addRequest = attachmentsToAdd.length > 0 ? Promise.all(attachmentsToAdd) : Promise.resolve([]);

                return addRequest;
            })
            .then((addedAttachments: IAttachment[]) => {
                const atts = [...newAttachments];

                updatedTask.title = dto.title;
                updatedTask.description = dto.description;
                updatedTask.attachments = atts.concat(addedAttachments);

                return TaskAPI.updateTask(updatedTask);
            })
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

