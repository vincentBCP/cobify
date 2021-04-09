import React from 'react';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import FormActions from './FormActions';

interface IFormModalProps {
    open?: boolean,
    title: string,
    loading?: boolean,
    success?: boolean,
    handleCancel: () => void
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: 300,
            padding: "10px 0"
        },
        title: {
            fontWeight: 'bold', 
            marginBottom: 25,
            fontSize: 18
        },
        actions: {
            marginTop: 30
        }
    })
);

const FormModal: React.FC<IFormModalProps> = props => {
    const classes = useStyles();

    return (
        <Dialog open={props.open || false}>
            <DialogContent>
                <Paper elevation={0} className={classes.root}>
                    <Typography className={classes.title}>{props.title || "Form"}</Typography>
                    {props.children}
                    <FormActions
                        loading={props.loading}
                        success={props.success}
                        handleCancel={props.handleCancel}
                    />
                </Paper>
            </DialogContent>
        </Dialog>
    );
};

export default FormModal;