import Task from '../../models/types/Task';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    tasks: Task[]
};

const initialState: IState = {
    tasks: [
        {
            id: "1",
            title: "Redesign the homepage",
            boardID: "1",
            columnID: "1",
            hostID: "1"
        },
        {
            id: "2",
            title: "Upgrade dependencies to latest versions",
            boardID: "1",
            columnID: "1",
            hostID: "1"
        },
        {
            id: "3",
            title: "Stripe payment integration",
            boardID: "1",
            columnID: "2",
            hostID: "1"
        }
    ]
};

const updateTask = (state: IState, task: Task) => {
    const ind = state.tasks.findIndex(t => t.id === task.id);

    const updatedTasks = [...state.tasks];
    updatedTasks[ind] = { ...task };

    return {
        ...state,
        tasks: [...updatedTasks]
    }
}

const actions: any = [];
actions[actionTypes.UPDATE_TASK] = updateTask;

const taskReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default taskReducer;