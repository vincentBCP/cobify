import Column from '../../models/types/Column';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    columns: Column[]
};

const initialState: IState = {
    columns: [
        {
            id: "1",
            name: "Backlog",
            boardID: "1",
            hostID: "1"
        },
        {
            id: "2",
            name: "In Progress",
            boardID: "1",
            hostID: "1"
        },
        {
            id: "3",
            name: "Completed",
            boardID: "1",
            hostID: "1"
        }
    ]
};

const addColumn = (state: IState, column: Column) => {
    return {
        ...state,
        columns: [
            ...state.columns,
            column
        ]
    };
};

const actions: any = [];
actions[actionTypes.ADD_COLUMN] = addColumn

const columnReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default columnReducer;