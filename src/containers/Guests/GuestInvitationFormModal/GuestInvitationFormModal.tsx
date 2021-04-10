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
    boardID: string
};

interface IGuestInvitationFormModalProps {
    guest: Guest | null,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const GuestInvitationFormModal: React.FC<IGuestInvitationFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const [guest, setGuest] = useState<Guest | null>();

    useEffect(() => {
        if (!props.guest) return;

        setGuest(props.guest);
    }, [ props.guest ]);

    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const boards: Board[] = useSelector((state: any) => {
        const filteredBoards = state.board.boards.filter((b: Board) => {
            const inv = invitations.find(i => i.boardID === b.id && i.guestID === props.guest?.id);
            return inv ? false : true;
        });

        return _.orderBy(filteredBoards, ["name"]);
    });

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit({
            guestID: (guest || {}).id || "",
            boardID: data.boardID,
            accountID: (guest || {}).accountID || "",
        } as InvitationDTO);
    }

    return (
        <FormModal
            title="Invitation"
            open={Boolean(props.guest)}
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
                {guest ? <Avatar
                    color={guest.color}
                    size={50}
                    initials={guest.initials}
                /> : null}
                
                <Grid item>
                    {guest ?
                    <Typography>
                        {guest.firstName + " " + guest.lastName}
                    </Typography> : null}
                    {guest ? 
                    <Typography style={{fontStyle: 'italic', lineHeight: 1, fontSize: 14}}>
                        {guest.email}
                    </Typography> : null}
                </Grid> 
            </Grid>

            <FormControl fullWidth>
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
                        boards
                        .map(board =>
                            <MenuItem key={board.id} value={board.id}>{board.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </FormModal>
    );
};

export default GuestInvitationFormModal;