import React from 'react';

import { useSelector } from 'react-redux';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';

import Avatar from '../../../../widgets/Avatar';

import Task from '../../../../models/types/Task';
import Column from '../../../../models/types/Column';
import Board from '../../../../models/types/Board';
import User from '../../../../models/types/User';
import Comment from '../../../../models/types/Comment';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            display: "block"
        },
        taskLink: {
            display: 'block',
            color: 'inherit',
            textDecoration: 'none',
            marginBottom: 20,

            '&:last-of-type': {
                marginBottom: 0
            }
        },
        task: {
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            borderRadius: 5,
            border: '1px solid rgba(224, 224, 224, 1)',
            transitionDuration: "0.3s",

            '&:hover': {
                backgroundColor: '#f7f9fc'
            }
        },
        taskTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            whiteSpace: 'normal'
        },
        taskCode: {
            color: 'gray',
            marginBottom: 10
        },
        footer: {
            marginTop: 20,
            display: 'flex',
            alignItems: 'center'
        },
        commentsCount: {
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            color: '#ccc',

            '& > span': {
                marginRight: 5
            }
        }
    })
);

interface ITasksProps {
    board: Board,
    column: Column,
    sourceTask: Task | null,
    targetTask: Task | null,
    handleDragStart: (arg1: React.DragEvent, arg2: Task) => void,
    handleDragOver: (arg1: React.DragEvent, arg2: Task) => boolean,
    handleDrop: (arg1: React.DragEvent) => void
}

const Tasks: React.FC<ITasksProps & RouteComponentProps> = props => {
    const classes = useStyles();

    const tasks: Task[] = useSelector((state: any) => state.task.tasks);
    const users: User[] = useSelector((state: any) => state.user.users);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);

    return (
        <div className={classes.root}>
            {
                (props.column.taskIDs || [])
                .map(taskID => {
                    const task = tasks.find(t => t.id === taskID);

                    if (!task) return null;

                    const asignee = users.find(g => g.id === task.asigneeID);

                    return <NavLink
                            key={"tasks-" + task.id}
                            to={"/workplace/" + props.board.code + "/" + task.code}
                            className={classes.taskLink}
                        >
                        <div
                            id={task.id}
                            className={classes.task}
                            draggable
                            onDragStart={(ev: React.DragEvent) => props.handleDragStart(ev, task)}
                            onDragOver={(ev: React.DragEvent) => props.handleDragOver(ev, task)}
                            onDrop={props.handleDrop}
                        >
                            <Typography className={classes.taskCode}>{task.code}</Typography>
                            <Typography className={classes.taskTitle}>{task.title}</Typography>
                            <div className={classes.footer}>
                                {
                                    asignee
                                    ? <Avatar
                                        color={asignee.color}
                                        initials={asignee.initials}
                                        size={30}
                                    />
                                    : null
                                }
                                <div className={classes.commentsCount}>
                                    <span>{comments.filter(c => c.taskID === taskID).length}</span>
                                    <ChatBubbleOutlineOutlinedIcon />
                                </div>
                            </div>
                        </div>
                    </NavLink>
                })
            }
        </div>
    );
};

export default withRouter(Tasks);