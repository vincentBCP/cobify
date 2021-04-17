import React, { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import TextEditor from '../../../components/TextEditor';
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
    const [textEditorValue, setTextEditorValue] = useState<any | null>();

    useEffect(() => {
        if (!props.open) return;

        setTextEditorValue(null);
    }, [ props.open ]);

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit({
            ...data,
            description: textEditorValue?.text || "",
            attachments: textEditorValue?.attachments || []
        });
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
            <div style={{width: 650}}>
                <TextField
                    label="Title"
                    fullWidth
                    required
                    multiline
                    error={errors.title !== undefined}
                    helperText={errors.title ? errors.title.message : ''}
                    inputProps={{
                        ...register('title', { 
                            required: 'Required'
                        })
                    }}
                    style={{marginBottom: 20}}
                />

                <TextEditor
                    title="Description"
                    handleChange={(data: any) => {
                        setTextEditorValue(data);
                    }}
                />
            </div>
        </FormModal>
    );
};

export default CreateTaskFormModal;