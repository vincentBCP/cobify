import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

interface ICodeFormProps {
    code?: string,
    handleCodeChange: (arg1: string) => void
    handleCancel: () => void,
    handleSend: () => void
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 300,
            padding: "20px 0"
        }
    })
);

const regEx = new RegExp("^[0-9]*$");
const codeLength = 6;

const CodeForm: React.FC<ICodeFormProps> = props => {
    const classes = useStyles();

    return (
        <Paper elevation={0} className={classes.root}>
            <Typography>Please enter the 6 digit code sent to your email.</Typography>
            <TextField
                label="Code"
                value={props.code || ''}
                fullWidth
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    const val = ev.target.value;

                    if (!regEx.test(val)) return;
                    if (val.length > codeLength) return;

                    props.handleCodeChange(val);
                }}
                style={{margin: "20px 0"}}
            />

            <Grid container direction="row" justify="flex-end">
                <Button
                    color="default"
                    onClick={props.handleCancel}
                    style={{marginRight: 10}}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={props.handleSend}
                >
                    Send
                </Button>
            </Grid>
        </Paper>
    )
};

export default CodeForm;