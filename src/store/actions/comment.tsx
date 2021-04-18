import CommentAPI from '../../api/CommentAPI';
import StorageAPI from '../../api/StorageAPI';

import CommentDTO from '../../models/dto/CommentDTO';
import Comment from '../../models/types/Comment';
import User from '../../models/types/User';

import * as actionTypes from './actionTypes';
import IAttachment from '../../models/interfaces/IAttachment';

export const getComments = (account: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            CommentAPI
            .getComments()
            .then(comments => {
                dispatch({
                    type: actionTypes.SET_COMMENTS,
                    payload: comments.filter(c => {
                        return c.accountID === account.id ||
                                c.accountID === account.accountID;
                    })
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

export const createComment = (dto: CommentDTO) => {
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

                return CommentAPI.createComment(data);
            })
            .then(comment => {
                dispatch({
                    type: actionTypes.ADD_COMMENT,
                    payload: comment
                });

                resolve(comment);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const updateComment = (comment: Comment, dto: CommentDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            const attachmentsToDelete: any = [];
            const updatedComment = {...comment};

            const currentAttachments = [...(updatedComment.attachments || [])];

            currentAttachments.forEach((attachment: IAttachment, index) => {
                const publicURL = StorageAPI.getAttachmentPublicUrl(attachment);

                if (!(dto.attachments || []).includes(publicURL)) {
                    // remove/delete attachment if it is not in the dto
                    updatedComment.attachments?.splice(index, 1);
                    attachmentsToDelete.push(StorageAPI.delete(attachment));
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
                const atts = [...(updatedComment.attachments || [])];

                updatedComment.content = dto.content;
                updatedComment.attachments = atts.concat(addedAttachments);

                return CommentAPI.updateComment(updatedComment);
            })
            .then(comment => {
                dispatch({
                    type: actionTypes.UPDATE_COMMENT,
                    payload: comment
                });

                resolve(comment);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const deleteComment = (comment: Comment) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            const promises: any = [];

            comment.attachments?.forEach((attachment: IAttachment) =>
                StorageAPI.delete(attachment));

            Promise.all(promises)
            .then(() => {
                return CommentAPI.deleteComment(comment.id)
            })
            .then(id => {
                dispatch({
                    type: actionTypes.DELETE_COMMENT,
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

