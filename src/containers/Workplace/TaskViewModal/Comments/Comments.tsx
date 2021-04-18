import React, { useState } from 'react';

import { connect, useSelector } from 'react-redux'; 

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import TextEditor from '../../../../components/TextEditor';
import CommentComp from './Comment';

import CommentDTO from '../../../../models/dto/CommentDTO';
import Comment from '../../../../models/types/Comment';
import Task from '../../../../models/types/Task'

import * as actions from '../../../../store/actions';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            marginTop: 20
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
    createComment: (arg1: CommentDTO) => Promise<Comment>
}


const Comments: React.FC<ICommentsProps> = props => {
    const classes = useStyles();
    const [textEditorValue, setTextEditorValue] = useState<any | null>();
    const [loading, setLoading] = useState(false);

    const account = useSelector((state: any) => state.app.account);
    const comments: Comment[] = useSelector((state: any) => 
        state.comment.comments.filter((c: Comment) => c.taskID === props.task?.id));

    const handleAddComment = () => {
        if (!Boolean(textEditorValue?.content)) return;

        if (!props.task) return;

        const dto: CommentDTO = {
            content: textEditorValue.content,
            attachments: textEditorValue.attachments || [],
            taskID: props.task?.id,
            columnID: props.task?.columnID,
            boardID: props.task?.boardID,
            accountID: props.task?.id,
            userID: account.id
        }

        setLoading(true);

        props.createComment(dto)
        .then(comment => {
            setTextEditorValue(null);
        })
        .catch(error => {})
        .finally(() => setLoading(false));
    };

    return (
        <div className={classes.root}>
            {
                comments.map(c => <CommentComp key={"comment" + c.id} comment={c} />)
            }
            <div className={classes.newComment}>
                <TextEditor
                    title="Comment"
                    value={textEditorValue}
                    handleChange={(data: any) => {
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