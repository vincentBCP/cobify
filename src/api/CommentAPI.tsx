import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import CommentDTO from '../models/dto/CommentDTO';
import Comment from '../models/types/Comment';

const path = "comments/";
const extension = ".json";

class CommentAPI {
    public static getComments(): Promise<Comment[]> {
        return axios.get(path + extension)
            .then(response => {
                const data: any = response.data || {};

                return Object.keys(data).map(key =>
                    ({...data[key]} as Comment))
            });
    };

    public static createComment(dto: CommentDTO): Promise<Comment> {
        const commentID = uuidv4();

        const d: any = {...dto};

        const newComment: Comment = {
            id: commentID,
            ...d
        }

        return axios.put(path + commentID + extension, newComment)
            .then(response => newComment);
    };

    public static updateComment(comment: Comment): Promise<Comment> {
        return axios.put(path + comment.id + extension, comment)
                .then(response => comment);
    }

    public static deleteComment(id: string): Promise<string> {
        return axios.delete(path + id + extension)
            .then(response => id);
    };
};

export default CommentAPI;