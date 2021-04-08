import Column from '../../models/types/Column';

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
            id: "1",
            name: "In Progress",
            boardID: "1",
            hostID: "1"
        },
        {
            id: "1",
            name: "Done",
            boardID: "1",
            hostID: "1"
        }
    ]
};

const actions: any = [];

const columnReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](action.payload);
};

export default columnReducer;