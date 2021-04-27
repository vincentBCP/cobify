import Invitation from '../../models/types/Invitation';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    invitations: Invitation[]
}

const initialState: IState = {
    invitations: []
};

const deleteInvitation = (state: IState, id: string) => {
    const ind = state.invitations.findIndex(c => c.id === id);

    if (ind === -1) return state;

    const updatedInvitations = [...state.invitations];
    updatedInvitations.splice(ind, 1);

    return {
        ...state,
        invitations: [...updatedInvitations]
    }
}

const addInvitation = (state: any, invitation: Invitation) => {
    const updatedInvitations = [...state.invitations];
    const index = updatedInvitations.findIndex(i => i.id === invitation.id);

    if (index !== -1) {
        updatedInvitations[index] = invitation;
    } else {
        updatedInvitations.push(invitation);
    }

    return {
        ...state,
        invitations: [...updatedInvitations]
    };
};

const setInvitations = (state: IState, invitations: Invitation[]) => {
    return {
        ...state,
        invitations: [...invitations]
    }
}

const actions: any = [];
actions[actionTypes.DELETE_INVITATION] = deleteInvitation;
actions[actionTypes.ADD_INVITATION] = addInvitation;
actions[actionTypes.SET_INVITATIONS] = setInvitations;

const invitationReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default invitationReducer;