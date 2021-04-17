import User from '../../models/types/User';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    users: User[]
}

const initialState: IState = {
    users: []
};

const addUser = (state: any, user: User) => {
    return {
        ...state,
        users: [
            ...state.users,
            user
        ]
    };
};

const updateUser = (state: IState, user: User) => {
    const ind = state.users.findIndex(g => g.id === user.id);

    const updatedUser = [...state.users];
    updatedUser[ind] = { ...user };

    return {
        ...state,
        users: [...updatedUser]
    }
}

const setUsers = (state: IState, users: User[]) => {
    return {
        ...state,
        users: [...users]
    }
}

const deleteUser = (state: IState, id: string) => {
    const ind = state.users.findIndex(g => g.id === id);

    const updatedUsers = [...state.users];
    updatedUsers.splice(ind, 1);

    return {
        ...state,
        users: [...updatedUsers]
    }
}

const actions: any = [];
actions[actionTypes.ADD_USER] = addUser;
actions[actionTypes.UPDATE_USER] = updateUser;
actions[actionTypes.SET_USERS] = setUsers;
actions[actionTypes.DELETE_USER] = deleteUser;

const userReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default userReducer;