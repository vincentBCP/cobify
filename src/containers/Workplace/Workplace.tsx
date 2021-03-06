import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { connect, useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter¬†} from 'react-router-dom';

import {makeStyles, createStyles, Theme, CircularProgress} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import './Workplace.scss';

import ApplicationBar from '../../components/ApplicationBar';

import BoardSelector from './BoardSelector';
import UserList from './UserList';
import Columns from './Columns';
import ColumnFormModal from './ColumnFormModal';
import TaskFormModal from './TaskFormModal';
import TaskViewModal from './TaskViewModal';
import LabelFilter from './LabelFilter';

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

import ErrorContext from '../../context/errorContext';
import AppContext, { SCREEN_SIZE } from '../../context/appContext';

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
            padding: "30px 50px 0px 50px",
            display: 'flex',
            alignItems: 'center',

            '&.sm, &.md': {
                padding: 10
            }
        },
        headerGroup: {
            display: 'flex',
            alignItems: 'center',

            '&:nth-of-type(3) > div': {
                marginLeft: 20
            },

            '&.sm, &.md': {
                width: '100%',
                margin: 0,
                marginBottom: 10,

                '& > button': {
                    width: 'calc(50% - 5px)',

                    '&:last-of-type': {
                        marginRight: 0
                    }
                },

                '&:nth-of-type(2)': {
                    marginBottom: 20,

                    '& > form': {
                        flexGrow: 1,
                        marginRight: 10
                    }
                },

                '&:nth-of-type(3) > div': {
                    marginLeft: 0
                }
            }
        },
        content: {
            overflow: 'auto',
            flexGrow: 1
        },
        button: {
            marginRight: 10,
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            color: '#777f8a'
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

    const errorContext = React.useContext(ErrorContext);
    const appContext = React.useContext(AppContext);

    const [showColumnForm, setShowColumnForm] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<Column | null>();
    const [addTask, setAddTask] = useState(false);
    const [board, setBoard] = useState<Board | undefined>();
    const [viewingTask, setViewingTask] = useState<Task | undefined>();
    const [loading, setLoading] = useState(false);
    const [searchString, setSearchString] = useState<string>();
    const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>();
    const [selectedLabels, setSelectedLabels] = useState<string[]>();

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
        window.document.title = "Workplace - Cobify";

        if (board) {
            window.document.title = board.name + " - Cobify";
        }

        if (viewingTask) {
            window.document.title = viewingTask.code + " - " + board?.name + " - Cobify";
        }
    }, [board, viewingTask]);

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

    const handleSumbitColumn = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
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
            setBoard(updatedBoard);

            return BoardAPI.updateBoard(updatedBoard);
        });
        
        return [
            request,
            response => {
                setShowColumnForm(false);
            },
            error => {
                errorContext.setError(error);
            }
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

    const handleSumbitTask = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
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

                return ColumnAPI.updateColumn(updatedColumn);
            }),
            response => {
                setAddTask(false);
            },
            error => {
                errorContext.setError(error);
            }
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
        ])
        .then(response => { })
        .catch(error => {
            errorContext.setError(error);
        });
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
        BoardAPI.updateBoard(updatedBoard)
        .then(response => { })
        .catch(error => {
            errorContext.setError(error);
        });
    }

    const handleLabelsFilterChange = (labels: string[]) => {
        setSelectedLabels([...labels]);
    }

    return (
        <React.Fragment>
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

            {
                board && viewingTask
                ? <TaskViewModal
                    board={board}
                    task={viewingTask}
                />
                : null
            }

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
                    ? <React.Fragment>
                        <Grid
                            container
                            direction="row"
                            className={[classes.header, appContext.screenSize].join(' ')}
                        >
                            <div className={[classes.headerGroup, appContext.screenSize].join(' ')}>
                                {
                                    (account?.role === UserRole.ADMIN || account?.role === UserRole.COADMIN)
                                    ? <Button
                                        variant="text"
                                        className={classes.button}
                                        startIcon={<AddIcon />}
                                        color="default"
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
                                        variant="text" 
                                        className={classes.button}
                                        startIcon={<AddIcon />}
                                        color="default"
                                        disabled={!board?.columnIDs || board?.columnIDs.length < 1}
                                        onClick={() => {
                                            if (!board?.columnIDs || board?.columnIDs.length < 1) return;
                                            setAddTask(true)
                                        }}
                                    >Task</Button>
                                    : null
                                }
                            </div>
                            <div className={[classes.headerGroup, appContext.screenSize].join(' ')}>
                                <SearchBar
                                    placeholder="Search task"
                                    handleChange={(searchString: string) => setSearchString(searchString)}
                                />
                                {
                                    appContext.screenSize !== SCREEN_SIZE.lg
                                    ? <LabelFilter
                                        boardID={board.id}
                                        labels={selectedLabels}
                                        handleChange={handleLabelsFilterChange}
                                    />
                                    : null
                                }
                            </div>
                            <div className={[classes.headerGroup, appContext.screenSize].join(' ')}>
                                <UserList
                                    boardID={board?.id}
                                    handleSelectionChange={ids => setSelectedUserIDs(ids)}
                                />
                                {
                                    appContext.screenSize === SCREEN_SIZE.lg
                                    ? <LabelFilter
                                        boardID={board.id}
                                        labels={selectedLabels}
                                        handleChange={handleLabelsFilterChange}
                                    />
                                    : null
                                }
                            </div>
                        </Grid>
                        <Grid container direction="row" className={classes.content}>
                            <Columns
                                board={board}
                                filter={{
                                    searchString: searchString,
                                    userIDs: selectedUserIDs,
                                    labels: selectedLabels
                                }}
                                handleBoardUpdate={handleBoardUpdate}
                                handleColumnDelete={handleColumnDelete}
                                handleColumnRename={handleColumnRename}
                            />
                        </Grid>
                    </React.Fragment>
                    : null
                }
            </Paper>
        </React.Fragment>
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