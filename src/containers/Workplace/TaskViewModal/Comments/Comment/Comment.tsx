import React, { useState } from 'react';
import { formatDistance } from 'date-fns';

import { connect, useSelector } from 'react-redux'; 

import { makeStyles, createStyles,Theme, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import TextEditor, { ITextEditorValue } from '../../../../../components/TextEditor/TextEditor';
import FormActions from '../../../../../widgets/FormModal/FormActions';

import CommentDTO from '../../../../../models/dto/CommentDTO';
import Comment from '../../../../../models/types/Comment';
import User from '../../../../../models/types/User'

import Attachments from '../../Attachments';
import Avatar from '../../../../../widgets/Avatar';

import * as actions from '../../../../../store/actions';

import ErrorContext from '../../../../../context/errorContext';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            marginBottom: 20,
            display: 'flex'
        },
        main: {
            flexGrow: 1,
            paddingLeft: 20
        },
        header: {
            display: 'flex',
            alignItems: 'center',

            '& > p': {
                flexGrow: 1,
                fontWeight: 'bold',
                color: "rgb(23, 43, 77)"
            },
            '& svg': {
                color: '#ccc',
                width: 20,
                height: 20,
                cursor: 'pointer'
            }
        },
        actions: {
            display: 'flex',
            alignItems: 'center'
        },
        date: {
            color: "#ccc",
            fontSize: "0.9em"
        },
        edit: {
            flexGrow: 1,

            '& > div:first-of-type': {
                marginBottom: 10
            }
        }
    })
);

interface ICommentProps {
    comment: Comment,
    updateComment: (arg1: Comment, arg2: CommentDTO) => Promise<Comment>,
    deleteComment: (arg1: Comment) => Promise<string>
}

const CommentComp: React.FC<ICommentProps> = props => {
    const classes = useStyles();
    const [textEditorValue, setTextEditorValue] = useState<ITextEditorValue | null>();
    const [loading, setLoading] = useState(false);

    const errorContext = React.useContext(ErrorContext);

    const account = useSelector((state: any) => state.app.account);
    const user = useSelector((state: any) => state.user.users.find((u: User) => u.id === props.comment.userID));

    const handleEdit = () => {
        setLoading(false);

        setTextEditorValue({
            content: props.comment.content,
            attachments: props.comment.attachments || []
        });
    }

    const handleSave = () => {
        if (loading) return;
        setLoading(true);

        const dto: CommentDTO = {
            ...(textEditorValue as any),
            taskID: props.comment.taskID,
            userID: props.comment.userID,
            accountID: props.comment.accountID
        }

        props.updateComment({...props.comment}, dto)
        .then(comment => {
            setTextEditorValue(null);
        })
        .catch(error => {
            errorContext.setError(error);
        })
        .finally(() => setLoading(false));
    }

    const handleCancel = () => {
        setTextEditorValue(null);
    }

    const handleDelete = () => {
        if (loading) return;
        setLoading(true);

        props.deleteComment(props.comment)
        .then(() => {})
        .catch(error => {
            errorContext.setError(error);
        })
        .finally(() => setLoading(false));
    }

    const getFormattedDate = () => {
        if (!props.comment.date) return "";
        
        return formatDistance(new Date(props.comment.date), new Date(), { addSuffix: true });
    }

    if (textEditorValue) {
        return (
            <div className={classes.root}>
                <div className={classes.edit}>
                    <TextEditor
                        title="Edit comment"
                        value={textEditorValue}
                        handleChange={(data: any) => {
                            setTextEditorValue(data);
                        }}
                    />
                    <FormActions
                        sendLabel="Save"
                        loading={loading}
                        handleSend={handleSave}
                        handleCancel={handleCancel}
                    />
                </div>
            </div>
        )
    };

    return (
        <div className={classes.root}>
            <Avatar
                size={30}
                account={user}
            />
            <div className={classes.main}>
                <div className={classes.header}>
                    <Typography>{user.displayName}</Typography>
                    {
                        account.id === user.id
                        ? <div className={classes.actions}>
                            <IconButton style={{width: 27, height: 27}} onClick={handleEdit}>
                                <EditIcon />
                            </IconButton>
                            {
                                !loading
                                ? <IconButton style={{width: 27, height: 27}} onClick={handleDelete}>
                                    <DeleteIcon />
                                </IconButton>
                                : <div style={{display: 'flex', alignItems: 'center', marginLeft: 7}}>
                                    <CircularProgress size={20} />
                                </div>
                            }
                        </div>
                        : null
                    }
                </div>
                <Typography className={classes.date}>{getFormattedDate()}</Typography>
                <div dangerouslySetInnerHTML={{__html: (props.comment.content)}} />
                {
                    props.comment.attachments
                    ? <Attachments attachments={props.comment.attachments} />
                    : null
                }
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateComment: (comment: Comment, dto: CommentDTO) => dispatch(actions.updateComment(comment, dto)),
        deleteComment: (comment: Comment) => dispatch(actions.deleteComment(comment))
    }
};

export default connect(null, mapDispatchToProps)(CommentComp);