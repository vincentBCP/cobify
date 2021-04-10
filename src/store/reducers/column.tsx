import Column from '../../models/types/Column';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    columns: Column[]
};

const initialState: IState = {
    columns: [
        /*{
            id: "1",
            name: "Backlog",
            boardID: "1",
            accountID: "1",
            taskIDs: [
                "1",
                "2"
            ]
        },
        {
            id: "2",
            name: "In Progress",
            boardID: "1",
            accountID: "1",
            taskIDs: [
                "3"
            ]
        },
        {
            id: "3",
            name: "Completed",
            boardID: "1",
            accountID: "1"
        }*/
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

const updateColumn = (state: IState, column: Column) => {
    const ind = state.columns.findIndex(c => c.id === column.id);

    const updatedColumns = [...state.columns];
    updatedColumns[ind] = { ...column };

    return {
        ...state,
        columns: [...updatedColumns]
    }
}

const setColumns = (state: IState, columns: Column[]) => {
    return {
        ...state,
        columns: [...columns]
    }
}

const actions: any = [];
actions[actionTypes.ADD_COLUMN] = addColumn;
actions[actionTypes.UPDATE_COLUMN] = updateColumn;
actions[actionTypes.SET_COLUMNS] = setColumns;

const columnReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default columnReducer;