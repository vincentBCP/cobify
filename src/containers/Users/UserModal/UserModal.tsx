import React, { useState } from 'react';

import { makeStyles, createStyles,Theme, Typography, TextField, Button, useTheme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import User from '../../../models/types/User';
import UserRole from '../../../models/enums/UserRole';

import SendButton from '../../../widgets/FormModal/FormActions/SendButton';

interface IUserModalProps {
    user: User,
    handleClose: () => void,
    handleUserUpdate: (arg1: any) => [Promise<any>, (arg: any) => void, (arg: any) => void],
    handleAddBoard: () => void,
    fullScreen?: boolean,
    renderBoards: (arg1: User) => any
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
            '& input, & .MuiSelect-root': {
                padding: 10
            }
        }
    })
);

const UserModal: React.FC<IUserModalProps> = props => {
    const [role, setRole] = useState(props.user.role);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const theme = useTheme();

    const handleSave = () => {
        if (!Boolean(role)) return;
        if (role === props.user.role) return;

        if (loading) return;
        setLoading(true);

        const data: any = {
            role: role
        }

        const [request, successCallback, failCallback] = props.handleUserUpdate(data);

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

    const contrastColor = theme.palette.getContrastText(props.user.color);

    return (
        <Dialog
            open={Boolean(props.user)}
            className={[classes.dialog, Boolean(props.fullScreen) ? "" : "md"].join(' ')}
            onClose={props.handleClose}
            fullScreen={Boolean(props.fullScreen)}
        >
            <DialogContent>
                <Paper className={classes.root}>
                    <div className={classes.header} style={{backgroundColor: props.user.color}}>
                        <Typography style={{color: contrastColor}}>{props.user.displayName}</Typography>
                        <CloseIcon style={{color: contrastColor}} onClick={props.handleClose} />
                    </div>
                    <div className={classes.content}>
                        <div className={classes.row}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                defaultValue={props.user.displayName}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                defaultValue={props.user.email}
                                disabled
                                fullWidth
                            />
                        </div>
                        <div className={classes.row}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    label="Role"
                                    value={role}
                                    onChange={(ev: React.ChangeEvent<{ value: unknown }>) =>
                                        setRole(ev.target.value as string)
                                    }
                                >
                                    <MenuItem value={UserRole.COADMIN}>Co-admin</MenuItem>
                                    <MenuItem value={UserRole.GUEST}>Guest</MenuItem>
                                </Select>
                            </FormControl>
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
                            <label>Boards</label>
                            {props.renderBoards(props.user)}
                        </div>
                        <div className={classes.row}>
                            <Button
                                variant="outlined"
                                onClick={props.handleAddBoard}
                            >Add board</Button>
                        </div>
                    </div>
                </Paper>
            </DialogContent>
        </Dialog>
    )
};

export default UserModal;