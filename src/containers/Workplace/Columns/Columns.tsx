import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Tasks from './Tasks';

import Auxi from '../../../hoc/Auxi';

import Board from '../../../models/types/Board';
import Column from '../../../models/types/Column';
import Task from '../../../models/types/Task';
import User from '../../../models/types/User';
import UserRole from '../../../models/enums/UserRole';

import { SIDE_NAVIGATION_WIDTH } from '../../../components/SideNavigation/SideNavigation';

import * as actionTypes from '../../../store/actions/actionTypes';

import ColumnAPI from '../../../api/ColumnAPI';
import TaskAPI from '../../../api/TaskAPI';
import BoardAPI from '../../../api/BoardAPI';

interface IColumnsProps {
    board: Board,
    searchString?: string,
    handleBoardUpdate: (arg1: Board) => void,
    handleColumnDelete: (arg1: Column) => void,
    handleColumnRename: (arg1: Column) => void
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            overflow: 'auto',
            whiteSpace: 'nowrap',
            padding: "0 50px 20px 50px"
        },
        column: {
            display: 'inline-flex',
            flexDirection: "column",
            backgroundColor: 'white',
            borderRadius: 5,
            width: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            minWidth: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            maxWidth: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            marginRight: 20,
            padding: 20,
            overflowX: 'hidden',
            overflowY: 'auto',
            boxShadow: "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px",
            '&:last-of-type': {
                marginRight: 0
            }
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

const Columns: React.FC<IColumnsProps> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [board, setBoard] = useState<Board>();
    const [sourceTask, setSourceTask] = useState<Task | null>(null);
    const [targetTask, setTargetTask] = useState<Task | null>(null);
    const [sourceColumn, setSourceColumn] = useState<Column | null>(null);
    const [targetColumn, setTargetColumn] = useState<Column | null>(null);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedColumn, setSelectedColumn] = useState<Column | null>();

    const account: User = useSelector((state: any) => state.app.account);
    const columns: Column[] = useSelector((state: any) => state.column.columns);

    useEffect(() => {
        setBoard(props.board);
    }, [props.board]);

    const handleTaskDragStart = (ev: React.DragEvent, task: Task) => {
        ev.stopPropagation();
        setSourceTask(task);
    }

    const handleColumnDragStart = (ev: React.DragEvent, column: Column) => {
        ev.stopPropagation();
        setSourceTask(null);
        setSourceColumn(column);
    }

    const handleTaskDragOver = (ev: React.DragEvent, task: Task) => {
        if (sourceColumn) return false;

        ev.stopPropagation();

        if (sourceTask?.id === task.id) return false;

        ev.preventDefault();
        setTargetTask(task);
        setTargetColumn(null);

        return true;
    }

    const handleColumnDragOver = (ev: React.DragEvent, column: Column) => {
        if (sourceColumn) { // COLUMN is over column
            if (sourceColumn.id === column.id) return false;

            ev.preventDefault();
            setTargetColumn(column);
            
            return true;
        }
        
        // TASK is over column
        if (sourceTask?.columnID === column.id) return false;
                            
        ev.preventDefault();
        setTargetColumn(column);
        setTargetTask(null);
    }

    const clearDnD = () => {
        setSourceTask(null);
        setTargetTask(null);
        setSourceColumn(null);
        setTargetColumn(null);
    };

    const handleDrop = (ev: React.DragEvent) => {
        ev.preventDefault();

        if (!board) {
            clearDnD();
            return;
        }

        // COLUMN is dropped in the column
        if (sourceColumn && targetColumn) {
            const sourceIndex = board.columnIDs.findIndex(id => id === sourceColumn.id)
            const targetIndex = board.columnIDs.findIndex(id => id === targetColumn.id);

            const updatedBoard = {...board};
            updatedBoard.columnIDs = [...board.columnIDs];
            updatedBoard.columnIDs.splice(sourceIndex < targetIndex ? targetIndex + 1: targetIndex, 0, sourceColumn.id);
            updatedBoard.columnIDs.splice(sourceIndex > targetIndex ? sourceIndex + 1 : sourceIndex, 1);

            dispatch({
                type: actionTypes.UPDATE_BOARD,
                payload: updatedBoard
            });
            // setBoard(updatedBoard);
            props.handleBoardUpdate(updatedBoard);
            BoardAPI.updateBoard(updatedBoard);

            clearDnD();
            return;
        }

        // TASK is dropped in the column or task
        if (!sourceTask) {
            clearDnD();
            return;
        }

        const sColumn = columns.find(c => c.id === sourceTask?.columnID);
        const tColumn = targetColumn || columns.find(c => c.id === targetTask?.columnID);

        if (!sColumn || !tColumn) {
            clearDnD();
            return;
        }

        const sourceIndex = !sColumn.taskIDs ? 0 : sColumn.taskIDs.findIndex(str => str === sourceTask?.id);
        let targetIndex = !tColumn.taskIDs ? 0 : tColumn.taskIDs.findIndex(str => str === targetTask?.id);
        
        const updatedTargetColumn: Column = {
            ...tColumn,
            taskIDs: [...(tColumn.taskIDs || [])]
        }

        if (tColumn.id === sColumn.id) {
            updatedTargetColumn.taskIDs?.splice(sourceIndex < targetIndex ? targetIndex + 1 : targetIndex, 0, sourceTask?.id);
            updatedTargetColumn.taskIDs?.splice(sourceIndex > targetIndex ? sourceIndex + 1 : sourceIndex, 1);

            dispatch({
                type: actionTypes.UPDATE_COLUMN,
                payload: {...updatedTargetColumn}
            });
            ColumnAPI.updateColumn(updatedTargetColumn);

            clearDnD();
            return;
        }

        updatedTargetColumn.taskIDs?.splice(targetIndex, 0, sourceTask?.id); // add task id to the list

        dispatch({
            type: actionTypes.UPDATE_COLUMN,
            payload: {...updatedTargetColumn}
        });
        ColumnAPI.updateColumn(updatedTargetColumn);

        const updatedSourceTask: Task = {
            ...sourceTask,
            columnID: tColumn.id,
            updated: (new Date()).toUTCString()
        };

        dispatch({
            type: actionTypes.UPDATE_TASK,
            payload: {...updatedSourceTask}
        });
        TaskAPI.updateTask(updatedSourceTask);
        
        const updatedSourceColumn: Column = {
            ...sColumn,
            taskIDs: [...(sColumn.taskIDs || [])]
        }

        updatedSourceColumn.taskIDs?.splice(sourceIndex, 1); // remove taskID from the list

        dispatch({
            type: actionTypes.UPDATE_COLUMN,
            payload: {...updatedSourceColumn}
        });
        ColumnAPI.updateColumn(updatedSourceColumn);

        clearDnD();
    }

    return (
        <Auxi>
            <Popover
                id="column-actions-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                    setSelectedColumn(null);
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
                            if (selectedColumn) props.handleColumnRename(selectedColumn);
                            setAnchorEl(null);
                        }}
                    >
                        Rename
                    </ListItem>
                    <ListItem
                        button
                        disabled={selectedColumn ? Boolean(selectedColumn.taskIDs?.length) : true }
                        onClick={() => {
                            if (selectedColumn) props.handleColumnDelete(selectedColumn);
                            setAnchorEl(null);
                        }}
                    >
                        Delete
                    </ListItem>
                </List>
            </Popover>

            <div className={classes.root}>
                {
                    (board?.columnIDs || []).map(colID => {
                        const column = columns.find(c => c.id === colID);

                        if (!column) return null;

                        return <div
                            key={"columns-" + column.id}
                            className={classes.column}
                            draggable
                            onDragStart={(ev: React.DragEvent) => handleColumnDragStart(ev, column)}
                            onDragOver={(ev: React.DragEvent) => handleColumnDragOver(ev, column)}
                            onDrop={handleDrop}
                        >
                            <div className={classes.header}>
                                <Typography>
                                    {column.name} {column.taskIDs?.length ? "(" + column.taskIDs?.length + ")" : ''}
                                </Typography>
                                {
                                    ((account.role === UserRole.ADMIN || account.role === UserRole.COADMIN))
                                    ? <MoreHorizIcon
                                        onClick={(ev: React.MouseEvent) => {
                                            setAnchorEl(ev.currentTarget as HTMLElement);
                                            setSelectedColumn(column);
                                        }}  
                                    />
                                    : null
                                }
                            </div>
                            <Tasks
                                board={props.board}
                                searchString={props.searchString}
                                column={column}
                                sourceTask={sourceTask}
                                targetTask={targetTask}
                                handleDragStart={handleTaskDragStart}
                                handleDragOver={handleTaskDragOver}
                                handleDrop={handleDrop}
                            />
                        </div>
                    })
                }
            </div>
        </Auxi>
    );
};

export default Columns;