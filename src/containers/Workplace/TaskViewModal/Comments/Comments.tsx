import React, { useState } from 'react';
import _ from 'lodash';

import { connect, useSelector } from 'react-redux'; 

import { makeStyles, createStyles,Theme, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import TextEditor, { ITextEditorValue } from '../../../../components/TextEditor/TextEditor';
import CommentComp from './Comment';

import CommentDTO from '../../../../models/dto/CommentDTO';
import Comment from '../../../../models/types/Comment';
import Task from '../../../../models/types/Task'
import User from '../../../../models/types/User';

import * as actions from '../../../../store/actions';

import AppContext from '../../../../context/appContext';
import ErrorContext from '../../../../context/errorContext';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            marginTop: 20
        },
        comments: {
            fontWeight: 500,
            marginBottom: 20,
            color: 'rgb(23, 43, 77)'
        },
        newComment: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',

            '& > div:first-of-type': {
                marginBottom: 10
            },
            '& button': {
                color: '#ccc'
            },
            '& svg': {
                color: '#ccc'
            }
        }
    })
);

interface ICommentsProps {
    task?: Task,
    addCommentCallback: () => void,
    createComment: (arg1: CommentDTO) => Promise<Comment>
}

const Comments: React.FC<ICommentsProps> = props => {
    const classes = useStyles();
    const [textEditorValue, setTextEditorValue] = useState<ITextEditorValue | null>();
    const [loading, setLoading] = useState(false);

    const appContext = React.useContext(AppContext);
    const errorContext = React.useContext(ErrorContext);

    const account: User = useSelector((state: any) => state.app.account);
    const comments: Comment[] = useSelector((state: any) => 
        state.comment.comments.filter((c: Comment) => c.taskID === props.task?.id));

    const handleAddComment = () => {
        if (!textEditorValue) return;
        if (!textEditorValue.content && (!textEditorValue.attachments || textEditorValue.attachments.length < 1)) return;

        if (!props.task) return;

        if (loading) return;
        setLoading(true);

        const dto: CommentDTO = {
            content: textEditorValue?.content,
            attachments: textEditorValue?.attachments || [],
            taskID: props.task?.id,
            accountID: props.task?.accountID,
            userID: account.id,
            date: (new Date()).toISOString()
        }

        props.createComment(dto)
        .then(comment => {
            setTextEditorValue(null);
            appContext.sendNotification(comment);

            props.addCommentCallback();
        })
        .catch(error => {
            console.log(error);
            errorContext.setError(error);
        })
        .finally(() => setLoading(false));
    };

    return (
        <div className={classes.root}>
            {
                comments.length > 0
                ? <Typography className={classes.comments}>Comments ({comments.length})</Typography>
                : null
            }
            {
                _.orderBy(comments, ["date"], ["desc"]).map(c => <CommentComp key={"comment" + c.id} comment={c} />)
            }
            <div className={classes.newComment}>
                <TextEditor
                    title="Comment"
                    value={textEditorValue}
                    handleChange={(data: ITextEditorValue) => {
                        setTextEditorValue(data);
                    }}
                />
                {
                    loading
                    ? <CircularProgress size={34} />
                    : <Button onClick={handleAddComment}>Add comment</Button>
                }
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        createComment: (dto: CommentDTO) => dispatch(actions.createComment(dto))
    }
};

export default connect(null, mapDispatchToProps)(Comments);