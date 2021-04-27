import Notification from '../../models/types/Notification';

import * as actionTypes from '../actions/actionTypes';

interface IState {
    notifications: Notification[]
};

const initialState: IState = {
    notifications: []
};

const addNotification = (state: IState, notification: Notification) => {
    return {
        ...state,
        notifications: [
            ...state.notifications,
            notification
        ]
    };
};

const updateNotification = (state: IState, notification: Notification) => {
    const ind = state.notifications.findIndex(n => n.id === notification.id);

    const updatedNotifications = [...state.notifications];
    updatedNotifications[ind] = { ...notification };

    return {
        ...state,
        notifications: [...updatedNotifications]
    }
}

const setNofitications = (state: IState, notifications: Notification[]) => {
    return {
        ...state,
        notifications: [...notifications]
    }
}

const actions: any = [];
actions[actionTypes.ADD_NOTIFICATION] = addNotification;
actions[actionTypes.UPDATE_NOTIFICATION] = updateNotification;
actions[actionTypes.SET_NOTIFICATIONS] = setNofitications;

const notificationReducer = (state = initialState, action: any) => {
    if (!actions[action.type]) return state;

    return actions[action.type](state, action.payload);
};

export default notificationReducer;