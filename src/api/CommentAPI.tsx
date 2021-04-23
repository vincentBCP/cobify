import { v4 as uuidv4 } from 'uuid';

import CommentDTO from '../models/dto/CommentDTO';
import Comment from '../models/types/Comment';

import API from './API';

class CommentAPI extends API<Comment> {
    constructor() {
        super("comments");
    }

    public getComments(): Promise<Comment[]> {
        return super.getRecords();
    };

    public createComment(dto: CommentDTO): Promise<Comment> {
        const commentID = uuidv4();

        const d: any = {...dto};

        const newComment: Comment = {
            id: commentID,
            ...d
        }

        return super.create(commentID, newComment);
    };

    public updateComment(comment: Comment): Promise<Comment> {
        return super.update(comment.id, comment);
    }

    public deleteComment(id: string): Promise<string> {
        return super.delete(id);
    };
};

export default new CommentAPI();