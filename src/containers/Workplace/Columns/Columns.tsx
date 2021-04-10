import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Tasks from './Tasks';

import Column from '../../../models/types/Column';
import Task from '../../../models/types/Task';

import { SIDE_NAVIGATION_WIDTH } from '../../../components/SideNavigation/SideNavigation';

import * as actionTypes from '../../../store/actions/actionTypes';

interface IColumnsProps {
    boardID: string
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

    const [sourceTask, setSourceTask] = useState<Task | null>(null);
    const [targetTask, setTargetTask] = useState<Task | null>(null);
    const [targetColumn, setTargetColumn] = useState<Column | null>(null);

    const columns: Column[] = useSelector((state: any) => 
        state.column.columns.filter((c: Column) => c.boardID === props.boardID));

    const handleDragStart = (ev: React.DragEvent, task: Task) => {
        setSourceTask(task);
        ev.dataTransfer.setData("text", task.id);
    }

    const handleDragOver = (ev: React.DragEvent, task: Task) => {
        ev.stopPropagation();

        if (sourceTask?.id === task.id) return false;

        ev.preventDefault();
        setTargetTask(task);
        setTargetColumn(null);

        return true;
    }

    const handleDrop = (ev: React.DragEvent) => {
        ev.preventDefault();

        if (!sourceTask) return;

        const sColumn = columns.find(c => c.id === sourceTask?.columnID);
        const tColumn = targetColumn || columns.find(c => c.id === targetTask?.columnID);

        if (!sColumn || !tColumn) return;

        const sourceIndex = !sColumn.taskIDs ? 0 : sColumn.taskIDs.findIndex(str => str === sourceTask?.id);
        let targetIndex = !tColumn.taskIDs ? 0 : tColumn.taskIDs.findIndex(str => str === targetTask?.id) + 1;
        
        const updatedTargetColumn: Column = {
            ...tColumn,
            taskIDs: [...(tColumn.taskIDs || [])]
        }
        
        updatedTargetColumn.taskIDs?.splice(targetIndex, 0, sourceTask?.id); // add duplicate taskID to the list

        if (tColumn.id === sColumn.id) {
            updatedTargetColumn.taskIDs?.splice(sourceIndex, 1); // remove original taskID from the list

            dispatch({
                type: actionTypes.UPDATE_COLUMN,
                payload: {...updatedTargetColumn}
            });

            return;
        }

        dispatch({
            type: actionTypes.UPDATE_COLUMN,
            payload: {...updatedTargetColumn}
        });

        const updatedSourceTask: Task = {
            ...sourceTask,
            columnID: tColumn.id
        };

        dispatch({
            type: actionTypes.UPDATE_TASK,
            payload: {...updatedSourceTask}
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
    }

    return (
        <div className={classes.root}>
            {
                columns.map(col =>
                    <div
                        key={"columns-" + col.id}
                        className={classes.column}
                        onDragOver={(ev: React.DragEvent) => {
                            if (sourceTask?.columnID === col.id) return false;
                            
                            ev.preventDefault();
                            setTargetColumn(col);
                            setTargetTask(null);
                        }}
                        onDrop={handleDrop}
                    >
                        <Typography className={classes.columnTitle}>{col.name}</Typography>
                        <Tasks
                            column={col}
                            sourceTask={sourceTask}
                            targetTask={targetTask}
                            handleDragStart={handleDragStart}
                            handleDragOver={handleDragOver}
                            handleDrop={handleDrop}
                        />
                    </div>    
                )
            }
        </div>
    );
};

export default Columns;