import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { connect, useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import {makeStyles, createStyles, Theme, CircularProgress} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import './Workplace.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';

import BoardSelector from './BoardSelector';
import UserList from './UserList';
import Columns from './Columns';
import ColumnFormModal from './ColumnFormModal';
import TaskFormModal from './TaskFormModal';
import TaskViewModal from './TaskViewModal';

import Board from '../../models/types/Board';
import ColumnDTO from '../../models/dto/ColumnDTO';
import TaskDTO from '../../models/dto/TaskDTO';
import Column from '../../models/types/Column';
import Task from '../../models/types/Task';
import User from '../../models/types/User';
import UserRole from '../../models/enums/UserRole';
import Invitation from '../../models/types/Invitation';

import SearchBar from '../../widgets/SearchBar';

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
            padding: "30px 50px 30px 50px",
            display: 'flex',
            alignItems: 'center',
        },
        button: {
            marginRight: 10,
            paddingTop: 8,
            paddingBottom: 8
        }
    })
);

interface IWorkplaceProps {
    createColumn: (arg1: ColumnDTO) => Promise<any>,
    updateColumn: (arg1: Column) => Promise<any>,
    createTask: (arg1: TaskDTO) => Promise<any>
}

const Workplace: React.FC<IWorkplaceProps & RouteComponentProps> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [showColumnForm, setShowColumnForm] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<Column | null>();
    const [addTask, setAddTask] = useState(false);
    const [board, setBoard] = useState<Board | undefined>();
    const [viewingTask, setViewingTask] = useState<Task | undefined>();
    const [loading, setLoading] = useState(false);
    const [searchString, setSearchString] = useState<string>();
    const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>();

    const account: User = useSelector((state: any) => state.app.account);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const boards: Board[] = useSelector((state: any) =>
        state.board.boards.filter((b: Board) => {
            if (account.role === UserRole.ADMIN) {
                return b?.accountID === account.id
            }

            const invitation = invitations.find((i: Invitation) => i.userID === account.id && i.boardID === b.id);

            return Boolean(invitation);
        })
    );
    const columns: Column[] = useSelector((state: any) => state.column.columns);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);

    useEffect(() => {
        const params: any = props.match.params || {};
        const boardCode = params.boardCode;
        const taskCode = params.taskCode;

        const task = tasks.find(t => taskCode && t.code === taskCode);

        if (board && board.code === boardCode) {
            if (!loading) setViewingTask(task);
            return;
        };
        
        if (!boardCode) {
            setBoard(undefined);
            return;
        };

        const selectedBoard = boards.find(b => b.code === boardCode);

        if (!selectedBoard) {
            setBoard(undefined);
            return;
        };

        setLoading(true);
        setBoard(selectedBoard);

        setTimeout(() => {
            setLoading(false);
            setViewingTask(task);
        }, 2000);
    }, [props.match, boards, board, tasks, loading]);

    const handleSumbitColumn = (data: any): [Promise<any>, () => void, () => void] => {
        const request = selectedColumn
        ? props.updateColumn({
            ...selectedColumn,
            ...data
        })
        : props.createColumn({
            ...data,
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
        });
        
        return [
            request,
            () => {
                setShowColumnForm(false);
            },
            () => { }
        ];
    }

    const handleCancelCreateColumn = () => {
        setShowColumnForm(false);
    }

    const createTaskCode = (): string => {
        const bTasks = _.orderBy(tasks.filter(t => t.boardID === board?.id), ["code"], ["desc"]);

        const num = bTasks[0] ? Number(bTasks[0].code.split("-")[1]) + 1 : 1;

        if (num < 10) return board?.code + "-00" + num;
        if (num < 100) return board?.code + "-0" + num;
        return board?.code + "-" + num;
    }

    const handleSumbitTask = (data: any): [Promise<any>, () => void, () => void] => {
        const t: TaskDTO = {
            ...data,
            code: createTaskCode(),
            columnID: board?.columnIDs[0],
            boardID: board?.id,
            creatorID: account.id,
            accountID: board?.accountID,
            created: (new Date()).toISOString(),
            updated: (new Date()).toISOString()
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

    const handleColumnDelete = (column: Column) => {
        if (!board) return;
        const updatedBoard: Board = {
            ...board,
            columnIDs: [...board.columnIDs]
        };
        const ind = updatedBoard.columnIDs.findIndex(cID => cID === column.id);
        updatedBoard.columnIDs.splice(ind, 1); // remove column id from the list

        setBoard({...updatedBoard});
        Promise.all([
            ColumnAPI.deleteColumn(column.id),
            BoardAPI.updateBoard(updatedBoard)
        ]);
    }

    const handleColumnRename = (column: Column) => {
        setSelectedColumn(column);
        setShowColumnForm(true);
    }

    const handleBoardUpdate = (updatedBoard: Board) => {
        dispatch({
            type: actionTypes.UPDATE_BOARD,
            payload: updatedBoard
        });
        setBoard(updatedBoard);
        BoardAPI.updateBoard(updatedBoard);
    }

    return (
        <Auxi>
            <ApplicationBar
                title="Workplace"
                component={<BoardSelector boards={boards} board={board} />}
            />

            <ColumnFormModal
                open={showColumnForm}
                column={selectedColumn}
                handleSubmit={handleSumbitColumn}
                handleCancel={handleCancelCreateColumn}
            />

            <TaskFormModal
                open={addTask}
                handleSubmit={handleSumbitTask}
                handleCancel={handleCancelCreateTask}
            />

            <TaskViewModal
                board={board}
                task={viewingTask}
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
                            {
                                (account?.role === UserRole.ADMIN || account?.role === UserRole.COADMIN)
                                ? <Button
                                    variant="contained"
                                    className={classes.button}
                                    startIcon={<AddIcon />}
                                    color="primary"
                                    onClick={() => {
                                        setSelectedColumn(null);
                                        setShowColumnForm(true);
                                    }}
                                >Column</Button>
                                : null
                            }
                            {
                                (account?.role === UserRole.ADMIN || account?.role === UserRole.COADMIN)
                                ? <Button
                                    variant="contained" 
                                    className={classes.button}
                                    startIcon={<AddIcon />}
                                    color="primary"
                                    disabled={!board?.columnIDs || board?.columnIDs.length < 1}
                                    onClick={() => setAddTask(true)}
                                >Task</Button>
                                : null
                            }
                            <SearchBar
                                placeholder="Search task"
                                handleChange={(searchString: string) => setSearchString(searchString)}
                            />
                            <UserList
                                boardID={board?.id}
                                handleSelectionChange={ids => setSelectedUserIDs(ids)}
                            />
                        </Grid>
                        <Columns
                            board={board}
                            filter={{
                                searchString: searchString,
                                userIDs: selectedUserIDs
                            }}
                            handleBoardUpdate={handleBoardUpdate}
                            handleColumnDelete={handleColumnDelete}
                            handleColumnRename={handleColumnRename}
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
        updateColumn: (column: Column) => dispatch(actions.updateColumn(column)),
        createTask: (dto: TaskDTO) => dispatch(actions.createTask(dto))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(Workplace));