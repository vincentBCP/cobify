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
import User from '../../../models/types/User';
import Invitation from '../../../models/types/Invitation';
import InvitationDTO from '../../../models/dto/InvitationDTO';

interface IFormInputs {
    userID: string
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

    const account: User = useSelector((state: any) => state.app.account);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const users: User[] = useSelector((state: any) => {
        const filteredUsers = state.user.users.filter((u: User) => {
            if (u.id === account.id) return false;

            const inv = invitations.find(i => i.userID === u.id && i.boardID === props.board?.id);
            return inv ? false : true;
        });

        return _.orderBy(filteredUsers, ["firstName"]);
    });

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit({
            boardID: (board || {}).id || "",
            userID: data.userID,
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
                    error={errors.userID !== undefined}
                >
                    User
                </InputLabel>
                <Select
                    label="User"
                    defaultValue=""
                    fullWidth
                    error={errors.userID !== undefined}
                    inputProps={{
                        required: true,
                        ...register('userID', { required: true })
                    }}
                >
                    {
                        users
                        .map(user =>
                            <MenuItem key={user.id} value={user.id}>{user.firstName + " " + user.lastName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </FormModal>
    );
};

export default BoardInvitationFormModal;