const initialState: any = {
    user: {
        firstName: "Vincent",
        lastName: "Patoc",
        color: "#673ab7"
    }
};

const actions: any = [];

const appReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default appReducer;