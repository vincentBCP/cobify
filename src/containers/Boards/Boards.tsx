import React, { useState } from 'react';
import randomcolor from 'randomcolor';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

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
import InvitationDTO from '../../models/dto/InvitationDTO';
import BoardDTO from '../../models/dto/BoardDTO';

import BoardInvitationFormModal from './BoardInvitationFormModal';
import BoardFormModal from './BoardFormModal';

import Chip from '../../widgets/Chip';

import * as actions from '../../store/actions';

interface IBoardsProps {
    deleteInvitation: (arg1: string) => Promise<any>,
    sendInvitation: (arg1: InvitationDTO) => Promise<any>,
    createBoard: (arg1: BoardDTO) => Promise<any>,
    updateBoard: (arg1: Board) => Promise<any>,
    deleteBoard: (arg1: string, arg2: string[], agr3: string[], arg4: string[]) => Promise<any>
}

const Boards: React.FC<IBoardsProps> = props => {
    const [board, setBoard] = useState<Board | null>(null);
    const [open, setOpen] = useState(false);
    const [openInvitation, setOpenInvitation] = useState(false);

    const user: any = useSelector((state: any) => state.app.user);
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

    const handleBoardSubmit = (data: any): [Promise<any>, () => void, () => void] =>  {
        const request = board
            ? props.updateBoard({
                ...board,
                ...data
            })
            : props.createBoard({
                ...data,
                color: randomcolor(),
                accountID: user.id
            } as BoardDTO);

        return [
            request,
            () => { // succes callback
                setOpen(false);
            },
            () => { // fail callback

            }
        ];
    }

    const handleBoardCancel = () => {
        setOpen(false);
    }

    const handleDeleteSelectedRows = (ids: string[]): [Promise<any>, () => void, () => void] => {
        const promises: any = [];

        const columnIDs: string[] = [];
        const taskIDs: string[] = [];
        const invitationIDs: string[] = [];

        columns.forEach(col => {
            if (!ids.includes(col.boardID)) return;

            columnIDs.push(col.id);
        });

        tasks.forEach(t => {
            if (!ids.includes(t.boardID)) return;

            taskIDs.push(t.id);
        });

        invitations.forEach(i => {
            if (!ids.includes(i.boardID)) return;

            invitationIDs.push(i.id);
        });

        ids.forEach(id => promises.push(props.deleteBoard(id, columnIDs, taskIDs, invitationIDs)));

        return [Promise.all(promises), () => {}, () => {}];
    }

    const handleBoardInvitationSubmit = (dto: InvitationDTO): [Promise<any>, () => void, () => void] =>  {
        return [
            props.sendInvitation(dto),
            () => { // succes callback
                setOpenInvitation(false);
                setBoard(null);
            },
            () => { // fail callback

            }
        ];
    }

    const handleBoardInvitationCancel = () => {
        setOpenInvitation(false);
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
                        setOpen(true);
                        setBoard(board);
                    }}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    size="medium"
                    onClick={(ev: React.MouseEvent) => {
                        ev.stopPropagation();
                        setOpenInvitation(true);
                        setBoard(board);
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

    const tableActions = (
        <Tooltip title="Add Board">
            <IconButton
                aria-label="Add Board"
                onClick={() => {
                    setBoard(null);
                    setOpen(true);
                }}
            >
                <AddIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <Auxi>
            <ApplicationBar title="Boards" />

            <BoardInvitationFormModal
                open={openInvitation}
                board={board}
                handleSubmit={handleBoardInvitationSubmit}
                handleCancel={handleBoardInvitationCancel}
            />

            <BoardFormModal
                open={open}
                board={board}
                handleSubmit={handleBoardSubmit}
                handleCancel={handleBoardCancel}
            />

            <Page key="lorem" title="Boards">
                <Table
                    dataList={boards}
                    headCells={headCells}
                    defaultOrderBy="name"
                    actions={tableActions}
                    handleDeleteSelectedRows={handleDeleteSelectedRows}
                />
            </Page>
        </Auxi>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id)),
        sendInvitation: (dto: InvitationDTO) => dispatch(actions.sendInvitation(dto)),
        createBoard: (dto: BoardDTO) => dispatch(actions.createBoard(dto)),
        updateBoard: (board: Board) => dispatch(actions.updateBoard(board)),
        deleteBoard: (id: string, columnIDs: string[], taskIDs: string[], invitationIDs: string[]) => 
            dispatch(actions.deleteBoard(id, columnIDs, taskIDs, invitationIDs))
    }
};

export default connect(null, mapDispatchToProps)(Boards);