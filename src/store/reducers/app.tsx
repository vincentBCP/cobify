import * as actionTypes from '../actions/actionTypes';

import UserDetails from '../../models/types/UserDetails';

const initialState: any = {
    user: {
        id: '1234567890',
        firstName: "Vincent",
        lastName: "Patoc",
        color: "#673ab7",
        email: "vincentbenjaminpatoc@gmail.com"
    }
};

interface IAction {
    type: string,
    payload: any
};

const updateUserDetails = (state: any, userDetails: UserDetails) => {
    const updatedUser = {
        ...state.user,
        ...userDetails
    };

    return {
        ...state,
        user: { ...updatedUser }
    };
};

const actions: any = [];
actions[actionTypes.UPDATE_USER_DETAILS] = updateUserDetails;

const appReducer = (state = initialState, action: IAction) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default appReducer;