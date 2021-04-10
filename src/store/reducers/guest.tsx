import Guest from '../../models/types/Guest';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    guests: Guest[]
}

const initialState: IState = {
    guests: [
        /*{
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            accountID: "1",
            color: "#20DCCA",
            displayName: "John Doe",
            initials: "JD",
        },
        {
            id: "2",
            firstName: "Yuji",
            lastName: "Itadori",
            accountID: "1",
            email: "yuji.itadori@email.com",
            color: "#7505B9",
            displayName: "Yuji Itadori",
            initials: "YI"
        },
        {
            id: "3",
            firstName: "Ren",
            lastName: "Tanaka",
            accountID: "1",
            email: "ren.tanaka@email.com",
            color: "#0CC152",
            displayName: "Ren Tanaka",
            initials: "RT"
        },
        {
            id: "4",
            firstName: "Ruujin",
            lastName: "Jakka",
            accountID: "1",
            email: "ruujin.jakka@email.com",
            color: "#547C3A",
            displayName: "Ruujin Jakka",
            initials: "RJ"
        },
        {
            id: "5",
            firstName: "Ichigo",
            lastName: "Kurosaki",
            accountID: "1",
            email: "ichigo.kurosaki@email.com",
            color: "#FF13CE",
            displayName: "Ichigo Kurosaki",
            initials: "IK"
        },
        {
            id: "6",
            firstName: "Bakugo",
            lastName: "Katsuki",
            accountID: "1",
            email: "bakugo.katsuki@email.com",
            color: "#9FB075",
            displayName: "Bakugo Katsuki",
            initials: "BK"
        }*/
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

const updateGuest = (state: IState, guest: Guest) => {
    const ind = state.guests.findIndex(g => g.id === guest.id);

    const updatedGuest = [...state.guests];
    updatedGuest[ind] = { ...guest };

    return {
        ...state,
        guests: [...updatedGuest]
    }
}

const setGuests = (state: IState, guests: Guest[]) => {
    return {
        ...state,
        guests: [...guests]
    }
}

const actions: any = [];
actions[actionTypes.ADD_GUEST] = addGuest;
actions[actionTypes.UPDATE_GUEST] = updateGuest;
actions[actionTypes.SET_GUESTS] = setGuests;

const guestReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default guestReducer;