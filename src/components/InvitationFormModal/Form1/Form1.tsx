import React from 'react';

import { useForm } from 'react-hook-form';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Guest from '../../../models/types/Guest';

interface IFormInputs {
    guestID: string
};

interface IForm1Props {
    guests: Guest[],
    actions: JSX.Element,
    handleSubmit: (data: any) => void
}

const Form1: React.FC<IForm1Props> = props => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();

    return (
        <form onSubmit={handleSubmit(props.handleSubmit)}>
            <FormControl fullWidth style={{marginBottom: 20}}>
                <InputLabel
                    required
                    error={errors.guestID !== undefined}
                >
                    Guest
                </InputLabel>
                <Select
                    label="Guest"
                    defaultValue=""
                    fullWidth
                    error={errors.guestID !== undefined}
                    inputProps={{
                        required: true,
                        ...register('guestID', { required: true })
                    }}
                >
                    {
                        props.guests
                        .map(guest =>
                            <MenuItem key={guest.id} value={guest.id}>{guest.firstName + " " + guest.lastName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            { props.actions }
        </form>
    );
};

export default Form1;