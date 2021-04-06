import React from 'react';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import './Guests.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import Table, { HeadCell } from '../../components/Table/Table';

import Guest from '../../models/types/Guest';
import Invitation from '../../models/types/Invitation';
import Board from '../../models/types/Board';

import Chip from '../../widgets/Chip';

import * as actions from '../../store/actions';

interface IGuestsProps {
    deleteInvitation: (arg1: string) => Promise<any>
}

const Guests: React.FC<IGuestsProps> = props => {
    const guests: Guest[] = useSelector((state: any) => 
        state.guest.guests.map((guest: Guest) => ({
            ...guest,
            displayName: (guest.firstName + " " + guest.lastName)
        })
    ));

    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const boards: Board[] = useSelector((state: any) => state.board.boards);

    const handleRemoveInvitation = (id: string) => {
        props.deleteInvitation(id);
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
                                handleDelete={() => {
                                    handleRemoveInvitation(i.id)
                                }}
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
                    onClick={(ev: React.MouseEvent) => ev.stopPropagation()}
                >
                    <AddIcon />
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
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id))
    }
};

export default connect(null, mapDispatchToProps)(Guests);