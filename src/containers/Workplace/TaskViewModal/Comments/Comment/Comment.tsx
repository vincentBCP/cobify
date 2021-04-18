import React, { useState } from 'react';

import { connect, useSelector } from 'react-redux'; 

import { makeStyles, createStyles,Theme, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

import TextEditor from '../../../../../components/TextEditor';
import FormActions from '../../../../../widgets/FormModal/FormActions';

import CommentDTO from '../../../../../models/dto/CommentDTO';
import Comment from '../../../../../models/types/Comment';
import Task from '../../../../../models/types/Task';
import User from '../../../../../models/types/User'
import IAttachment from '../../../../../models/interfaces/IAttachment';

import Attachments from '../../Attachments';
import Avatar from '../../../../../widgets/Avatar';

import StorageAPI from '../../../../../api/StorageAPI';

import * as actions from '../../../../../store/actions';

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
    const [textEditorValue, setTextEditorValue] = useState<any | null>();
    const [loading, setLoading] = useState(false);

    const user = useSelector((state: any) => state.user.users.find((u: User) => u.id === props.comment.userID));

    const handleEdit = () => {
        const arrayOfURL: any = [];

        props.comment.attachments?.forEach((attachment: IAttachment) => 
            arrayOfURL.push(StorageAPI.getAttachmentPublicUrl(attachment)));

        setLoading(false);
        setTextEditorValue({
            content: props.comment.content,
            attachments: arrayOfURL
        });
    }

    const handleSave = () => {
        if (loading) return;
        setLoading(true);

        const dto: CommentDTO = {
            ...textEditorValue,
            taskID: props.comment.taskID,
            columnID: props.comment.columnID,
            boardID: props.comment.boardID,
            userID: props.comment.userID,
            accountID: props.comment.accountID
        }

        props.updateComment({...props.comment}, dto)
        .then(comment => {
            setTextEditorValue(null);
        })
        .catch(error => {})
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
        .catch(error => {})
        .finally(() => setLoading(false));
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
                color={user.color}
                initials={user.initials}
                size={30}
            />
            <div className={classes.main}>
                <div className={classes.header}>
                    <Typography>{user.displayName}</Typography>
                    <EditIcon onClick={handleEdit} />
                    {
                        !loading
                        ? <DeleteIcon onClick={handleDelete} />
                        : <CircularProgress size={20} />
                    }
                </div>
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