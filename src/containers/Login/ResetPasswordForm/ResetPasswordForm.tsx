import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { emailRegExp } from '../../../constants';

interface IFormInputs {
    email: string
}

interface IResetPasswordFormProps {
    handleSubmit: (arg1: IFormInputs) => void,
    loading?: boolean
}

const ResetPasswordForm: React.FC<IResetPasswordFormProps> = props => {
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
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                >
                    { props.loading ? <CircularProgress color="inherit" size={22} /> : 'Reset password' }
                </Button>
        </form>
    )
};

export default ResetPasswordForm;