import Board from '../../models/types/Board';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    boards: Board[]
}

const initialState: IState = {
    boards: []
};

const addBoard = (state: IState, board: Board) => {
    const updatedBoards = [...state.boards];
    const index = updatedBoards.findIndex(b => b.id === board.id);

    if (index !== -1) {
        updatedBoards[index] = board;
    } else {
        updatedBoards.push(board);
    }

    return {
        ...state,
        boards: [...updatedBoards]
    };
};

const updateBoard = (state: IState, board: Board) => {
    const ind = state.boards.findIndex(b => b.id === board.id);

    if (ind === -1) return state;
    
    const updatedBoards = [...state.boards];
    updatedBoards[ind] = { ...board };

    return {
        ...state,
        boards: [...updatedBoards]
    }
}

const setBoards = (state: IState, boards: Board[]) => {
    return {
        ...state,
        boards: [...boards]
    }
}

const deleteBoard = (state: IState, id: string) => {
    const ind = state.boards.findIndex(b => b.id === id);

    if (ind === -1) return state;

    const updatedBoards = [...state.boards];
    updatedBoards.splice(ind, 1);

    return {
        ...state,
        boards: [...updatedBoards]
    }
}

const actions: any = [];
actions[actionTypes.ADD_BOARD] = addBoard;
actions[actionTypes.UPDATE_BOARD] = updateBoard;
actions[actionTypes.SET_BOARDS] = setBoards;
actions[actionTypes.DELETE_BOARD] = deleteBoard;

const boardReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default boardReducer;