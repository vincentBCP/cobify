import Task from '../../models/types/Task';

interface IState {
    tasks: Task[]
};

const initialState: IState = {
    tasks: []
};

const actions: any = [];

const taskReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](action.payload);
};

export default taskReducer;