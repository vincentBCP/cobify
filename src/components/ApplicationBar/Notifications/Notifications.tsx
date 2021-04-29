import React from 'react';
import _ from 'lodash';
import { format, formatDistance } from 'date-fns';

import { useSelector, connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import NotificationIcon from '@material-ui/icons/NotificationsNoneOutlined';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';

import Auxi from '../../../hoc/Auxi';
import Avatar from '../../../widgets/Avatar';

import User from '../../../models/types/User';
import Notification from '../../../models/types/Notification';
import Task from '../../../models/types/Task';
import Board from '../../../models/types/Board';

import * as actions from '../../../store/actions';

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            right: 6,
            top: 2,
            border: 'none',
            padding: 0,
            width: 22,
            height: 22,
            borderRadius: 11,
            fontSize: 12,
            backgroundColor: "#407ad6",
            color: "white"
        },
    }),
)(Badge);

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        popover: {
            marginTop: 10,
            marginLeft: -10,

            '& .MuiPopover-paper': {
                width: 320,
                maxHeight: 'calc(100vh * .70)',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.05)'
            }
        },
        root: {
        },
        icon: {
            color: '#9e9e9e',
            fontSize: 30
        },
        header: {
            textAlign: 'center',
            padding: 10,
            color: 'rgba(0, 0, 0, 0.87)'
        },
        list: {
            borderTop: '1px solid #eee',
            maxHeight: '40vh',
            overflowY: 'scroll',

            '& > div': { // list item
                display: 'flex',
                flexDirection: 'column',
                transitionDuration: '0.3s',
                cursor: 'pointer',
                padding: '10px 15px',
                borderBottom: '1px solid #eee',

                '&:last-of-type': {
                    borderBottom: 'none'
                },
                '&.notRead': {
                    backgroundColor: '#f7f9fc'
                },
                '& > div:first-of-type': { // avatar and details container
                    display: 'flex',
                    alignItems: 'center',

                    '& > div:last-of-type': { // list item content
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: 15,
    
                        '& p': {
                            lineHeight: '1.5em',
                            fontSize: '1em'
                        },
                        '& p:first-of-type': {
                            fontWeight: 'bold'
                        },
                    }
                },
                '& > p': { // time
                    textAlign: 'right',
                    fontSize: '1em',
                    color: '#5f6368'
                }
            }
        },
        footer: {
            width: '100%',
            padding: 5,
            textAlign: 'center',
            borderTop: '1px solid #eee',

            '& button': {
                color: 'rgba(0, 0, 0, 0.87)'
            }
        },
        empty: {
            padding: '20px 20px',
            color: 'rgba(0, 0, 0, 0.87)'
        }
    })
);

interface INotificationsProps {
    updateNotification: (arg1: Notification) => void
}

const Notifications: React.FC<INotificationsProps & RouteComponentProps> = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const account: User = useSelector((state: any) => state.app.account);
    const users: User[] = useSelector((state: any) => state.user.users);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);
    const boards: Board[] = useSelector((state: any) => state.board.boards);
    const notifications: Notification[] = useSelector((state: any) =>
        state.notification.notifications.filter((notif: Notification) =>
            (
                notif.recipientID === account.id &&
                notif.senderID !== account.id &&
                (
                    (format(new Date(notif.date), "yyyy-M-d") === format(new Date(), "yyyy-M-d")) ||
                    !Boolean(notif.read)
                )
            )
        ));

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleNotificationClick = (notification: Notification) => {
        const task = tasks.find(t => t.id === notification.taskID);

        if (!task) return;

        const board = boards.find(b => b.id === task.boardID);

        if (!board) return;

        setAnchorEl(null);

        props.updateNotification({
            ...notification,
            read: true
        } as Notification);

        props.history.push('/workplace/' + board.code + "/" + task.code);
    }

    const handleMarkAllAsRead = () => {
        const promises: any[] = [];

        notifications.forEach(notif =>
            promises.push(
                props.updateNotification({
                    ...notif,
                    read: true
                } as Notification)
            )    
        );

        Promise.all(promises);
    }

    const unreadCount = notifications.filter(n => !Boolean(n.read)).length

    return (
        <Auxi>
            <Tooltip title="Notifications">
                <IconButton onClick={handleClick}>
                    <StyledBadge badgeContent={unreadCount}>
                        <NotificationIcon className={classes.icon} />
                    </StyledBadge>
                </IconButton>
            </Tooltip>

            <Popover
                id="organization-selector-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                className={classes.popover}
            >
                <Paper className={classes.root}>
                    {
                        notifications.length > 0
                        ? <Auxi>
                            <Typography className={classes.header}>
                                {notifications.length} Notifications
                            </Typography>
                            <div className={classes.list}>
                                {
                                    _.orderBy(notifications, ["date"], ["desc"]).map(
                                        notif => {
                                            const sender = users.find(u => u.id === notif.senderID);

                                            if (!sender) return null;

                                            return (
                                                <div
                                                    key={"notification-" + notif.id}
                                                    className={!notif.read ? 'notRead' : ''}
                                                    onClick={() => handleNotificationClick(notif)}
                                                >
                                                    <div>
                                                        <Avatar
                                                            size={40}
                                                            account={sender}
                                                        />
                                                        <div>
                                                            <Typography>{notif.title}</Typography>
                                                            <Typography>{notif.message}</Typography>
                                                            
                                                        </div>
                                                    </div>
                                                    <Typography>
                                                        {formatDistance(new Date(notif.date), new Date())}
                                                    </Typography>
                                                </div>
                                            );
                                        }
                                    )
                                }
                            </div>
                            <div className={classes.footer}>
                                <Button
                                    disabled={unreadCount < 1}
                                    onClick={handleMarkAllAsRead}
                                >
                                    Mark all as read
                                </Button>
                            </div>
                        </Auxi>
                        : null
                    }
                    {
                        notifications.length < 1
                        ? <Typography className={classes.empty}>
                            No notifications.
                        </Typography>
                        : null
                    }
                </Paper>
            </Popover>
        </Auxi>
    )
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateNotification: (notification: Notification) => dispatch(actions.updateNotification(notification))
    }
}
export default connect(null, mapDispatchToProps)(withRouter(Notifications));