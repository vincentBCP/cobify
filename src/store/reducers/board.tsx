import Board from '../../models/types/Board';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    boards: Board[]
}

const initialState: IState = {
    boards: [
        /*{
            id: "1",
            name: "Congrego",
            code: "C",
            accountID: "1",
            color: "#8B56F0",
            columnIDs: [
                "1",
                "2",
                "3"
            ]
        },
        {
            id: "2",
            name: "IHS",
            code: "I",
            accountID: "1",
            color: "#CB4AAF",
            columnIDs: []
        },
        {
            id: "3",
            name: "Safeplaces",
            code: "S",
            accountID: "1",
            color: "#B8F393",
            columnIDs: []
        },
        {
            id: "4",
            name: "Congrego version 2",
            code: "CC",
            accountID: "1",
            color: "#144EEB",
            columnIDs: []
        }*/
    ]
};

const addBoard = (state: IState, board: Board) => {
    return {
        ...state,
        boards: [
            ...state.boards,
            board
        ]
    };
};

const updateBoard = (state: IState, board: Board) => {
    const ind = state.boards.findIndex(b => b.id === board.id);

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

const actions: any = [];
actions[actionTypes.ADD_BOARD] = addBoard;
actions[actionTypes.UPDATE_BOARD] = updateBoard;
actions[actionTypes.SET_BOARDS] = setBoards;

const boardReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default boardReducer;