import React, { useState } from 'react';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import './Boards.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import Table, { HeadCell } from '../../components/Table/Table';

import Board from '../../models/types/Board';
import Invitation from '../../models/types/Invitation';
import Guest from '../../models/types/Guest';
import Column from '../../models/types/Column';
import Task from '../../models/types/Task';
import GuestDTO from '../../models/dto/GuestDTO';

import Chip from '../../widgets/Chip';

import InvitationFormModal, { Type } from '../../components/InvitationFormModal/InvitationFormModal';

import * as actions from '../../store/actions';

interface IBoardsProps {
    deleteInvitation: (arg1: string) => Promise<any>,
    sendGuestInvitation: (arg1: GuestDTO) => Promise<any>
}

const Boards: React.FC<IBoardsProps> = props => {
    const [board, setBoard] = useState<Board | null>(null);

    const columns: Column[] = useSelector((state: any) => state.column.columns);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);
    const boards: Board[] = useSelector((state: any) =>
        state.board.boards.map((board: Board) => ({
            ...board,
            columnCount: columns.filter(c => c.boardID === board.id).length,
            taskCount: tasks.filter(t => t.boardID === board.id).length
        }))
    );
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const guests: Guest[] = useSelector((state: any) => state.guest.guests);

    const handleRemoveInvitation = (id: string): [Promise<any>, () => void, () => void] => {
        return [
            props.deleteInvitation(id),
            () => {},
            () => {}
        ];
    };

    const handleShareInvitation = (board: Board) => {
        setBoard(board);
    }

    const handleSend = (dto: GuestDTO): [Promise<any>, () => void, () => void] =>  {
        return [
            props.sendGuestInvitation(dto),
            () => { // succes callback
                setBoard(null);
            },
            () => { // fail callback

            }
        ];
    }

    const handleCancel = () => {
        setBoard(null);
    }

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
                                handleDelete={(): [Promise<any>, () => void, () => void] => 
                                    handleRemoveInvitation(i.id)}
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
                    onClick={(ev: React.MouseEvent) => {
                        ev.stopPropagation();
                        handleShareInvitation(board);
                    }}
                >
                    <PersonAddIcon />
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

            <InvitationFormModal
                type={Type.GUEST}
                open={board !== null}
                board={board}
                handleSend={handleSend}
                handleCancel={handleCancel}
            />

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
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id)),
        sendGuestInvitation: (dto: GuestDTO) => dispatch(actions.sendGuestInvitation(dto))
    }
};

export default connect(null, mapDispatchToProps)(Boards);