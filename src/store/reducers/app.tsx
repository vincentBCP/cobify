import * as actionTypes from '../actions/actionTypes';

import UserDetails from '../../models/types/UserDetails';
import User from '../../models/types/User';

const initialState: any = {
    account: { }
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

const updateEmail = (state: any, email: string) => {
    return {
        ...state,
        user: {
            ...state.user,
            email: email
        }
    };
};

const setAccount = (state: any, account: User) => {
    return {
        ...state,
        account: { ...account } 
    }
}

const actions: any = [];
actions[actionTypes.UPDATE_USER_DETAILS] = updateUserDetails;
actions[actionTypes.UPDATE_EMAIL] = updateEmail;
actions[actionTypes.SET_ACCOUNT] = setAccount; 

const appReducer = (state = initialState, action: IAction) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default appReducer;