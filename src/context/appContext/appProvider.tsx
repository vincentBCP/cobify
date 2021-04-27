import React from 'react';
import { useSelector } from 'react-redux';

import AppContext from './appContext';

import User from '../../models/types/User';
import Comment from '../../models/types/Comment';
import Task from '../../models/types/Task';
import NotificationDTO from '../../models/dto/NotificationDTO';

import NotificationAPI from '../../api/NotificationAPI';

const AppProvider: React.FC = props => {
    const [shrinkNavigation, setShrinkNavigation] = React.useState(false);

    const account: User = useSelector((state: any) => state.app.account);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);

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

    const sendNotification = (arg: any) => {
        if (!arg) return;

        if (isComment(arg)) {
            sendNewCommentNotif(arg as unknown as Comment);
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
                    boardID: task.boardID,
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