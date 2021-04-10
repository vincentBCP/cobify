import React from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';

import Task from '../../../../models/types/Task';
import Column from '../../../../models/types/Column';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            display: "block"
        },
        task: {
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            borderRadius: 5,
            border: '1px solid #ccc',
            marginBottom: 20,
            '&:last-of-type': {
                marginBottom: 0
            }
        },
        taskTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            whiteSpace: 'normal'
        }
    })
);

interface ITasksProps {
    column: Column,
    sourceTask: Task | null,
    targetTask: Task | null,
    handleDragStart: (arg1: React.DragEvent, arg2: Task) => void,
    handleDragOver: (arg1: React.DragEvent, arg2: Task) => boolean,
    handleDrop: (arg1: React.DragEvent) => void
}

const Tasks: React.FC<ITasksProps> = props => {
    const classes = useStyles();

    const tasks: Task[] = useSelector((state: any) => state.task.tasks);

    return (
        <div className={classes.root}>
            {
                (props.column.taskIDs || [])
                .map(taskID => {
                    const task = tasks.find(t => t.id === taskID);

                    if (!task) return null;

                    return <div
                        id={task.id}
                        key={"tasks-" + task.id}
                        className={classes.task}
                        draggable
                        onDragStart={(ev: React.DragEvent) => props.handleDragStart(ev, task)}
                        onDragOver={(ev: React.DragEvent) => props.handleDragOver(ev, task)}
                        onDrop={props.handleDrop}
                    >
                        <Typography className={classes.taskTitle}>{task.title}</Typography>
                    </div>
                })
            }
        </div>
    );
};

export default Tasks;