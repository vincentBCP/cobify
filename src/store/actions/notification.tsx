import NotificationAPI from '../../api/NotificationAPI';

import Notification from '../../models/types/Notification';
import User from '../../models/types/User';
import UserRole from '../../models/enums/UserRole';

import * as actionTypes from './actionTypes';

export const getNotifications = (account: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            NotificationAPI
            .getNotifications()
            .then(notifications => {
                dispatch({
                    type: actionTypes.SET_NOTIFICATIONS,
                    payload: notifications.filter(n => {
                        if (account.role === UserRole.SYSADMIN) return true;

                        return n.accountID === account.id ||
                                n.accountID === account.accountID;
                    })
                });

                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
};

export const updateNotification = (notification: Notification) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            NotificationAPI.updateNotification(notification)
            .then(notification => {
                dispatch({
                    type: actionTypes.UPDATE_NOTIFICATION,
                    payload: notification
                });

                resolve(notification);
            })
            .catch(error => {
                reject(error);
            });
        });
    };
};