import React from 'react';

import { useForm } from 'react-hook-form';

import { useSelector } from 'react-redux';

import TextField from '@material-ui/core/TextField';

import FormModal from '../../../widgets/FormModal';

import Board from '../../../models/types/Board';

import { nameRegExp } from '../../../constants';

interface IFormInputs {
    name: string,
    code: string
};

interface IBoardFormModalModalProps {
    open?: boolean,
    board: Board | null,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const BoardFormModal: React.FC<IBoardFormModalModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const boards: Board[] = useSelector((state: any) => state.board.boards);

    const handleFormSubmit = (data: IFormInputs): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit(data);
    }

    return (
        <FormModal
            title={props.board ? "Update board" : "Add board"}
            open={Boolean(props.open)}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <TextField
                label="Name"
                defaultValue={props.board ? props.board.name : ""}
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

            {
                !props.board
                ? <TextField
                    label="Code"
                    defaultValue={""}
                    fullWidth
                    required
                    error={errors.code !== undefined}
                    helperText={errors.code ? errors.code.message : ''}
                    inputProps={{
                        ...register('code', { 
                            required: 'Required', 
                            pattern: {
                                value: nameRegExp,
                                message: 'Invalid code format'
                            },
                            maxLength: {
                                value: 2,
                                message: "Code must be up to two(2) characters only."
                            },
                            validate: code => {
                                const board = boards.find(b => b.code === code);

                                if (board) return "Code is already in use.";

                                return true;
                            }
                        })
                    }}
                />
                : null
            }
        </FormModal>
    );
};

export default BoardFormModal;