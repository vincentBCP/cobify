import React, { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';

import Avatar from '../../../widgets/Avatar';

import TaskFormModal from '../TaskFormModal';

import AsigneeSelector from './AsigneeSelector';
import ColumnSelector from './ColumnSelector';
import Comments from './Comments';
import Attachments from './Attachments';
import LabelSelector from './LabelSelector';

import Task from '../../../models/types/Task';
import TaskDTO from '../../../models/dto/TaskDTO';
import Board from '../../../models/types/Board';
import Column from '../../../models/types/Column';
import User from '../../../models/types/User';
import Comment from '../../../models/types/Comment';
import UserRole from '../../../models/enums/UserRole';

import * as actions from '../../../store/actions';

import ErrorContext from '../../../context/errorContext';
import AppContext, { SCREEN_SIZE } from '../../../context/appContext';

interface ITaskViewModalProps {
    board: Board,
    task: Task,
    updateTask: (arg1: Task) => Promise<Task>,
    updateTaskAndAttachments: (arg1: Task, arg2: TaskDTO) => Promise<Task>,
    updateColumn: (arg1: Column) => Promise<Column>,
    deleteTask: (arg1: Task) => Promise<string>,
    deleteComment: (arg1: Comment) => Promise<string>
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        dialog: {
            '& .MuiDialogContent-root': {
                overflow: 'hidden'
            },
            '& .MuiDialog-paper': {
                minWidth: 1000,
                height: '85vh',

                '&.MuiDialog-paperFullScreen': {
                    height: '100vh'
                }
            },

            '&.sm, &.md': {
                '& .MuiDialogContent-root': {
                    padding: 0
                },
                '& .MuiDialog-paper': {
                    minWidth: 0,
                    width: '100%',
                    maxWidth: '100%'
                }
            }
        },
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            marginBottom: 10,
            overflow: 'hidden'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 20,
            
            '& p': {
                flexGrow: 1
            },

            '&.sm, &.md': {
                padding: '20px 20px 0 20px'
            }
        },
        code: {
            color: 'gray'
        },
        close: {
            color: 'darkgray',
            cursor: 'pointer',
            marginLeft: 10
        },
        windowToggle: {
            color: 'darkgray',
            cursor: 'pointer',
            
            '&.fullScreen': {
                transform: 'rotate(180deg)'
            }
        },
        content: {
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex',

            '&.sm, &.md': {
                flexWrap: 'wrap',
                paddingBottom: 20,
                overflowX: 'hidden',
                overflowY: 'auto',
            }
        },
        main: {
            flexGrow: 1,
            borderRight: '1px solid #ccc',
            padding: "5px 20px 5px 0",
            overflowX: 'hidden',
            overflowY: 'auto',

            '&.sm, &.md': {
                width: '100%',
                flexGrow: 0,
                border: 'none',
                padding: '5px 20px'
            }
        },
        title: {
            display: 'flex',
            marginBottom: 20,

            '& p': {
                flexGrow: 1,
                fontSize: '2em',
                fontWeight: 500,
                color: 'rgb(23, 43, 77)'
            },
            '& button': {
                flexShrink: 0,
                width: 27,
                height: 27
            },
            '& svg': {
                cursor: 'pointer',
                color: '#ccc',
                width: 20,
                height: 20
            }
        },
        description: {
            fontWeight: 500,
            color: 'rgb(23, 43, 77)'
        },
        side: {
            minWidth: '30%',
            maxWidth: '30%',
            width: '30%',
            padding: '5px 0 5px 20px',
            display: 'flex',
            flexDirection: 'column',

            '&.fullScreen': {
                minWidth: '25%',
                maxWidth: '25%',
                width: '25%'
            },

            '&.sm, &.md': {
                minWidth: '100%',
                maxWidth: '100%',
                width: '100%',
                padding: '0 20px'
            }
        },
        row: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 10,

            '& > p': {
                fontSize: 14,
                minWidth: 70,
                maxWidth: 70
            }
        },
        reporter: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            overflow: 'hidden',
            paddingLeft: 10,

            '& p': {
                flexGrow: 1,
                fontSize: 14,
                fontWeight: 300,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                marginLeft: 10
            }
        },
        date: {
            borderTop: "3px solid #eee",
            marginTop: 10,
            paddingTop: 15,
            flexGrow: 1,
            
            '& p': {
                fontSize: 12,
                fontWeight: 300,
                marginBottom: 5,
                color: 'rgba(0,0,0,0.3)'//'rgb(107, 119, 140)'
            }
        },
        sideFooter: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        deleteButton: {
            width: '100%',
            color: '#ccc'
        }
    })
);

const TaskViewModal: React.FC<ITaskViewModalProps & RouteComponentProps> = props => {
    const classes = useStyles();

    const mainElemRef = React.useRef(null);
    const errorContext = React.useContext(ErrorContext);
    const appContext = React.useContext(AppContext);

    const [task, setTask] = useState<Task>();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [fullScreen, setFullScreen] = useState(appContext.screenSize === SCREEN_SIZE.sm);
    const [_creator, setCreator] = useState<User>();

    useEffect(() => {
        if (!props.task) return;
        
        setLoading(false);
        setTask(props.task);
    }, [ props.task ]);

    const account: User = useSelector((state: any) => state.app.account);
    const columns: Column[] = useSelector((state: any) => state.column.columns);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);
    const creator: User = useSelector((state: any) =>
        state.user.users.find((u: User) => u.id === props.task?.creatorID));

    useEffect(() => {
        if (!creator) return;

        setCreator(creator);
    }, [ creator ]);

    const handleClose = () => {
        props.history.push("/workplace/" + props.board.code);
    }

    const handleColumnChange = (column: Column) => {
        if (!task) return;

        const sourceColumn = columns.find(c => c.id === task.columnID);

        if (!sourceColumn) return;

        const updatedTask: Task = {
            ...task,
            columnID: column.id,
            updated: (new Date()).toISOString()
        }

        const updatedSourceColumn: Column = { ...sourceColumn};
        const sNewTaskIDs = [...(updatedSourceColumn.taskIDs || [])];
        const ind = sNewTaskIDs.findIndex(tID => tID === task.id);
        sNewTaskIDs.splice(ind, 1); // remove task from the source column
        updatedSourceColumn.taskIDs = [...sNewTaskIDs];

        const updatedTargetColumn: Column = {
            ...column,
            taskIDs: [
                ...(column.taskIDs || []),
                task.id // append task to the target column
            ]
        };

        Promise.all([
            props.updateTask(updatedTask).then(newTask => setTask({...newTask})),
            props.updateColumn(updatedSourceColumn),
            props.updateColumn(updatedTargetColumn)
        ])
        .then(responses => { })
        .catch(error => {
            errorContext.setError(error);
        });
    };

    const handleAsigneeChange = (asignee: User) => {
        if (!task) return;
        
        const updatedTask: Task = {
            ...task,
            asigneeID: asignee.id,
            updated: (new Date()).toISOString()
        }

        props.updateTask(updatedTask)
        .then(newTask => setTask({...newTask}))
        .catch(error => {
            errorContext.setError(error);
        });
    };

    const handleDelete = () => {
        const c = window.confirm("Delete task?");

        if (!c) return;

        const board: any = {...props.board};
        const column = columns.find(c => c.id === props.task?.columnID);

        if (!column) return;

        if (loading) return;
        setLoading(true);

        const taskIDs = [...(column.taskIDs || [])];
        const ind = taskIDs.findIndex(tID => tID === props.task?.id);
        taskIDs.splice(ind, 1); // remove task from the source column
        column.taskIDs = [...taskIDs];

        const promises: any = [];
        comments.filter(c => c.taskID === props.task?.id)
        .forEach(comment => promises.push(props.deleteComment(comment)));

        promises.push(props.updateColumn({...column}));
        promises.push(props.deleteTask(props.task));
            
        Promise.all(promises)
        .then(() => {
            props.history.replace("/workplace/" + board.code);
        })
        .catch(error => {
            errorContext.setError(error);
        });
    };

    const handleUpdateTask = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        const dto: TaskDTO = {
            ...props.task,
            ...data
        };

        return [
            props.task
            ? props.updateTaskAndAttachments({...props.task, updated: (new Date()).toISOString()}, dto)
            : Promise.reject(),
            response => {
                setEditMode(false)
            },
            error => {
                errorContext.setError(error);
            }
        ];
    };

    const handleLabelsUpdate = (labels: string[]) => {
        if (!task) return;
        
        const updatedTask: Task = {
            ...task,
            labels: [...labels],
            updated: (new Date()).toISOString()
        }

        setTask({...updatedTask});

        props.updateTask(updatedTask)
        .then(newTask => {})
        .catch(error => {
            errorContext.setError(error);
        });
    };

    return (
        <React.Fragment>
            <TaskFormModal
                open={editMode}
                task={props.task}
                handleSubmit={handleUpdateTask}
                handleCancel={() => {
                    setEditMode(false)
                }}
            />

            <Dialog
                open={Boolean(props.task)}
                className={[classes.dialog, appContext.screenSize].join(' ')}
                onClose={handleClose}
                fullScreen={fullScreen}
            >
                <DialogContent>
                    <Paper elevation={0} className={classes.root}>
                        <div className={[classes.header, appContext.screenSize].join(' ')}>
                            <Typography className={classes.code}>{props.board.name} / {task?.code}</Typography>
                            {
                                appContext.screenSize === SCREEN_SIZE.lg
                                ? <Tooltip title={fullScreen ? "Exit full screen" : "Full screen"}>
                                    <OpenInNewIcon
                                        className={[classes.windowToggle, fullScreen ? 'fullScreen' : ''].join(' ')}
                                        onClick={() => setFullScreen(!fullScreen)}
                                    />
                                </Tooltip>
                                : null
                            }
                            <CloseIcon className={classes.close} onClick={handleClose}/>
                        </div>
                        <div className={[classes.content, appContext.screenSize].join(' ')}>
                            <div className={[classes.main, appContext.screenSize].join(' ')} ref={mainElemRef}>
                                {
                                    appContext.screenSize !== SCREEN_SIZE.lg && task 
                                    ? <ColumnSelector
                                        task={task}
                                        board={props.board}
                                        handleChange={handleColumnChange}
                                        screenSize={appContext.screenSize}
                                    />
                                    : null
                                }
                                <div className={classes.title}>
                                    <Typography>{task?.title}</Typography>
                                    {
                                        account.role === UserRole.ADMIN || account.role === UserRole.COADMIN
                                        ? <IconButton onClick={() => setEditMode(true)}>
                                            <EditIcon />
                                        </IconButton>
                                        : null
                                    }
                                </div>
                                {
                                    task?.description
                                    ? <Typography className={classes.description}>Description</Typography>
                                    : null
                                }
                                {
                                    task?.description
                                    ? <div dangerouslySetInnerHTML={{__html: (task?.description || "")}} />
                                    : null
                                }
                                {
                                    task?.attachments
                                    ? <Attachments attachments={task.attachments} />
                                    : null
                                }
                                {
                                    appContext.screenSize !== SCREEN_SIZE.lg
                                    ? <React.Fragment>
                                        <div className={classes.row}>
                                            <Typography>Labels</Typography>
                                            {
                                                task
                                                ? <LabelSelector
                                                    task={task}
                                                    fullScreen={fullScreen}
                                                    handleChange={handleLabelsUpdate}
                                                />
                                                : null
                                            }
                                        </div>
                                        
                                        <div className={classes.row}>
                                            <Typography>Assignee</Typography>
                                            {
                                                task
                                                ? <AsigneeSelector
                                                    task={task}
                                                    handleChange={handleAsigneeChange}
                                                    fullScreen={fullScreen}
                                                />
                                                : null
                                            }
                                        </div>
                                            
                                        <div className={classes.row}>
                                            <Typography>Reporter</Typography>
                                            {
                                                _creator
                                                ? <div className={classes.reporter}>
                                                    <Avatar
                                                        size={30}
                                                        account={_creator}
                                                    />
                                                    <Typography>{_creator.displayName}</Typography>
                                                </div>
                                                : null
                                            }
                                        </div>
                                    </React.Fragment>
                                    : null
                                }
                                <Comments
                                    task={props.task}
                                    addCommentCallback={() => {
                                        const div: any = mainElemRef.current;

                                        if (!div) return;
                                        div.scrollTop = 0;
                                    }}
                                />
                            </div>
                            <div className={[classes.side, fullScreen ? "fullScreen" : "", appContext.screenSize].join(' ')}>
                                {
                                    appContext.screenSize === SCREEN_SIZE.lg
                                    ? <React.Fragment>
                                        {
                                            task 
                                            ? <ColumnSelector
                                                task={task}
                                                board={props.board}
                                                handleChange={handleColumnChange}
                                            />
                                            : null
                                        }

                                        <div className={classes.row}>
                                            <Typography>Labels</Typography>
                                            {
                                                task
                                                ? <LabelSelector
                                                    task={task}
                                                    fullScreen={fullScreen}
                                                    handleChange={handleLabelsUpdate}
                                                />
                                                : null
                                            }
                                        </div>
                                        
                                        <div className={classes.row}>
                                            <Typography>Assignee</Typography>
                                            {
                                                task
                                                ? <AsigneeSelector
                                                    task={task}
                                                    handleChange={handleAsigneeChange}
                                                    fullScreen={fullScreen}
                                                />
                                                : null
                                            }
                                        </div>
                                            
                                        <div className={classes.row}>
                                            <Typography>Reporter</Typography>
                                            {
                                                _creator
                                                ? <div className={classes.reporter}>
                                                    <Avatar
                                                        size={30}
                                                        account={_creator}
                                                    />
                                                    <Typography>{_creator.displayName}</Typography>
                                                </div>
                                                : null
                                            }
                                        </div>
                                    </React.Fragment>
                                    : null
                                }

                                <div className={classes.date}>
                                    <Typography>Created&nbsp;
                                        {
                                            props.task?.created
                                            ? formatDistance(new Date(props.task.created), new Date(), { addSuffix: true })
                                            : null
                                        }
                                    </Typography>
                                    <Typography>Updated&nbsp;
                                        {
                                            props.task?.updated
                                            ? formatDistance(new Date(props.task.updated), new Date(), { addSuffix: true })
                                            : null
                                        }
                                    </Typography>
                                </div>
                                {
                                    account.role === UserRole.ADMIN || account.role === UserRole.COADMIN
                                    ? <div className={classes.sideFooter}>
                                        {
                                            loading
                                            ? <CircularProgress size={25} style={{color: "#ccc"}} />
                                            : <Button onClick={handleDelete} className={classes.deleteButton}>
                                                DELETE
                                            </Button>
                                        }
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    </Paper>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateTask: (task: Task) => dispatch(actions.updateTask(task)),
        updateTaskAndAttachments: (task: Task, dto: TaskDTO) => dispatch(actions.updateTaskAndAttachments(task, dto)),
        deleteTask: (task: Task) => dispatch(actions.deleteTask(task)),
        updateColumn: (column: Column) => dispatch(actions.updateColumn(column)),
        deleteComment: (comment: Comment) => dispatch(actions.deleteComment(comment))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(TaskViewModal));

