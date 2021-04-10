import React from 'react';
import randomcolor from 'randomcolor';

import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../widgets/FormModal';

import BoardDTO from '../../../models/dto/BoardDTO';

import { nameRegExp } from '../../../constants';

interface IFormInputs {
    name: string,
    code: string
};

interface ICreateBoardFormModalProps {
    open?: boolean,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const CreateBoardFormModal: React.FC<ICreateBoardFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const user: any = useSelector((state: any) => state.app.user);

    const handleFormSubmit = (data: IFormInputs): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit({
            name: data.name,
            code: data.code,
            color: randomcolor(),
            accountID: user.id
        } as BoardDTO);
    }

    return (
        <FormModal
            title="Add board"
            open={Boolean(props.open)}
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
                style={{marginBottom: 20}}
            />

            <TextField
                label="Code"
                fullWidth
                required
                error={errors.code !== undefined}
                helperText={errors.code ? errors.code.message : ''}
                inputProps={{
                    ...register('code', { 
                        required: 'Required',
                        pattern: {
                            value: /[a-zA-Z]*/,
                            message: 'Invalid code format'
                        },
                        maxLength: {
                            value: 2,
                            message: "Code must be up to two(2) characters only."
                        }
                    })
                }}
            />
        </FormModal>
    );
};

export default CreateBoardFormModal;