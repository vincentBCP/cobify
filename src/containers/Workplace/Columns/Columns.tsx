import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';

import Board from '../../../models/types/Board';
import Column from '../../../models/types/Column';
import Task from '../../../models/types/Task';
import User from '../../../models/types/User';

import * as actionTypes from '../../../store/actions/actionTypes';

import ColumnAPI from '../../../api/ColumnAPI';
import TaskAPI from '../../../api/TaskAPI';

import ColumnComp from './Column';

import ErrorContext from '../../../context/errorContext';

export interface IFilter {
    searchString?: string,
    userIDs?: string[]
}

interface IColumnsProps {
    board: Board,
    filter: IFilter,
    handleBoardUpdate: (arg1: Board) => void,
    handleColumnDelete: (arg1: Column) => void,
    handleColumnRename: (arg1: Column) => void
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            whiteSpace: 'nowrap',
            padding: "30px 50px 30px 50px"
        }
    })
);

const Columns: React.FC<IColumnsProps> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const errorContext = React.useContext(ErrorContext);

    const [board, setBoard] = useState<Board>();
    const [sourceTask, setSourceTask] = useState<Task | null>(null);
    const [targetTask, setTargetTask] = useState<Task | null>(null);
    const [sourceColumn, setSourceColumn] = useState<Column | null>(null);
    const [targetColumn, setTargetColumn] = useState<Column | null>(null);

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

    const handleTaskDragOver = (ev: React.DragEvent, task: Task): boolean => {
        if (sourceColumn) return false;

        ev.stopPropagation();

        if (sourceTask?.id === task.id) return false;

        ev.preventDefault();
        setTargetTask(task);
        setTargetColumn(null);

        return true;
    }

    const handleColumnDragOver = (ev: React.DragEvent, column: Column): boolean => {
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

        return true;
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

            props.handleBoardUpdate(updatedBoard);

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
            ColumnAPI.updateColumn(updatedTargetColumn)
            .then(response => { })
            .catch(error => {
                errorContext.setError(error);
            });

            clearDnD();
            return;
        }

        updatedTargetColumn.taskIDs?.splice(targetIndex, 0, sourceTask?.id); // add task id to the list

        dispatch({
            type: actionTypes.UPDATE_COLUMN,
            payload: {...updatedTargetColumn}
        });
        ColumnAPI.updateColumn(updatedTargetColumn)
        .then(response => { })
        .catch(error => {
            errorContext.setError(error);
        });

        const updatedSourceTask: Task = {
            ...sourceTask,
            columnID: tColumn.id,
            updated: (new Date()).toISOString()
        };

        dispatch({
            type: actionTypes.UPDATE_TASK,
            payload: {...updatedSourceTask}
        });
        TaskAPI.updateTask(updatedSourceTask)
        .then(response => { })
        .catch(error => {
            errorContext.setError(error);
        });
        
        const updatedSourceColumn: Column = {
            ...sColumn,
            taskIDs: [...(sColumn.taskIDs || [])]
        }

        updatedSourceColumn.taskIDs?.splice(sourceIndex, 1); // remove taskID from the list

        dispatch({
            type: actionTypes.UPDATE_COLUMN,
            payload: {...updatedSourceColumn}
        });
        ColumnAPI.updateColumn(updatedSourceColumn)
        .then(response => { })
        .catch(error => {
            errorContext.setError(error);
        });

        clearDnD();
    }

    if (!board) return null;

    return (
        <div className={classes.root}>
            {
                (board?.columnIDs || []).map(colID => {
                    const column = columns.find(c => c.id === colID);

                    if (!column) return null;

                    return <ColumnComp
                        key={"column-" + column.id}
                        account={account}
                        board={board}
                        column={column}
                        filter={props.filter}
                        handleBoardUpdate={props.handleBoardUpdate}
                        handleColumnDelete={props.handleColumnDelete}
                        handleColumnRename={props.handleColumnRename}
                        handleTaskDragStart={handleTaskDragStart}
                        handleColumnDragStart={handleColumnDragStart}
                        handleTaskDragOver={handleTaskDragOver}
                        handleColumnDragOver={handleColumnDragOver}
                        handleDrop={handleDrop}
                        sourceTask={sourceTask}
                        targetTask={targetTask}
                    />
                })
            }
        </div>
    );
};

export default Columns;