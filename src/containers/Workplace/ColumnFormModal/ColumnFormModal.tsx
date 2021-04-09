import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../widgets/FormModal';

import { nameRegExp } from '../../../constants';

interface IFormInputs {
    name: string
};

interface IBoardInvitationFormModalProps {
    open?: boolean,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const ColumnFormModal: React.FC<IBoardInvitationFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title="Add column"
            open={props.open}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <TextField
                label="Name"
                fullWidth
                required
                error={errors.name !== undefined}
                helperText={errors.name ? errors.name.message : ''}
                inputProps={{
                    ...register('name', { 
                        required: 'Required', 
                        pattern: {
                            value: nameRegExp,
                            message: 'Invalid name format'
                        }
                    })
                }}
            />
        </FormModal>
    );
};

export default ColumnFormModal;