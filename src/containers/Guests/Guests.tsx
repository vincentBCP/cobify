import React, { useState } from 'react';
import randomcolor from 'randomcolor';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import './Guests.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import Table, { HeadCell } from '../../components/Table/Table';

import Guest from '../../models/types/Guest';
import Invitation from '../../models/types/Invitation';
import Board from '../../models/types/Board';
import InvitationDTO from '../../models/dto/InvitationDTO';
import GuestDTO from '../../models/dto/GuestDTO';

import Chip from '../../widgets/Chip';

import GuestInvitationFormModal from './GuestInvitationFormModal';
import GuestFormModal from './GuestFormModal';

import * as actions from '../../store/actions';

interface IGuestsProps {
    deleteInvitation: (arg1: string) => Promise<any>,
    sendInvitation: (arg1: InvitationDTO) => Promise<any>,
    createGuest: (arg1: GuestDTO) => Promise<any>,
    updateGuest: (arg21: Guest) => Promise<any>
}

const Guests: React.FC<IGuestsProps> = props => {
    const [openInvitation, setOpenInvitation] = useState(false);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [open, setOpen] = useState(false);

    const guests: Guest[] = useSelector((state: any) => 
        state.guest.guests.map((guest: Guest) => ({
            ...guest,
            displayName: (guest.firstName + " " + guest.lastName)
        })
    ));

    const user: any = useSelector((state: any) => state.app.user);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const boards: Board[] = useSelector((state: any) => state.board.boards);

    const handleGuestSubmit = (data: any): [Promise<any>, () => void, () => void] =>  {
        const request = guest
            ? props.updateGuest({
                ...guest,
                ...data
            })
            : props.createGuest({
                ...data,
                color: randomcolor(),
                accountID: user.id
            } as GuestDTO);

        return [
            request,
            () => { // succes callback
                setOpen(false);
            },
            () => { // fail callback

            }
        ];
    }

    const handleGuestCancel = () => {
        setOpen(false);
    }

    const handleGuestInvitationSubmit = (dto: InvitationDTO): [Promise<any>, () => void, () => void] => {
        return [
            props.sendInvitation(dto),
            () => { // succes callback
                setOpenInvitation(false);
                setGuest(null);
            },
            () => { // fail callback

            }
        ];
    }

    const handleGuestInvitationCancel = () => {
        setOpenInvitation(false);
        setGuest(null);
    }

    const handleRemoveInvitation = (id: string): [Promise<any>, () => void, () => void] => {
        return [
            props.deleteInvitation(id),
            () => {},
            () => {}
        ];
    };

    const renderInvitations = (guest: Guest): JSX.Element => {
        return (
            <div>
                {
                    invitations
                    .filter(i => i.guestID === guest.id)
                    .map(i => 
                        {
                            const board = boards.find(b => b.id === i.boardID);

                            if (!board) return null;

                            return <Chip
                                key={i.id}
                                label={board.name}
                                color={board.color}
                                handleDelete={(): [Promise<any>, () => void, () => void] => 
                                    handleRemoveInvitation(i.id)}
                            />;
                        }
                    )
                }
            </div>
        );
    };

    const renderActions = (guest: Guest) => {
        return (
            <div>
                <IconButton
                    size="medium"
                    onClick={(ev: React.MouseEvent) => {
                        ev.stopPropagation();
                        setGuest(guest);
                        setOpen(true);
                    }}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    size="medium"
                    onClick={(ev: React.MouseEvent) => {
                        ev.stopPropagation();
                        setGuest(guest);
                        setOpenInvitation(true);
                    }}
                >
                    <ShareIcon />
                </IconButton>
            </div>
        );
    };

    const headCells: HeadCell[] = [
        { id: 'email', property: "email", label: 'Email' },
        { id: 'displayName', property: "displayName", label: 'Name' },
        { id: 'boards', label: 'Boards', render: renderInvitations },
        { id: 'actions', label: 'Actions', align: 'center', render: renderActions }
    ];

    const tableActions = (
        <Tooltip title="Add Guest">
            <IconButton
                aria-label="Add Guest"
                onClick={() => {
                    setGuest(null);
                    setOpen(true);
                }}
            >
                <AddIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <Auxi>
            <ApplicationBar title="Guests" />

            <GuestInvitationFormModal
                open={openInvitation}
                guest={guest}
                handleSubmit={handleGuestInvitationSubmit}
                handleCancel={handleGuestInvitationCancel}
            />

            <GuestFormModal
                open={open}
                guest={guest}
                handleSubmit={handleGuestSubmit}
                handleCancel={handleGuestCancel}
            />

            <Page title="Guests">
                <Table
                    actions={tableActions}
                    dataList={guests}
                    headCells={headCells}
                    defaultOrderBy="displayName"
                />
            </Page>
        </Auxi>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id)),
        sendInvitation: (dto: InvitationDTO) => dispatch(actions.sendInvitation(dto)),
        createGuest: (dto: GuestDTO) => dispatch(actions.createGuest(dto)),
        updateGuest: (guest: Guest) => dispatch(actions.updateGuest(guest))
    }
};

export default connect(null, mapDispatchToProps)(Guests);