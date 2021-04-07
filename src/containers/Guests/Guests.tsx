import React, { useState } from 'react';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';

import './Guests.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import Table, { HeadCell } from '../../components/Table/Table';

import Guest from '../../models/types/Guest';
import Invitation from '../../models/types/Invitation';
import Board from '../../models/types/Board';
import InvitationDTO from '../../models/dto/InvitationDTO';

import Chip from '../../widgets/Chip';

import InvitationFormModal, { Type } from '../../components/InvitationFormModal/InvitationFormModal';

import * as actions from '../../store/actions';

interface IGuestsProps {
    deleteInvitation: (arg1: string) => Promise<any>,
    sendInvitation: (arg1: InvitationDTO) => Promise<any>
}

const Guests: React.FC<IGuestsProps> = props => {
    const [guest, setGuest] = useState<Guest | null>(null);

    const guests: Guest[] = useSelector((state: any) => 
        state.guest.guests.map((guest: Guest) => ({
            ...guest,
            displayName: (guest.firstName + " " + guest.lastName)
        })
    ));

    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const boards: Board[] = useSelector((state: any) => state.board.boards);

    const handleShareInvitation = (g: Guest) => {
        setGuest(g);
    }

    const handleSend = (dto: InvitationDTO): [Promise<any>, () => void, () => void] => {
        return [
            props.sendInvitation(dto),
            () => { // succes callback
                setGuest(null);
            },
            () => { // fail callback

            }
        ];
    }

    const handleCancel = () => {
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
                        handleShareInvitation(guest);
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
        { id: 'actions', label: 'Actions', render: renderActions }
    ];

    return (
        <Auxi>
            <ApplicationBar title="Guests" />

            <InvitationFormModal
                type={Type.BOARD}
                open={guest !== null}
                guest={guest}
                handleSend={handleSend}
                handleCancel={handleCancel}
            />

            <Page title="Guests">
                <Table
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
        sendInvitation: (dto: InvitationDTO) => dispatch(actions.sendInvitation(dto))
    }
};

export default connect(null, mapDispatchToProps)(Guests);