import React, { useState, useEffect } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

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

interface ITaskViewModalProps {
    board?: Board,
    task?: Task
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        dialog: {
            '& .MuiDialog-paper': {
                maxWidth: 1000
            }
        },
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: 900,
            maxheight: '70vh',
            marginBottom: 10,
        },
        label: {
            fontSize: 12,
            marginBottom: 2,
            color: "#ccc"
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
            //border: '1px solid red',
            display: 'flex'
        },
        main: {
            //border: '1px solid blue',
            flexGrow: 1,
            borderRight: '1px solid #ccc',
            padding: "5px 20px 5px 0"
        },
        title: {
            fontSize: '1.5em',
            fontWeight: 'bold',
            marginBottom: 20
        },
        description: {
            fontWeight: 'bold',
            fontSize: 14
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
            //border: '1px solid green',
            width: '25%',
            padding: '0 0 0 20px',
            display: 'flex',
            flexDirection: 'column'
        },
        reporter: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',

            '& p': {
                flexGrow: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                marginLeft: 10
            }
        },
    })
);

const TaskViewModal: React.FC<ITaskViewModalProps & RouteComponentProps> = props => {
    const classes = useStyles();
    const [task, setTask] = useState<Task>();

    useEffect(() => {
        if (!props.task) return;
        setTask(props.task);
    }, [ props.task ]);

    const handleClose = () => {
        props.history.push("/workplace/" + props.board?.code);
    }

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
                                ? <Typography className={classes.description}>Description:</Typography>
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
                                ? <ColumnSelector task={task} board={props.board} />
                                : <span>ha?</span>
                            }

                            <Typography className={classes.label}>Assignee</Typography>
                            {
                                task
                                ? <AsigneeSelector task={task} />
                                : null
                            }
                            
                            <Typography className={classes.label}>Reporter</Typography>
                            <div className={classes.reporter}>
                                <Avatar
                                    color="#ccc"
                                    initials="U"
                                    size={25}
                                />
                                <Typography>Lorem ipsum dolor sit amet consectutar</Typography>
                            </div>
                        </div>
                    </div>
                </Paper>
            </DialogContent>
        </Dialog>
    )
};

export default withRouter(TaskViewModal);

