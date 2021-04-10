import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../widgets/FormModal';

interface IFormInputs {
    title: string
};

interface ICreateTaskFormModalProps {
    open?: boolean,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const CreateTaskFormModal: React.FC<ICreateTaskFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title="Add task"
            open={props.open}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <TextField
                label="Title"
                fullWidth
                required
                error={errors.title !== undefined}
                helperText={errors.title ? errors.title.message : ''}
                inputProps={{
                    ...register('title', { 
                        required: 'Required'
                    })
                }}
            />
        </FormModal>
    );
};

export default CreateTaskFormModal;