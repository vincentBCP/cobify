import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Tasks from './Tasks';

import Auxi from '../../../../hoc/Auxi';

import Board from '../../../../models/types/Board';
import Column from '../../../../models/types/Column';
import Task from '../../../../models/types/Task';
import User from '../../../../models/types/User';
import UserRole from '../../../../models/enums/UserRole';

import { SIDE_NAVIGATION_WIDTH } from '../../../../components/SideNavigation/SideNavigation';

import { IFilter } from '../Columns';

interface IColumnProps {
    account: User,
    board: Board,
    column: Column,
    filter: IFilter,
    handleBoardUpdate: (arg1: Board) => void,
    handleColumnDelete: (arg1: Column) => void,
    handleColumnRename: (arg1: Column) => void,
    handleTaskDragStart: (arg1: React.DragEvent, arg2: Task) => void
    handleColumnDragStart: (arg1: React.DragEvent, arg2: Column) => void,
    handleTaskDragOver: (arg1: React.DragEvent, arg2: Task) => boolean,
    handleColumnDragOver: (arg1: React.DragEvent, arg2: Column) => boolean,
    handleDrop: (arg1: React.DragEvent) => void,
    sourceTask: Task | null,
    targetTask: Task | null
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'inline-flex',
            flexDirection: "column",
            height: '100%',
            width: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            minWidth: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            maxWidth: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            marginRight: 20,
            overflowX: 'hidden',
            overflowY: 'auto',
            '&:last-of-type': {
                marginRight: 0
            }
        },
        content: {
            backgroundColor: 'white',
            boxShadow: "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px",
            borderRadius: 5,
            padding: 20,
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,

            '& svg': {
                cursor: 'pointer'
            }
        }
    })
);

const ColumnComp: React.FC<IColumnProps> = props => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const tasks: Task[] = useSelector((state: any) => state.task.tasks);

    const getTasks = (): Task[] => {
        const data: Task[] = [];

        props.column.taskIDs?.forEach(taskID => {
            const task = tasks.find(t => t.id === taskID);

            if (!task) return;

            if (props.filter?.searchString &&
                task.code.toLowerCase().indexOf(props.filter?.searchString?.toLowerCase()) === -1 &&
                task.title.toLowerCase().indexOf(props.filter?.searchString?.toLowerCase()) === -1)
                return;

            if (props.filter?.userIDs &&
                props.filter?.userIDs.length > 0 &&
                !props.filter?.userIDs.includes(task?.asigneeID || ""))
                return;

            data.push(task);
        });

        return data;
    }

    const columnTasks = getTasks();

    let columnTaskCountText = props.column.taskIDs?.length === columnTasks.length
                            ? columnTasks.length
                            : columnTasks.length + " of " + props.column.taskIDs?.length;
    const taskIDsCount = props.column.taskIDs?.length || 0;

    return (
        <Auxi>
            <Popover
                id="column-actions-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List>
                    <ListItem
                        button
                        onClick={() => {
                            props.handleColumnRename(props.column);
                            setAnchorEl(null);
                        }}
                    >
                        Rename
                    </ListItem>
                    <ListItem
                        button
                        disabled={taskIDsCount > 0}
                        onClick={() => {
                            props.handleColumnDelete(props.column);
                            setAnchorEl(null);
                        }}
                    >
                        Delete
                    </ListItem>
                </List>
            </Popover>

            <div
                className={classes.root}
                draggable
                onDragStart={(ev: React.DragEvent) => props.handleColumnDragStart(ev, props.column)}
                onDragOver={(ev: React.DragEvent) => props.handleColumnDragOver(ev, props.column)}
                onDrop={props.handleDrop}
            >
                <div className={classes.content}>
                    <div className={classes.header}>
                        <Typography>
                            {props.column.name} {props.column.taskIDs?.length ? "(" + columnTaskCountText + ")" : ''}
                        </Typography>
                        {
                            ((props.account.role === UserRole.ADMIN || props.account.role === UserRole.COADMIN))
                            ? <MoreHorizIcon
                                onClick={(ev: React.MouseEvent) => {
                                    setAnchorEl(ev.currentTarget as HTMLElement);
                                }}  
                            />
                            : null
                        }
                    </div>
                    <Tasks
                        board={props.board}
                        data={columnTasks}
                        column={props.column}
                        sourceTask={props.sourceTask}
                        targetTask={props.targetTask}
                        handleDragStart={props.handleTaskDragStart}
                        handleDragOver={props.handleTaskDragOver}
                        handleDrop={props.handleDrop}
                    />
                </div>
            </div>
        </Auxi>
    );
};

export default ColumnComp;