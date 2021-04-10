import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../widgets/FormModal';

import Guest from '../../../models/types/Guest';

import { nameRegExp, emailRegExp } from '../../../constants';

interface IFormInputs {
    firstName: string,
    lastName: string,
    email: string
};

interface IGuestFormModalProps {
    open?: boolean,
    guest: Guest | null,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const GuestFormModal: React.FC<IGuestFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const handleFormSubmit = (data: IFormInputs): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title={props.guest ? "Update guest" : "Add guest"}
            open={Boolean(props.open)}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <TextField
                label="First name"
                defaultValue={props.guest ? props.guest.firstName : ""}
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
                defaultValue={props.guest ? props.guest.lastName : ""}
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
                defaultValue={props.guest ? props.guest.email : ""}
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
        </FormModal>
    );
};

export default GuestFormModal;