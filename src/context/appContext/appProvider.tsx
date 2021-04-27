import React from 'react';
import { useSelector } from 'react-redux';

import AppContext from './appContext';

import User from '../../models/types/User';
import Comment from '../../models/types/Comment';
import Task from '../../models/types/Task';
import NotificationDTO from '../../models/dto/NotificationDTO';
import Column from '../../models/types/Column';

import NotificationAPI from '../../api/NotificationAPI';

const AppProvider: React.FC = props => {
    const [shrinkNavigation, setShrinkNavigation] = React.useState(false);

    const account: User = useSelector((state: any) => state.app.account);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);
    const columns: Column[] = useSelector((state: any) => state.column.columns);

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