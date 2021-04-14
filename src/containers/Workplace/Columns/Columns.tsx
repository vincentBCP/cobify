import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Tasks from './Tasks';

import Board from '../../../models/types/Board';
import Column from '../../../models/types/Column';
import Task from '../../../models/types/Task';

import { SIDE_NAVIGATION_WIDTH } from '../../../components/SideNavigation/SideNavigation';

import * as actionTypes from '../../../store/actions/actionTypes';

import ColumnAPI from '../../../api/ColumnAPI';
import TaskAPI from '../../../api/TaskAPI';
import BoardAPI from '../../../api/BoardAPI';

interface IColumnsProps {
    board: Board,
    handleBoardUpdate: (board: Board) => void
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
        columnTitle: {
            marginBottom: 20
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

    const handleDrop = (ev: React.DragEvent) => {
        ev.preventDefault();

        if (!board) return;

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

            return;
        }

        // TASK is dropped in the column or task
        if (!sourceTask) return;

        const sColumn = columns.find(c => c.id === sourceTask?.columnID);
        const tColumn = targetColumn || columns.find(c => c.id === targetTask?.columnID);

        if (!sColumn || !tColumn) return;

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

            return;
        }

        updatedTargetColumn.taskIDs?.splice(targetIndex, 0, sourceTask?.id);

        dispatch({
            type: actionTypes.UPDATE_COLUMN,
            payload: {...updatedTargetColumn}
        });
        ColumnAPI.updateColumn(updatedTargetColumn);

        const updatedSourceTask: Task = {
            ...sourceTask,
            columnID: tColumn.id
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
    }

    return (
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
                        <Typography className={classes.columnTitle}>{column.name}</Typography>
                        <Tasks
                            board={props.board}
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
    );
};

export default Columns;