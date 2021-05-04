import React from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../../../widgets/FormModal';

import Label from '../../../../../models/types/Label';

interface IFormInputs {
    name: string,
    color: string
};

interface ILabelFormModalProps {
    open?: boolean,
    handleSubmit: (arg1: any) => [Promise<any>, (arg: any) => void, (arg: any) => void],
    handleCancel: () => void,
    boardID: string,
    labels: Label[]
}

const LabelFormModal: React.FC<ILabelFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const handleFormSubmit = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title="Add new label"
            open={props.open}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <TextField
                label="Name"
                defaultValue=""
                fullWidth
                required
                error={errors.name !== undefined}
                helperText={errors.name ? errors.name.message : ''}
                style={{marginBottom: 20}}
                inputProps={{
                    ...register('name', { 
                        required: 'Required',
                        validate: val => {
                            const clear = (str: string) => str.trim().toLowerCase().replaceAll(" ", "");

                            const label = props.labels.find(l => l.boardID === props.boardID &&
                                clear(l.name) === clear(val));

                            if (label) return "Duplicate label.";

                            return true;
                        }
                    })
                }}
            />
            <TextField
                label="Color"
                type="color"
                fullWidth
                required
                error={errors.color !== undefined}
                helperText={errors.color ? errors.color.message : ''}
                inputProps={{
                    ...register('color', { 
                        required: 'Required'
                    })
                }}
            />
        </FormModal>
    );
};

export default LabelFormModal;