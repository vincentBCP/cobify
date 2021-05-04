import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core';

import Task from '../../../../../models/types/Task';
import Column from '../../../../../models/types/Column';
import Board from '../../../../../models/types/Board';

import TaskComponent from './Task';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            display: "block"
        }
    })
);

interface ITasksProps {
    board: Board,
    column: Column,
    data: Task[],
    sourceTask: Task | null,
    targetTask: Task | null,
    handleDragStart: (arg1: React.DragEvent, arg2: Task) => void,
    handleDragOver: (arg1: React.DragEvent, arg2: Task) => boolean,
    handleDrop: (arg1: React.DragEvent) => void
}

const Tasks: React.FC<ITasksProps & RouteComponentProps> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {
                props.data.map(task =>
                    <TaskComponent
                        key={task.id}
                        task={task}
                        board={props.board}
                        handleDragStart={props.handleDragStart}
                        handleDragOver={props.handleDragOver}
                        handleDrop={props.handleDrop}
                    />
                )
            }
        </div>
    );
};

export default withRouter(Tasks);