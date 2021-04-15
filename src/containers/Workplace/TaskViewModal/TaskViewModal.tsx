import React, { useState, useEffect } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import TextEditor from '../../../components/TextEditor';
import ImagePreview from '../../../widgets/ImagePreview';
import Avatar from '../../../widgets/Avatar';

import AsigneeSelector from './AsigneeSelector';
import ColumnSelector from './ColumnSelector';

import Task from '../../../models/types/Task';
import Board from '../../../models/types/Board';
import Column from '../../../models/types/Column';
import Guest from '../../../models/types/Guest';

import * as actions from '../../../store/actions';

interface ITaskViewModalProps {
    board?: Board,
    task?: Task,
    updateTask: (arg1: Task) => Promise<Task>,
    updateColumn: (arg1: Column) => Promise<Column>
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
            overflow: 'hidden',
            
            '& *': {
                color: 'rgb(23, 43, 77)'
            }
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
            fontSize: '2em',
            fontWeight: 500,
            marginBottom: 20
        },
        description: {
            fontWeight: 500
        },
        attachments: {
            marginTop: 20,
            display: 'flex',
            flexWrap: 'wrap',
            //justifyContent: 'space-between',
        },
        attachment: {
            marginBottom: 10,
            marginRight: 10
        },
        comments: {
            width: '100%',
            marginBottom: 30
        },
        comment:{
            
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
        }
    })
);

const TaskViewModal: React.FC<ITaskViewModalProps & RouteComponentProps> = props => {
    const classes = useStyles();
    const [task, setTask] = useState<Task>();

    useEffect(() => {
        if (!props.task) return;
        setTask(props.task);
    }, [ props.task ]);

    const columns: Column[] = useSelector((state: any) => state.column.columns);

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

    const handleAsigneeChange = (asignee: Guest) => {
        if (!task) return;
        
        const updatedTask: Task = {
            ...task,
            asigneeID: asignee.id
        }

        props.updateTask(updatedTask)
        .then(newTask => setTask({...newTask}));
    };

    return (
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
                            <Typography className={classes.title}>{task?.title}</Typography>
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
                                ? <div className={classes.attachments}>
                                    {
                                        task.attachments.map(attachment =>
                                            <div key={"attachment-" + attachment.name} className={classes.attachment}>
                                                <ImagePreview attachment={attachment} />
                                            </div>)
                                    }
                                </div>
                                : null
                            }
                            <div className={classes.comments}>

                            </div>
                            <div className={classes.comment}>
                                <TextEditor
                                    title="Comment"
                                    handleBlur={(data: any) => {
                                        //setTextEditorValue(data);
                                    }}
                                />
                            </div>
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
                                <div className={classes.reporter}>
                                    <Avatar
                                        color="#ccc"
                                        initials="U"
                                        size={30}
                                    />
                                    <Typography>Kick Butowski</Typography>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </Paper>
            </DialogContent>
        </Dialog>
    )
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateTask: (task: Task) => dispatch(actions.updateTask(task)),
        updateColumn: (column: Column) => dispatch(actions.updateColumn(column))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(TaskViewModal));

