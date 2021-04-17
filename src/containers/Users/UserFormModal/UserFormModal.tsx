import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../widgets/FormModal';

import User from '../../../models/types/User';

import { nameRegExp, emailRegExp } from '../../../constants';

interface IFormInputs {
    firstName: string,
    lastName: string,
    email: string
};

interface IUserFormModalProps {
    open?: boolean,
    user: User | null,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const UserFormModal: React.FC<IUserFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const handleFormSubmit = (data: IFormInputs): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title={props.user ? "Update user" : "Add user"}
            open={Boolean(props.open)}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <div style={{width: "300px"}}>
                <TextField
                    label="First name"
                    defaultValue={props.user ? props.user.firstName : ""}
                    fullWidth
                    required
                    error={errors.firstName !== undefined}
                    helperText={errors.firstName ? errors.firstName.message : ''}
                    inputProps={{
                        ...register('firstName', { 
                            required: 'Required', 
                            pattern: {
                                value: nameRegExp,
                                message: 'Invalid name format'
                            }
                        })
                    }}
                    style={{marginBottom: 20}}
                />

                <TextField
                    label="Last name"
                    defaultValue={props.user ? props.user.lastName : ""}
                    fullWidth
                    required
                    error={errors.lastName !== undefined}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                    inputProps={{
                        ...register('lastName', { 
                            required: 'Required', 
                            pattern: {
                                value: nameRegExp,
                                message: 'Invalid name format'
                            }
                        })
                    }}
                    style={{marginBottom: 20}}
                />

                <TextField
                    label="Email"
                    defaultValue={props.user ? props.user.email : ""}
                    fullWidth
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
                />
            </div>
        </FormModal>
    );
};

export default UserFormModal;