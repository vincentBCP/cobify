import React, { useState } from 'react';

import { makeStyles, createStyles,Theme, Typography, TextField, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';

import Board from '../../../models/types/Board';

import SendButton from '../../../widgets/FormModal/FormActions/SendButton';

interface IBoardModalProps {
    board: Board,
    handleClose: () => void,
    handleBoardUpdate: (arg1: any) => [Promise<any>, (arg: any) => void, (arg: any) => void],
    handleAddUser: () => void,
    renderUsers: (arg1: Board) => any
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        dialog: {
            '& .MuiDialogContent-root': {
                padding: 0
            },
            '& .MuiDialog-paper': { }
        },
        root: {
            borderRadius: 0,
            height: '100%',
            boxShadow: 'none',
            padding: 20
        },
        header: {
            display: 'flex',
            marginBottom: 20,

            '& p': {
                flexGrow: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        content: {

        },
        row: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 10,

            '&:nth-of-type(5)': {
                marginBottom: 30
            },
            '& p': {
                marginRight: 20,
                minWidth: 65,
                textAlign: 'right'
            },
            '& input': {
                padding: 8
            },
            '& button': {
                marginLeft: 'auto'
            }
        }
    })
);

const BoardModal: React.FC<IBoardModalProps> = props => {
    const [name, setName] = useState(props.board.name);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const handleSave = () => {
        if (!Boolean(name.trim())) return;
        if (name === props.board.name) return;

        if (loading) return;
        setLoading(true);

        const data: any = {
            name: name
        }

        const [request, successCallback, failCallback] = props.handleBoardUpdate(data);

        request
        .then((response: any) => {
            setTimeout(() => {
                setLoading(false);
                successCallback(response);
            }, 1000);
        })
        .catch((error: any) => {
            setTimeout(() => {
                failCallback(error);
                setLoading(false);
            }, 1000);
        });
    }

    return (
        <Dialog
            open={Boolean(props.board)}
            className={classes.dialog}
            onClose={props.handleClose}
            fullScreen={true}
        >
            <DialogContent>
                <Paper className={classes.root}>
                    <div className={classes.header}>
                        <Typography>{props.board.name}</Typography>
                        <CloseIcon onClick={props.handleClose} />
                    </div>
                    <div className={classes.content}>
                        <div className={classes.row}>
                            <Typography>Name</Typography>
                            <TextField
                                variant="outlined"
                                value={name}
                                onChange={(ev: React.ChangeEvent) => setName((ev.target as HTMLInputElement).value)}
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <Typography>Code</Typography>
                            <TextField
                                variant="outlined"
                                defaultValue={props.board.code || ""}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <Typography>Columns</Typography>
                            <TextField
                                variant="outlined"
                                defaultValue={props.board.columnCount || "0"}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <Typography>Tasks</Typography>
                            <TextField
                                variant="outlined"
                                defaultValue={props.board.taskCount || "0"}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <SendButton
                                label="Save"
                                loading={loading}
                                handleClick={handleSave}
                            />
                        </div>
                        <div className={classes.row}>
                            <Typography>Users</Typography>
                            {props.renderUsers(props.board)}
                        </div>
                        <div className={classes.row}>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={props.handleAddUser}
                            >Add user</Button>
                        </div>
                    </div>
                </Paper>
            </DialogContent>
        </Dialog>
    )
};

export default BoardModal