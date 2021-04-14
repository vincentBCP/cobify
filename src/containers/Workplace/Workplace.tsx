import React, { useState } from 'react';

import { connect, useDispatch, useSelector } from 'react-redux';

import {makeStyles, createStyles, Theme, CircularProgress} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import './Workplace.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';

import BoardSelector from './BoardSelector';
import GuestList from './GuestList';
import Columns from './Columns';
import CreateColumnFormModal from './CreateColumnFormModal';
import CreateTaskFormModal from './CreateTaskFormModal';

import Board from '../../models/types/Board';
import ColumnDTO from '../../models/dto/ColumnDTO';
import TaskDTO from '../../models/dto/TaskDTO';
import Column from '../../models/types/Column';
import Task from '../../models/types/Task';

import * as actions from '../../store/actions';
import * as actionTypes from '../../store/actions/actionTypes';

import BoardAPI from '../../api/BoardAPI';
import ColumnAPI from '../../api/ColumnAPI';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            backgroundColor: 'transparent',
            height: '100%',
            position: 'relative'
        },
        header: {
            padding: "30px 50px 20px 50px"
        },
        button: {
            marginRight: 10
        }
    })
);

interface IWorkplaceProps {
    createColumn: (arg1: ColumnDTO) => Promise<any>,
    createTask: (arg1: TaskDTO) => Promise<any>
}

const Workplace: React.FC<IWorkplaceProps> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [addColumn, setAddColumn] = useState(false);
    const [addTask, setAddTask] = useState(false);
    const [board, setBoard] = useState<Board>();
    const [loading, setLoading] = useState(false);

    const columns: Column[] = useSelector((state: any) => state.column.columns);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);

    const handleBoardChange = (board: Board) => {
        setLoading(true);
        setBoard(board);

        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }

    const handleSumbitColumn = (data: any): [Promise<any>, () => void, () => void] => {
        return [
            props.createColumn({
                name: data.name,
                boardID: board?.id,
                accountID: board?.accountID,
            } as ColumnDTO)
            .then(column => {
                if (!board) return column;
                
                const updatedBoard: Board = {
                    ...board,
                    columnIDs: [
                        ...(board?.columnIDs || []),
                        column.id
                    ]
                };

                dispatch({
                    type: actionTypes.UPDATE_BOARD,
                    payload: updatedBoard
                });
                BoardAPI.updateBoard(updatedBoard);

                setBoard(updatedBoard);

                return column;
            }),
            () => {
                setAddColumn(false);
            },
            () => { }
        ];
    }

    const handleCancelCreateColumn = () => {
        setAddColumn(false);
    }

    const handleSumbitTask = (data: any): [Promise<any>, () => void, () => void] => {
        const t: TaskDTO = {
            ...data,
            code: (board?.code || "") + "-" + (tasks.filter(t => t.boardID === board?.id).length + 1),
            columnID: board?.columnIDs[0],
            boardID: board?.id,
            accountID: board?.accountID,
        };

        return [
            props.createTask(t)
            .then(task => {
                const column = columns.find(c => c.id === task.columnID);

                if (!column) return task;
                
                const updatedColumn = {
                    ...column,
                    taskIDs: [
                        ...(column?.taskIDs || []),
                        task.id
                    ]
                };
                
                dispatch({
                    type: actionTypes.UPDATE_COLUMN,
                    payload: updatedColumn
                });
                ColumnAPI.updateColumn(updatedColumn);

                return task;
            }),
            () => {
                setAddTask(false);
            },
            () => { }
        ];
    }

    const handleCancelCreateTask = () => {
        setAddTask(false);
    }

    return (
        <Auxi>
            <ApplicationBar
                title="Workplace"
                component={<BoardSelector handleChange={handleBoardChange} />}
            />

            <CreateColumnFormModal
                open={addColumn}
                handleSubmit={handleSumbitColumn}
                handleCancel={handleCancelCreateColumn}
            />

            <CreateTaskFormModal
                open={addTask}
                handleSubmit={handleSumbitTask}
                handleCancel={handleCancelCreateTask}
            />

            <Paper elevation={0} className={classes.root}>
                {
                    loading
                    ? <div id="workspace-preloader">
                        <CircularProgress />
                        <span>Loading workspace...</span>
                    </div>
                    : null
                }
                
                {
                    board
                    ? <Auxi>
                        <Grid container direction="row" className={classes.header}>
                            <Button
                                variant="contained"
                                className={classes.button}
                                startIcon={<AddIcon />}
                                color="primary"
                                onClick={() => setAddColumn(true)}
                            >Column</Button>
                            <Button
                                variant="contained" 
                                className={classes.button}
                                startIcon={<AddIcon />}
                                color="primary"
                                disabled={!board?.columnIDs || board?.columnIDs.length < 1}
                                onClick={() => setAddTask(true)}
                            >Task</Button>
                            <span style={{flexGrow: 1}}></span>
                            <GuestList
                                boardID={board?.id}
                            />
                        </Grid>
                        <Columns
                            board={board}
                        />
                    </Auxi>
                    : null
                }
            </Paper>
        </Auxi>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        createColumn: (dto: ColumnDTO) => dispatch(actions.createColumn(dto)),
        createTask: (dto: TaskDTO) => dispatch(actions.createTask(dto))
    }
}

export default connect(null, mapDispatchToProps)(Workplace);