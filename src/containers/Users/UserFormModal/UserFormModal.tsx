import React from 'react';

import { useForm } from 'react-hook-form';

import { useSelector } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import FormModal from '../../../widgets/FormModal';

import User from '../../../models/types/User';

import { nameRegExp, emailRegExp } from '../../../constants';

import UserRole from '../../../models/enums/UserRole';

interface IFormInputs {
    firstName: string,
    lastName: string,
    email: string,
    role: string
};

interface IUserFormModalProps {
    open?: boolean,
    user: User | null,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const UserFormModal: React.FC<IUserFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const users: User[] = useSelector((state: any) => state.user.users);

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

                {
                    !props.user
                    ? <TextField
                        label="Email"
                        defaultValue={""}
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
                                },
                                validate: (email: string) => {
                                    const user = users.find(u => u.email === email);

                                    if (user) return "Email already in use";

                                    return true;
                                }
                            })
                        }}
                        style={{marginBottom: 20}}
                    />
                    : null
                }

                <FormControl fullWidth>
                    <InputLabel
                        required
                        error={errors.role !== undefined}
                    >
                        Role
                    </InputLabel>
                    <Select
                        defaultValue={props.user ? props.user.role : ""}
                        fullWidth
                        required
                        inputProps={{
                            required: true,
                            ...register('role', { required: true })
                        }}
                    >
                        <MenuItem value={UserRole.COADMIN}>Co-admin</MenuItem>
                        <MenuItem value={UserRole.GUEST}>Guest</MenuItem>
                    </Select>
                    {
                        errors.role !== undefined
                        ? <FormHelperText error={errors.role !== undefined}>{errors.role.message}</FormHelperText>
                        : null
                    }
                </FormControl>
            </div>
        </FormModal>
    );
};

export default UserFormModal;