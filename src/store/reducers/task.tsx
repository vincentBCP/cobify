import Task from '../../models/types/Task';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    tasks: Task[]
};

const initialState: IState = {
    tasks: []
};

const addTask = (state: IState, task: Task) => {
    const updatedTasks = [...state.tasks];
    const index = updatedTasks.findIndex(t => t.id === task.id);

    if (index !== -1) {
        updatedTasks[index] = task;
    } else {
        updatedTasks.push(task);
    }

    return {
        ...state,
        tasks: [...updatedTasks]
    };
};

const updateTask = (state: IState, task: Task) => {
    const ind = state.tasks.findIndex(t => t.id === task.id);

    if (ind === -1) return state;
    
    const updatedTasks = [...state.tasks];
    updatedTasks[ind] = { ...task };

    return {
        ...state,
        tasks: [...updatedTasks]
    }
}

const setTasks = (state: IState, tasks: Task[]) => {
    return {
        ...state,
        tasks: [...tasks]
    }
}

const deleteTask = (state: IState, id: string) => {
    const ind = state.tasks.findIndex(t => t.id === id);

    if (ind === -1) return state;

    const updatedTasks = [...state.tasks];
    updatedTasks.splice(ind, 1);

    return {
        ...state,
        tasks: [...updatedTasks]
    }
}

const actions: any = [];
actions[actionTypes.UPDATE_TASK] = updateTask;
actions[actionTypes.ADD_TASK] = addTask;
actions[actionTypes.SET_TASKS] = setTasks;
actions[actionTypes.DELETE_TASK] = deleteTask;

const taskReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default taskReducer;