import React from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import Avatar from '../../../../../../widgets/Avatar';

import Task from '../../../../../../models/types/Task';
import Board from '../../../../../../models/types/Board';
import User from '../../../../../../models/types/User';
import Comment from '../../../../../../models/types/Comment';
import Label from '../../../../../../models/types/Label';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            display: 'block',
            color: 'inherit',
            textDecoration: 'none',
            marginBottom: 10,

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
            marginBottom: 0,
            fontSize: '1em'
        },
        footer: {
            marginTop: 10,
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
        },
        labels: {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
        },
        label: {
            width: "calc(20% - 5px)",
            padding: 4,
            borderRadius: 4,
            marginBottom: 5
        }
    })
);

interface ITaskProps {
    task: Task,
    board: Board,
    handleDragStart: (arg1: React.DragEvent, arg2: Task) => void,
    handleDragOver: (arg1: React.DragEvent, arg2: Task) => boolean,
    handleDrop: (arg1: React.DragEvent) => void
}

const TaskComponent: React.FC<ITaskProps> = props => {
    const classes = useStyles();
    
    const users: User[] = useSelector((state: any) => state.user.users);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);
    const labels: Label[] = useSelector((state: any) =>
        state.label.labels.filter((l: Label) => l.boardID === props.task.boardID));

    const asignee = users.find(g => g.id === props.task.asigneeID);

    return (
        <NavLink
            key={"tasks-" + props.task.id}
            to={"/workplace/" + props.board.code + "/" + props.task.code}
            className={classes.root}
        >
            <div
                id={props.task.id}
                className={classes.task}
                draggable
                onDragStart={(ev: React.DragEvent) => props.handleDragStart(ev, props.task)}
                onDragOver={(ev: React.DragEvent) => props.handleDragOver(ev, props.task)}
                onDrop={props.handleDrop}
            >
                {
                    props.task.labels && props.task.labels.length > 0
                    ? <div className={classes.labels}>
                        {
                            _.orderBy(props.task.labels).map(lName => {
                                const label = labels.find(l => l.name === lName);

                                if (!label) return null;

                                return (
                                    <Tooltip
                                        key={label.id}
                                        title={label.name}
                                    >
                                        <div
                                            className={classes.label}
                                            style={{backgroundColor: label.color}}></div>
                                    </Tooltip>
                                )
                            })
                        }
                    </div>
                    : null
                }
                <Typography className={classes.taskCode}>{props.task.code}</Typography>
                <Typography className={classes.taskTitle}>{props.task.title}</Typography>
                <div className={classes.footer}>
                    {
                        asignee
                        ? <Avatar
                            size={30}
                            account={asignee}
                        />
                        : null
                    }
                    {
                        comments.filter(c => c.taskID === props.task.id).length > 0
                        ? <div className={classes.commentsCount}>
                            <span>{comments.filter(c => c.taskID === props.task.id).length}</span>
                            <ChatBubbleOutlineOutlinedIcon />
                        </div>
                        : null
                    }
                </div>
            </div>
        </NavLink>
    );
};

export default TaskComponent;