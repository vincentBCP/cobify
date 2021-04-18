import React, { useState, useEffect } from 'react';

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
import EditIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';

import Avatar from '../../../widgets/Avatar';

import TaskFormModal from '../TaskFormModal';

import Aux from '../../../hoc/Auxi';

import AsigneeSelector from './AsigneeSelector';
import ColumnSelector from './ColumnSelector';
import Comments from './Comments';
import Attachments from './Attachments';

import Task from '../../../models/types/Task';
import TaskDTO from '../../../models/dto/TaskDTO';
import Board from '../../../models/types/Board';
import Column from '../../../models/types/Column';
import User from '../../../models/types/User';
import Comment from '../../../models/types/Comment';
import UserRole from '../../../models/enums/UserRole';

import StorageAPI from '../../../api/StorageAPI';

import * as actions from '../../../store/actions';

interface ITaskViewModalProps {
    board?: Board,
    task?: Task,
    updateTask: (arg1: Task) => Promise<Task>,
    updateTaskAndAttachments: (arg1: Task, arg2: TaskDTO) => Promise<Task>,
    updateColumn: (arg1: Column) => Promise<Column>,
    deleteTask: (arg1: string) => Promise<string>,
    deleteComment: (arg1: Comment) => Promise<string>
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        dialog: {
            '& .MuiDialog-paper': {
                maxWidth: '100vw'
            }
        },
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: 1000,
            height: '80vh',
            maxHeight: '80vh',
            marginBottom: 10,
            overflow: 'hidden'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
        },
        code: {
            color: 'gray'
        },
        close: {
            color: 'darkgray',
            cursor: 'pointer'
        },
        content: {
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex'
        },
        main: {
            flexGrow: 1,
            borderRight: '1px solid #ccc',
            padding: "5px 20px 5px 0",
            overflowX: 'hidden',
            overflowY: 'auto'
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 20,

            '& p': {
                flexGrow: 1,
                fontSize: '2em',
                fontWeight: 500,
                color: 'rgb(23, 43, 77)'
            },
            '& svg': {
                cursor: 'pointer',
                color: '#ccc'
            }
        },
        description: {
            fontWeight: 500,
            color: 'rgb(23, 43, 77)'
        },
        side: {
            width: '30%',
            padding: '5px 0 5px 20px',
            display: 'flex',
            flexDirection: 'column'
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
    const [task, setTask] = useState<Task>();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

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

    const handleClose = () => {
        props.history.push("/workplace/" + props.board?.code);
    }

    const handleColumnChange = (column: Column) => {
        if (!task) return;

        const sourceColumn = columns.find(c => c.id === task.columnID);

        if (!sourceColumn) return;

        const updatedTask: Task = {
            ...task,
            columnID: column.id
        }

        props.updateTask(updatedTask)
        .then(newTask => setTask({...newTask}));

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
            props.updateColumn(updatedSourceColumn),
            props.updateColumn(updatedTargetColumn)
        ]);
    };

    const handleAsigneeChange = (asignee: User) => {
        if (!task) return;
        
        const updatedTask: Task = {
            ...task,
            asigneeID: asignee.id
        }

        props.updateTask(updatedTask)
        .then(newTask => setTask({...newTask}));
    };

    const handleDelete = () => {
        if (!props.board || !props.task) return;

        const board: any = props.board || {};
        const column = columns.find(c => c.id === props.task?.columnID);

        if (!column) return;

        if (loading) return;
        setLoading(true);

        const taskIDs = [...(column.taskIDs || [])];
        const ind = taskIDs.findIndex(tID => tID === props.task?.id);
        taskIDs.splice(ind, 1); // remove task from the source column
        column.taskIDs = [...taskIDs];

        const promises: any = [
            props.deleteTask(props.task.id),
            props.updateColumn({...column})
        ];

        props.task.attachments?.forEach(a => promises.push(StorageAPI.delete(a)));
        comments.filter(c => c.taskID === props.task?.id)
        .forEach(comment => promises.push(props.deleteComment(comment)));

        Promise.all(promises)
        .then(() => {
            props.history.replace("/workplace/" + board.code);
        })
        .catch(error => console.log(error));
    };

    const handleUpdateTask = (data: any): [Promise<any>, () => void, () => void] => {
        const dto: TaskDTO = {
            ...props.task,
            ...data,
        };

        return [
            props.task ? props.updateTaskAndAttachments({...props.task}, dto) : Promise.reject(),
            () => {
                setEditMode(false)
            },
            () => {}
        ];
    };

    return (
        <Aux>
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
                className={classes.dialog}
                onClose={handleClose}
            >
                <DialogContent>
                    <Paper elevation={0} className={classes.root}>
                        <div className={classes.header}>
                            <Typography className={classes.code}>{props.board?.name} / {task?.code}</Typography>
                            <CloseIcon className={classes.close} onClick={handleClose}/>
                        </div>
                        <div className={classes.content}>
                            <div className={classes.main}>
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
                                <Comments task={props.task} />
                            </div>
                            <div className={classes.side}>
                                {
                                    task && props.board
                                    ? <ColumnSelector
                                        task={task}
                                        board={props.board}
                                        handleChange={handleColumnChange}
                                    />
                                    : <span>ha?</span>
                                }

                                <div className={classes.row}>
                                    <Typography>Assignee</Typography>
                                    {
                                        task
                                        ? <AsigneeSelector
                                            task={task}
                                            handleChange={handleAsigneeChange}
                                        />
                                        : null
                                    }
                                </div>
                                    
                                <div className={classes.row}>
                                    <Typography>Reporter</Typography>
                                    {
                                        creator
                                        ? <div className={classes.reporter}>
                                            <Avatar
                                                color={creator.color}
                                                initials={creator.initials}
                                                size={30}
                                            />
                                            <Typography>{creator.displayName}</Typography>
                                        </div>
                                        : null
                                    }
                                </div>
                                <span style={{flexGrow: 1}}></span>
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
        </Aux>
    )
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateTask: (task: Task) => dispatch(actions.updateTask(task)),
        updateTaskAndAttachments: (task: Task, dto: TaskDTO) => dispatch(actions.updateTaskAndAttachments(task, dto)),
        deleteTask: (id: string) => dispatch(actions.deleteTask(id)),
        updateColumn: (column: Column) => dispatch(actions.updateColumn(column)),
        deleteComment: (comment: Comment) => dispatch(actions.deleteComment(comment))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(TaskViewModal));

