import Guest from '../../models/types/Guest';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    guests: Guest[]
}

const initialState: IState = {
    guests: [
        {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            hostID: "1",
            color: "#20DCCA"
        },
        {
            id: "2",
            firstName: "Yuji",
            lastName: "Itadori",
            hostID: "1",
            email: "yuji.itadori@email.com",
            color: "#7505B9"
        },
        {
            id: "3",
            firstName: "Ren",
            lastName: "Tanaka",
            hostID: "1",
            email: "ren.tanaka@email.com",
            color: "#0CC152"
        },
        {
            id: "4",
            firstName: "Ruujin",
            lastName: "Jakka",
            hostID: "1",
            email: "ruujin.jakka@email.com",
            color: "#547C3A"
        },
        {
            id: "5",
            firstName: "Ichigo",
            lastName: "Kurosaki",
            hostID: "1",
            email: "ichigo.kurosaki@email.com",
            color: "#FF13CE"
        },
        {
            id: "6",
            firstName: "Bakugo",
            lastName: "Katsuki",
            hostID: "1",
            email: "bakugo.katsuki@email.com",
            color: "#9FB075"
        }
    ]
};

const addGuest = (state: any, guest: Guest) => {
    return {
        ...state,
        guests: [
            ...state.guests,
            guest
        ]
    };
};

const actions: any = [];
actions[actionTypes.ADD_GUEST] = addGuest;

const guestReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default guestReducer;