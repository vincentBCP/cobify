import React from 'react';

import { useForm } from 'react-hook-form';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import { emailRegExp, nameRegExp } from '../../../constants';

import Guest from '../../../models/types/Guest';

interface IFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    boardID: string
};

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        input: {
            marginBottom: 20
        }
    })
);

interface IForm1Props {
    guests: Guest[],
    actions: JSX.Element,
    handleSubmit: (data: any) => void
}

const Form1: React.FC<IForm1Props> = props => {
    const classes = useStyles();

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();

    return (
        <form onSubmit={handleSubmit(props.handleSubmit)}>
            <TextField
                label="First name"
                fullWidth
                required
                error={errors.firstName !== undefined}
                helperText={errors.firstName ? errors.firstName.message : ''}
                className={classes.input}
                inputProps={{
                    ...register('firstName', { 
                        required: 'Required', 
                        pattern: {
                            value: nameRegExp,
                            message: 'Invalid name format'
                        }
                    })
                }}
            />

            <TextField
                label="Last name"
                fullWidth
                required
                error={errors.lastName !== undefined}
                helperText={errors.lastName ? errors.lastName.message : ''}
                className={classes.input}
                inputProps={{
                    ...register('lastName', { 
                        required: 'Required', 
                        pattern: {
                            value: nameRegExp,
                            message: 'Invalid name format'
                        }
                    })
                }}
            />

            <TextField
                label="Email"
                fullWidth
                required
                error={errors.email !== undefined}
                helperText={errors.email ? errors.email.message : ''}
                className={classes.input}
                inputProps={{
                    ...register('email', { 
                        required: 'Required', 
                        pattern: {
                            value: emailRegExp,
                            message: 'Invalid email format'
                        },
                        validate: value => {
                            const guest = props.guests.find(g => g.email === value);
                            
                            return !guest ? true : 'Guest already exists';
                        }
                    })
                }}
            />

            { props.actions }
        </form>
    );
};

export default Form1;