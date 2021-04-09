import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import FormActions from '../../../widgets/FormModal/FormActions';

interface ICodeFormProps {
    code?: string,
    title?: string,
    message?: string,
    handleCodeChange: (arg1: string) => void
    handleCancel: () => void,
    handleSend: () => void,
    loading?: boolean,
    success?: boolean
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 300,
            padding: "20px 0"
        },
        title: {
            fontWeight: 'bold', 
            marginBottom: 15,
            fontSize: 18
        },
        input: {            
            margin: "20px 0",
            '& .MuiInput-input': {
                fontSize: 16
            }
        }
    })
);

const regEx = new RegExp("^[0-9]*$");
const codeLength = 6;

const CodeForm: React.FC<ICodeFormProps> = props => {
    const classes = useStyles();

    return (
        <Paper elevation={0} className={classes.root}>
            <Typography className={classes.title}>{props.title || "Verification"}</Typography>
            <Typography>{props.message || "Please enter the 6 digit code sent to your email."}</Typography>
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
                className={classes.input}
            />

            <FormActions
                loading={props.loading}
                success={props.success}
                handleSend={props.handleSend}
                handleCancel={props.handleCancel}
            />
        </Paper>
    )
};

export default CodeForm;