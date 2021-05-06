import React,  { useState,  useEffect } from 'react';

import { UseFormHandleSubmit, UseFormReset } from 'react-hook-form';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FormActions from './FormActions';

import { SUCCESS_DELAY } from './FormActions/SendButton/SendButton';

interface IFormModalProps {
    open?: boolean,
    title: string,
    reset: UseFormReset<any>,
    fullScreen?: boolean,
    useFormHandleSubmit: UseFormHandleSubmit<any>,
    handleSubmit: (arg1: any) => [Promise<any>, (arg: any) => void, (arg: any) => void]
    handleCancel: () => void,
    sendLabel?: string
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        dialog: {
            '& .MuiDialog-paper': {
                maxWidth: 1000,
                maxHeight: '85vh',

                '&.MuiDialog-paperFullScreen': {
                    maxHeight: '100vh'
                }
            }
        },
        root: {
            minWidth: 300,
            padding: "10px 0"
        },
        title: {
            fontWeight: 'bold', 
            marginBottom: 20,
            fontSize: 18
        },
        actions: {
            marginTop: 20
        }
    })
);

const FormModal: React.FC<IFormModalProps> = props => {
    const { reset } = props;
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!props.open) return;

        reset();
        setLoading(false);
        setSuccess(false);
    }, [ props.open, reset ]);

    const handleSubmit = (data: any) => {
        const [request, successCallback, failCallback] = props.handleSubmit(data);

        if (loading) return;
        setLoading(true);

        request
        .then(response => {
            setSuccess(true);
            setLoading(false);

            setTimeout(() => {
                successCallback(response);
            }, SUCCESS_DELAY);
        })
        .catch(error => {
            failCallback(error);
            setLoading(false);
        });
    };

    return (
        <Dialog
            open={props.open || false}
            className={classes.dialog}
            fullScreen={Boolean(props.fullScreen)}
        >
            <DialogContent>
                <Paper elevation={0} className={classes.root}>
                    <Typography className={classes.title}>{props.title || "Form"}</Typography>
                    
                    <form onSubmit={props.useFormHandleSubmit(handleSubmit)}>
                        {props.children}
                        <div className={classes.actions}>
                            <FormActions
                                loading={loading}
                                success={success}
                                handleCancel={props.handleCancel}
                                sendLabel={props.sendLabel}
                            />
                        </div>
                    </form>
                </Paper>
            </DialogContent>
        </Dialog>
    );
};

export default FormModal;