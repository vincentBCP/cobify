import Comment from '../../models/types/Comment';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    comments: Comment[]
};

const initialState: IState = {
    comments: []
};

const addComment = (state: IState, comment: Comment) => {
    const updatedComments = [...state.comments];
    const index = updatedComments.findIndex(c => c.id === comment.id);

    if (index !== -1) {
        updatedComments[index] = comment;
    } else {
        updatedComments.push(comment);
    }

    return {
        ...state,
        comments: [...updatedComments]
    };
};

const updateComment = (state: IState, comment: Comment) => {
    const ind = state.comments.findIndex(c => c.id === comment.id);

    if (ind === -1) return state;
    
    const updatedComments = [...state.comments];
    updatedComments[ind] = { ...comment };

    return {
        ...state,
        comments: [...updatedComments]
    }
}

const setComments = (state: IState, comments: Comment[]) => {
    return {
        ...state,
        comments: [...comments]
    }
}

const deleteComment = (state: IState, id: string) => {
    const ind = state.comments.findIndex(c => c.id === id);

    if (ind === -1) return state;

    const updatedComments = [...state.comments];
    updatedComments.splice(ind, 1);

    return {
        ...state,
        comments: [...updatedComments]
    }
}

const actions: any = [];
actions[actionTypes.UPDATE_COMMENT] = updateComment;
actions[actionTypes.ADD_COMMENT] = addComment;
actions[actionTypes.SET_COMMENTS] = setComments;
actions[actionTypes.DELETE_COMMENT] = deleteComment;

const commentReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default commentReducer;