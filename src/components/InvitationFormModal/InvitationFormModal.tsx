import React, { useState, useEffect } from'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Guest from '../../models/types/Guest';
import Board from '../../models/types/Board';
import Invitation from '../../models/types/Invitation';
import InvitationDTO from '../../models/dto/InvitationDTO';

import Avatar from '../../widgets/Avatar';
import FormActions from '../../widgets/FormActions';
import { SUCCESS_DELAY } from '../../widgets/FormActions/SendButton/SendButton';

import Form1 from './Form1';
import Form2 from './Form2';

export enum Type {
    GUEST="guest",
    BOARD="board"
};

interface IInvitationFormModalProps {
    open: boolean,
    type: Type,
    guest?: Guest | null,
    board?: Board | null,
    handleSend: (arg1: InvitationDTO) => [Promise<any>, () => void, () => void],
    handleCancel: () => void
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: 300,
            padding: "10px 0"
        },
        title: {
            fontWeight: 'bold', 
            marginBottom: 25,
            fontSize: 18
        },
        actions: {
            marginTop: 30
        }
    })
);

const InvitationFormModal: React.FC<IInvitationFormModalProps> = props => {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [board, setBoard] = useState<Board | null>();
    const [guest, setGuest] = useState<Guest | null>();

    const boards: Board[] = useSelector((state: any) => state.board.boards);
    const guests: Guest[] = useSelector((state: any) => state.guest.guests);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);

    useEffect(() => {
        if (!props.board) return;

        setBoard(props.board);
        setGuest(null);

        setLoading(false);
        setSuccess(false);
    }, [ props.board ]);

    useEffect(() => {
        if (!props.guest) return;

        setGuest(props.guest);
        setBoard(null);

        setLoading(false);
        setSuccess(false);
    }, [ props.guest ]);

    const handleCancel = () => {
        props.handleCancel();
    }

    const filterBoards = () => {
        const guestID = guest?.id;

        const filteredBoards = boards.filter(b => {
            const inv = invitations.find(i => i.boardID === b.id && i.guestID === guestID);
            return inv ? false : true;
        });

        return _.orderBy(filteredBoards, ["name"]);
    }

    const filterGuests = () => {
        const boardID = board?.id;

        const filteredGuests = guests.filter(g => {
            const inv = invitations.find(i => i.guestID === g.id && i.boardID === boardID);
            return inv ? false : true;
        });

        return _.orderBy(filteredGuests, ["firstName"]);
    }

    const handleSubmit = (data: any) => {
        let [request, successCallback, failCallback] = props.handleSend({
            boardID: board ? board.id : data.boardID,
            guestID: guest ? guest.id : data.guestID
        });

        setLoading(true);
        setSuccess(false);

        request
        .then(response => {
            setSuccess(true);

            setTimeout(() => {
                successCallback();
            }, SUCCESS_DELAY);
        })
        .catch(error => {
            setLoading(false);
            setSuccess(false);

            failCallback();
        });
    }

    const actions = (
        <FormActions
            loading={loading}
            success={success}
            handleCancel={handleCancel}
        />
    );

    return (
        <Dialog open={props.open || false}>
            <DialogContent>
                <Paper elevation={0} className={classes.root}>
                    <Typography className={classes.title}>Guest invitation</Typography>

                    <Grid
                        container direction="row"
                        alignItems="center" spacing={2}
                        style={{marginBottom: 30}}
                    >
                        {board ?
                        <Avatar
                            initials={board.code}
                            color={board.color}
                            size={50}
                        /> : null}

                        {guest ?
                        <Avatar
                            color={guest.color}
                            size={50}
                            initials={
                                ((guest.firstName || '').charAt(0).toUpperCase() + 
                                (guest.lastName || '').charAt(0)).toUpperCase()
                            }
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
                            {board ?
                            <Typography>
                                {board.name}
                            </Typography> : null}
                        </Grid> 
                    </Grid>

                    {
                        props.type === Type.GUEST
                        ? <Form1
                            guests={filterGuests()}
                            actions={actions}
                            handleSubmit={handleSubmit}
                        />
                        : null
                    }

                    {
                        props.type === Type.BOARD
                        ? <Form2
                            boards={filterBoards()}
                            actions={actions}
                            handleSubmit={handleSubmit}
                        />
                        : null
                    }
                </Paper>
            </DialogContent>
        </Dialog>
    );
};

export default InvitationFormModal;