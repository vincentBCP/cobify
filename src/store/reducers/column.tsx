import Column from '../../models/types/Column';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    columns: Column[]
};

const initialState: IState = {
    columns: []
};

const addColumn = (state: IState, column: Column) => {
    const updatedColumns = [...state.columns];
    const index = updatedColumns.findIndex(c => c.id === column.id);

    if (index !== -1) {
        updatedColumns[index] = column;
    } else {
        updatedColumns.push(column);
    }

    return {
        ...state,
        columns: [...updatedColumns]
    };
};

const updateColumn = (state: IState, column: Column) => {
    const ind = state.columns.findIndex(c => c.id === column.id);

    if (ind === -1) return state;
    
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

const deleteColumn = (state: IState, id: string) => {
    const ind = state.columns.findIndex(c => c.id === id);

    if (ind === -1) return state;

    const updatedColumns = [...state.columns];
    updatedColumns.splice(ind, 1);

    return {
        ...state,
        columns: [...updatedColumns]
    }
}

const actions: any = [];
actions[actionTypes.ADD_COLUMN] = addColumn;
actions[actionTypes.UPDATE_COLUMN] = updateColumn;
actions[actionTypes.SET_COLUMNS] = setColumns;
actions[actionTypes.DELETE_COLUMN] = deleteColumn;

const columnReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default columnReducer;