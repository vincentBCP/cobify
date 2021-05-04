import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AppContext from './appContext';

import User from '../../models/types/User';
import Comment from '../../models/types/Comment';
import Task from '../../models/types/Task';
import NotificationDTO from '../../models/dto/NotificationDTO';
import Column from '../../models/types/Column';
import UserRole from '../../models/enums/UserRole';

import NotificationAPI from '../../api/NotificationAPI';
import Collections from '../../api/Collections';

import firebase from '../../firebase';

import * as actionTypes from '../../store/actions/actionTypes';

const AppProvider: React.FC = props => {
    const [shrinkNavigation, setShrinkNavigation] = React.useState(false);

    const dispatch = useDispatch();

    const account: User = useSelector((state: any) => state.app.account);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);
    const columns: Column[] = useSelector((state: any) => state.column.columns);

    const shouldCascade = React.useCallback((record: any): boolean => {
        if (!record) return false;

        if (account.role === UserRole.SYSADMIN) return true;

        return record.accountID === account.id || record.accountID === account.accountID
    }, [account]);

    useEffect(() => {
        if (!account) return;

        // boards
        var boardsRef = firebase.database().ref(Collections.BOARDS);

        boardsRef.on('child_added', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.ADD_BOARD,
                payload: data.val()
            });
        });

        boardsRef.on('child_changed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.UPDATE_BOARD,
                payload: data.val()
            });
        });

        boardsRef.on('child_removed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.DELETE_BOARD,
                payload: data.val().id
            });
        });

        // columns
        var columnsRef = firebase.database().ref(Collections.COLUMNS);

        columnsRef.on('child_added', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.ADD_COLUMN,
                payload: data.val()
            });
        });

        columnsRef.on('child_changed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.UPDATE_COLUMN,
                payload: data.val()
            });
        });

        columnsRef.on('child_removed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.DELETE_COLUMN,
                payload: data.val().id
            });
        });

        // comments
        var commentsRef = firebase.database().ref(Collections.COMMENTS);

        commentsRef.on('child_added', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.ADD_COMMENT,
                payload: data.val()
            });
        });

        commentsRef.on('child_changed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.UPDATE_COMMENT,
                payload: data.val()
            });
        });

        commentsRef.on('child_removed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.DELETE_COMMENT,
                payload: data.val().id
            });
        });

        // invitations
        var invitationsRef = firebase.database().ref(Collections.INVITATIONS);

        invitationsRef.on('child_added', (data) => {
            if (!shouldCascade(data.val())) return;

            /*if (data.val().userID === account.id) { DON'T, will make web page load continuosly
                window.location.reload();
                return;
            }*/

            dispatch({
                type: actionTypes.ADD_INVITATION,
                payload: data.val()
            });
        });

        invitationsRef.on('child_removed', (data) => {
            if (!shouldCascade(data.val())) return;

            if (data.val().userID === account.id) {
                window.location.reload();
                return;
            }

            dispatch({
                type: actionTypes.DELETE_INVITATION,
                payload: data.val().id
            });
        });

        // notifications
        var notificationRef = firebase.database().ref(Collections.NOTIFICATIONS);

        notificationRef.on('child_added', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.ADD_NOTIFICATION,
                payload: data.val()
            })
        });

        // tasks
        var tasksRef = firebase.database().ref(Collections.TASKS);

        tasksRef.on('child_added', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.ADD_TASK,
                payload: data.val()
            });
        });

        tasksRef.on('child_changed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.UPDATE_TASK,
                payload: data.val()
            });
        });

        tasksRef.on('child_removed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.DELETE_TASK,
                payload: data.val().id
            });
        });

        // labels
        var labelsRef = firebase.database().ref(Collections.LABELS);

        labelsRef.on('child_added', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.ADD_LABEL,
                payload: data.val()
            });
        });

        labelsRef.on('child_removed', (data) => {
            if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.DELETE_LABEL,
                payload: data.val().id
            });
        });
        
        // users
        var usersRef = firebase.database().ref(Collections.USERS);

        usersRef.on('child_added', (data) => {
            //if (!shouldCascade(data.val())) return;

            dispatch({
                type: actionTypes.ADD_USER,
                payload: data.val()
            });
        });

        usersRef.on('child_changed', (data) => {
            //if (!shouldCascade(data.val())) return;

            const record = data.val() as User;
            
            if (record.id === account.id && record.role !== account.role) {
                window.location.reload();
                return;
            }
            
            dispatch({
                type: actionTypes.UPDATE_USER,
                payload: data.val()
            });
        });

        usersRef.on('child_removed', (data) => {
            //if (!shouldCascade(data.val())) return;

            const record = data.val() as User;

            if (record.id === account.id) {
                window.location.reload();
                return;
            }
            
            dispatch({
                type: actionTypes.DELETE_USER,
                payload: data.val().id
            });
        });
    }, [ account, dispatch, shouldCascade ]);

    const getRecipients = (task: Task): string[] => {
        const recipients: string[] = [
            task.creatorID
        ];

        if (task.asigneeID) {
            recipients.push(task.asigneeID);
        }

        const taskComments = comments.filter(c => c.taskID === task.id);
        
        taskComments.forEach(c => {
            if (recipients.includes(c.userID)) return;

            recipients.push(c.userID)
        });

        return recipients;
    }

    const isComment = (arg: any): arg is Comment => {
        return (arg as Comment).taskID !== undefined;
    }

    const isTask = (arg: any): arg is Task => {
        return (arg as Task).columnID !== undefined;
    }

    const sendNotification = (arg: any) => {
        if (!arg) return;

        if (isComment(arg)) {
            sendNewCommentNotif(arg as unknown as Comment);
            return;
        }

        if (isTask(arg)) {
            sendTaskUpdateNotif(arg as unknown as Task);
        }
    }

    const sendNewCommentNotif = (comment: Comment) => {
        const taskID = comment.taskID;

        const task = tasks.find(t => t.id === taskID);

        if (!task) return;

        const recipients = getRecipients(task);

        const promises: any[] = [];

        recipients.forEach(recipient =>
            promises.push(
                NotificationAPI.createNotification({
                    recipientID: recipient,
                    senderID: account.id,
                    title: "New comment",
                    message: account.displayName + " added new comment on card " + task.code + ".",
                    taskID: task.id,
                    accountID: task.accountID,
                    date: (new Date()).toISOString()
                } as NotificationDTO)
            )
        );

        Promise.all(promises);
    }

    const sendTaskUpdateNotif = (task: Task) => {
        const column = columns.find(c => c.id === task.columnID);

        if (!column) return;
        
        const recipients = getRecipients(task);

        const promises: any[] = [];

        recipients.forEach(recipient =>
            promises.push(
                NotificationAPI.createNotification({
                    recipientID: recipient,
                    senderID: account.id,
                    title: "Task update",
                    message: account.displayName + " moved card " + task.code + " to " + column.name + ".",
                    taskID: task.id,
                    accountID: task.accountID,
                    date: (new Date()).toISOString()
                } as NotificationDTO)
            )
        );

        Promise.all(promises);
    }

    return (
        <AppContext.Provider
            value={{
                shrinkNavigation: shrinkNavigation,
                toggleNavigation: () => {
                    setShrinkNavigation(!shrinkNavigation)
                },
                sendNotification: sendNotification
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppProvider;