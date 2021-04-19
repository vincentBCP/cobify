import React, { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import TextEditor, { ITextEditorValue } from '../../../components/TextEditor/TextEditor';
import FormModal from '../../../widgets/FormModal';

import Task from '../../../models/types/Task';

interface IFormInputs {
    title: string
};

interface ITaskFormModalProps {
    open?: boolean,
    task?: Task,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const TaskFormModal: React.FC<ITaskFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();
    const [textEditorValue, setTextEditorValue] = useState<ITextEditorValue | null>();

    useEffect(() => {
        if (!props.open) return;

        if (!props.task) {
            setTextEditorValue(null);
            return;
        }
        
        setTextEditorValue({
            content: props.task?.description || "",
            attachments: props.task.attachments || []
        });
    }, [ props.open, props.task ]);

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        const obj = {
            ...data,
            description: textEditorValue?.content || "",
            attachments: textEditorValue?.attachments || []
        };

        return props.handleSubmit({...obj});
    }

    return (
        <FormModal
            title={props.task ? "Update task" : "Add task"}
            open={props.open}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <div style={{width: 650}}>
                <TextField
                    label="Title"
                    defaultValue={props.task?.title || ""}
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
                    value={props.task ? textEditorValue : null}
                    handleChange={(data: ITextEditorValue) => {
                        setTextEditorValue(data);
                    }}
                />
            </div>
        </FormModal>
    );
};

export default TaskFormModal;