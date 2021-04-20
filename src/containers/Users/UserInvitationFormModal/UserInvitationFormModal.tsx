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
    boardID: string
};

interface IUserInvitationFormModalProps {
    open?: boolean,
    user: User | null,
    handleSubmit: (arg1: any) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const UserInvitationFormModal: React.FC<IUserInvitationFormModalProps> = props => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        if (!props.user) return;

        setUser(props.user);
    }, [ props.user ]);

    const account: User = useSelector((state: any) => state.app.account);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const boards: Board[] = useSelector((state: any) => {
        const filteredBoards = state.board.boards.filter((b: Board) => {
            if(b.accountID !== account.id) return false;
            
            const inv = invitations.find(i => i.boardID === b.id && i.userID === props.user?.id);
            return inv ? false : true;
        });

        return _.orderBy(filteredBoards, ["name"]);
    });

    const handleFormSubmit = (data: any): [Promise<any>, () => void, () => void] => {
        return props.handleSubmit({
            userID: (user || {}).id || "",
            boardID: data.boardID,
            accountID: (user || {}).accountID || "",
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
                {user ? <Avatar
                    size={50}
                    account={user}
                /> : null}
                
                <Grid item>
                    {user ?
                    <Typography>
                        {user.firstName + " " + user.lastName}
                    </Typography> : null}
                    {user ? 
                    <Typography style={{fontStyle: 'italic', lineHeight: 1, fontSize: 14}}>
                        {user.email}
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

export default UserInvitationFormModal;