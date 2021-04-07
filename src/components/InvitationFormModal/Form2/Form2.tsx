import React from 'react';

import { useForm } from 'react-hook-form';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Board from '../../../models/types/Board';

interface IFormInputs {
    boardID: string
};

interface IForm1Props {
    boards: Board[],
    actions: JSX.Element,
    handleSubmit: (data: any) => void
}

const Form2: React.FC<IForm1Props> = props => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();

    return (
        <form onSubmit={handleSubmit(props.handleSubmit)}>
            <FormControl fullWidth style={{marginBottom: 20}}>
                <InputLabel
                    required
                    error={errors.boardID !== undefined}
                >
                    Board
                </InputLabel>
                <Select
                    label="Board"
                    defaultValue=""
                    fullWidth
                    error={errors.boardID !== undefined}
                    inputProps={{
                        required: true,
                        ...register('boardID', { required: true })
                    }}
                >
                    {
                        props.boards
                        .map(board =>
                            <MenuItem key={board.id} value={board.id}>{board.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            { props.actions }
        </form>
    );
};

export default Form2;