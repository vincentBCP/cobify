import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import FormModal from '../../../widgets/FormModal';
import Avatar from '../../../widgets/Avatar';

import Board from '../../../models/types/Board';
import Guest from '../../../models/types/Guest';
import Invitation from '../../../models/types/Invitation';
import InvitationDTO from '../../../models/dto/InvitationDTO';

interface IFormInputs {
    guestID: string
};

interface IBoardInvitationFormModalProps {
    open?: boolean,
    board: Board | null,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const BoardInvitationFormModal: React.FC<IBoardInvitationFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const [board, setBoard] = useState<Board | null>();

    useEffect(() => {
        if (!props.board) return;

        setBoard(props.board);
    }, [ props.board ]);

    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const guests: Guest[] = useSelector((state: any) => {
        const filteredGuests = state.guest.guests.filter((g: Guest) => {
            const inv = invitations.find(i => i.guestID === g.id && i.boardID === props.board?.id);
            return inv ? false : true;
        });

        return _.orderBy(filteredGuests, ["firstName"]);
    });

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit({
            boardID: (board || {}).id || "",
            guestID: data.guestID,
            accountID: (board || {}).accountID || "",
        } as InvitationDTO);
    }

    return (
        <FormModal
            title="Invitation"
            open={props.open}
            reset={reset}
            useFormHandleSubmit={handleSubmit}
            handleSubmit={handleFormSubmit}
            handleCancel={props.handleCancel}
        >
            <Grid
                container direction="row"
                alignItems="center" spacing={2}
                style={{marginBottom: 30}}
            >
                {board ? <Avatar
                    initials={board.code}
                    color={board.color}
                    size={50}
                /> : null}
                
                {board ? <Grid item>
                    <Typography>
                        {board.name}
                    </Typography>
                </Grid> : null}
            </Grid>

            <FormControl fullWidth>
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
                        guests
                        .map(guest =>
                            <MenuItem key={guest.id} value={guest.id}>{guest.firstName + " " + guest.lastName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </FormModal>
    );
};

export default BoardInvitationFormModal;