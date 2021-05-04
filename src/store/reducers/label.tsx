import Label from '../../models/types/Label';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    labels: Label[]
}

const initialState: IState = {
    labels: []
};

const addLabel = (state: IState, label: Label) => {
    const updatedLabels = [...state.labels];
    const index = updatedLabels.findIndex(l => l.id === label.id);

    if (index !== -1) {
        updatedLabels[index] = label;
    } else {
        updatedLabels.push(label);
    }

    return {
        ...state,
        labels: [...updatedLabels]
    };
};

const setLabels = (state: IState, labels: Label[]) => {
    return {
        ...state,
        labels: [...labels]
    }
}

const deleteLabel = (state: IState, id: string) => {
    const ind = state.labels.findIndex(l => l.id === id);

    if (ind === -1) return state;

    const updatedLabels = [...state.labels];
    updatedLabels.splice(ind, 1);

    return {
        ...state,
        labels: [...updatedLabels]
    }
}

const actions: any = [];
actions[actionTypes.ADD_LABEL] = addLabel;
actions[actionTypes.SET_LABELS] = setLabels;
actions[actionTypes.DELETE_LABEL] = deleteLabel;

const labelReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default labelReducer;