import React from 'react';

import { format } from 'date-fns';

import { makeStyles, createStyles,Theme, Typography, TextField, useTheme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';

import User from '../../../models/types/User';

interface IAccountModalProps {
    account: User,
    handleClose: () => void,
    fullScreen?: boolean
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

const AccountModal: React.FC<IAccountModalProps> = props => {
    const classes = useStyles();

    const theme = useTheme();

    const contrastColor = theme.palette.getContrastText(props.account.color);

    return (
        <Dialog
            open={Boolean(props.account)}
            className={[classes.dialog, Boolean(props.fullScreen) ? "" : "md"].join(' ')}
            onClose={props.handleClose}
            fullScreen={Boolean(props.fullScreen)}
        >
            <DialogContent>
                <Paper className={classes.root}>
                    <div className={classes.header} style={{backgroundColor: props.account.color}}>
                        <Typography style={{color: contrastColor}}>{props.account.displayName}</Typography>
                        <CloseIcon style={{color: contrastColor}} onClick={props.handleClose} />
                    </div>
                    <div className={classes.content}>
                        <div className={classes.row}>
                            <TextField
                                label="Name"
                                defaultValue={props.account.displayName || ""}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <TextField
                                label="Email"
                                defaultValue={props.account.email || ""}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <TextField
                                label="Organization"
                                defaultValue={props.account.organization || ""}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <TextField
                                label="Created"
                                defaultValue={format(new Date(props.account.created), "MMM d, yyyy") || ""}
                                disabled
                                fullWidth
                            />
                        </div>
                    </div>
                </Paper>
            </DialogContent>
        </Dialog>
    )
};

export default AccountModal;