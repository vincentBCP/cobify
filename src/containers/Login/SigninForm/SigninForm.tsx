import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { emailRegExp } from '../../../constants';

interface IFormInputs {
    email: string,
    password: string
}

interface ISigninFormProps {
    handleSubmit: (arg1: IFormInputs) => void,
    loading?: boolean
}

const SigninForm: React.FC<ISigninFormProps> = props => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();

    return (
        <form onSubmit={handleSubmit(props.handleSubmit)}>
            <TextField
                fullWidth
                label="Email"
                required
                error={errors.email !== undefined}
                helperText={errors.email ? errors.email.message : ''}
                inputProps={{
                    ...register('email', { 
                        required: 'Required', 
                        pattern: {
                            value: emailRegExp,
                            message: 'Invalid email format'
                        }
                    })
                }}
                style={{
                    marginBottom: 20
                }}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                error={errors.password !== undefined}
                required
                helperText={errors.password ? errors.password.message : ''}
                inputProps={{
                    ...register('password', { 
                        required: 'Required'
                    })
                }}
                style={{
                    marginBottom: 20
                }}
            />
            <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
            >
                { props.loading ? <CircularProgress color="inherit" size={22} /> : 'Log In' }
            </Button>
        </form>
    )
};

export default SigninForm;