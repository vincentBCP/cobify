import React, { useState } from 'react';

import { connect, useSelector } from 'react-redux'; 

import { makeStyles, createStyles,Theme, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/EditOutlined';

import TextEditor from '../../../../../components/TextEditor';

import CommentDTO from '../../../../../models/dto/CommentDTO';
import Comment from '../../../../../models/types/Comment';
import Task from '../../../../../models/types/Task';
import User from '../../../../../models/types/User'

import Attachments from '../../Attachments';
import Avatar from '../../../../../widgets/Avatar';

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
            justifyContent: 'space-between',
            alignItems: 'center',

            '& > p': {
                fontWeight: 'bold',
                color: "rgb(23, 43, 77)"
            },
            '& svg': {
                color: '#ccc',
                width: 20,
                height: 20,
                cursor: 'pointer'
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
                    <EditIcon />
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