import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../widgets/FormModal';

import { nameRegExp } from '../../../constants';

import Column from '../../../models/types/Column';

interface IFormInputs {
    name: string
};

interface IColumnFormModalProps {
    open?: boolean,
    column?: Column | null,
    handleSubmit: (arg1: any) => [Promise<any>, (arg: any) => void, (arg: any) => void],
    handleCancel: () => void
}

const ColumnFormModal: React.FC<IColumnFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const handleFormSubmit = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title={props.column ? "Update column" : "Add column"}
            open={props.open}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <TextField
                label="Name"
                defaultValue={props.column?.name || ""}
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