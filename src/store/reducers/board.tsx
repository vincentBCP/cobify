import Board from '../../models/types/Board';

interface IState {
    boards: Board[]
}

const initialState: IState = {
    boards: [
        {
            id: "1",
            name: "Congrego",
            accountID: "1",
            color: "#8B56F0"
        },
        {
            id: "2",
            name: "IHS",
            accountID: "1",
            color: "#CB4AAF"
        },
        {
            id: "3",
            name: "Safeplaces",
            accountID: "1",
            color: "#B8F393"
        },
        {
            id: "4",
            name: "Congrego version 2",
            accountID: "1",
            color: "#144EEB"
        }
    ]
};

const actions: any = [];

const boardReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default boardReducer;