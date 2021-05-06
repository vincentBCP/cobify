import React, { useState } from 'react';

import { makeStyles, createStyles,Theme, Typography, TextField, Button, useTheme } from '@material-ui/core';
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
    fullScreen?: boolean,
    renderUsers: (arg1: Board) => any
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        dialog: {
            '& .MuiDialogContent-root': {
                padding: 0
            },
            '&.md .MuiDialog-paper': {
                width: '60%'
            }
        },
        root: {
            borderRadius: 0,
            height: '100%',
            boxShadow: 'none'
        },
        header: {
            display: 'flex',
            marginBottom: 20,
            padding: 20,

            '& p': {
                flexGrow: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        content: {
            padding: 20
        },
        row: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',

            '& > label': {
                width: '100%',
                marginLeft: 3,
                color: 'rgba(0, 0, 0, 0.54)',
                padding: 0,
                fontSize: 11,
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '0.00938em',
                marginBottom: 10
            },
            '& input': {
                '&:disabled': {
                    color: 'black'
                }
            }
        }
    })
);

const BoardModal: React.FC<IBoardModalProps> = props => {
    const [name, setName] = useState(props.board.name);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const theme = useTheme();

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

    const contrastColor = theme.palette.getContrastText(props.board.color);

    return (
        <Dialog
            open={Boolean(props.board)}
            className={[classes.dialog, Boolean(props.fullScreen) ? "" : "md"].join(' ')}
            onClose={props.handleClose}
            fullScreen={Boolean(props.fullScreen)}
        >
            <DialogContent>
                <Paper className={classes.root}>
                    <div className={classes.header} style={{backgroundColor: props.board.color}}>
                        <Typography style={{color: contrastColor}}>{props.board.name}</Typography>
                        <CloseIcon style={{color: contrastColor}} onClick={props.handleClose} />
                    </div>
                    <div className={classes.content}>
                        <div className={classes.row}>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(ev: React.ChangeEvent) => setName((ev.target as HTMLInputElement).value)}
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <TextField
                                label="Code"
                                defaultValue={props.board.code || ""}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <TextField
                                label="Columns"
                                defaultValue={props.board.columnCount || "0"}
                                disabled
                                style={{width: "calc(50% - 5px", marginRight: 10}}
                            />
                            <TextField
                                label="Tasks"
                                defaultValue={props.board.taskCount || "0"}
                                disabled
                                style={{width: "calc(50% - 5px"}}
                            />
                        </div>
                        <div className={classes.row}>
                            <SendButton
                                label="Save"
                                variant="outlined"
                                color="default"
                                loading={loading}
                                handleClick={handleSave}
                            />
                        </div>
                        <div className={classes.row}>
                            <label>Users</label>
                            {props.renderUsers(props.board)}
                        </div>
                        <div className={classes.row}>
                            <Button
                                variant="outlined"
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