import Invitation from '../../models/types/Invitation';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    invitations: Invitation[]
}

const initialState: IState = {
    invitations: [
        {
            id: "1",
            guestID: "1",
            hostID: "1",
            boardID: "1",
            link: ""
        },
        {
            id: "2",
            guestID: "1",
            hostID: "1",
            boardID: "2",
            link: ""
        },
        {
            id: "3",
            guestID: "2",
            hostID: "1",
            boardID: "3",
            link: ""
        },
        {
            id: "4",
            guestID: "3",
            hostID: "1",
            boardID: "4",
            link: ""
        },
        {
            id: "5",
            guestID: "4",
            hostID: "1",
            boardID: "2",
            link: ""
        },
        {
            id: "6",
            guestID: "5",
            hostID: "1",
            boardID: "3",
            link: ""
        },
        {
            id: "7",
            guestID: "6",
            hostID: "1",
            boardID: "4",
            link: ""
        }
    ]
};

const deleteInvitation = (state: any, id: string) => {
    const updatedInvitations = [...state.invitations];
    const index = updatedInvitations.findIndex(i => i.id === id);
    updatedInvitations.splice(index, 1);

    return {
        ...state,
        invitations: [...updatedInvitations]
    };
};

const actions: any = [];
actions[actionTypes.DELETE_INVITATION] = deleteInvitation;

const invitationReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default invitationReducer;