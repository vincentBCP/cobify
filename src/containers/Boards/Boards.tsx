import React from 'react';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';

import './Boards.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import Table, { HeadCell } from '../../components/Table/Table';

import Board from '../../models/types/Board';
import Invitation from '../../models/types/Invitation';
import Guest from '../../models/types/Guest';

import Chip from '../../widgets/Chip';

import * as actions from '../../store/actions';

interface IBoardsProps {
    deleteInvitation: (arg1: string) => Promise<any>
}

const Boards: React.FC<IBoardsProps> = props => {
    const boards: Board[] = useSelector((state: any) =>
        state.board.boards.map((board: Board) => ({
            ...board,
            columnCount: 0,
            taskCount: 0
        }))
    );
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const guests: Guest[] = useSelector((state: any) => state.guest.guests);

    const handleRemoveInvitation = (id: string) => {
        props.deleteInvitation(id);
    };

    const renderGuests = (board: Board) => {
        return (
            <div>
                {
                    invitations
                    .filter(i => i.boardID === board.id)
                    .map(i => 
                        {
                            const guest = guests.find(g => g.id === i.guestID);

                            if (!guest) return null;

                            return <Chip
                                key={i.id}
                                label={guest.firstName + " " + guest.lastName}
                                color={guest.color}
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

    const renderActions = (board: Board) => {
        return (
            <div>
                <IconButton
                    size="medium"
                    onClick={(ev: React.MouseEvent) => ev.stopPropagation()}
                >
                    <ShareIcon />
                </IconButton>
            </div>
        );
    };

    const headCells: HeadCell[] = [
        { id: "name", label: "Name", property: "name" },
        { id: "columnCount", label: "Columns", property: "columnCount" },
        { id: "taskCount", label: "Tasks", property: "taskCount" },
        { id: "guestCount", label: "Guests", render: renderGuests },
        { id: "actions", label: "Actions", align: "center", render: renderActions }
    ];

    return (
        <Auxi>
            <ApplicationBar title="Boards" />

            <Page key="lorem" title="Boards">
                <Table
                    dataList={boards}
                    headCells={headCells}
                    defaultOrderBy="name"
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

export default connect(null, mapDispatchToProps)(Boards);