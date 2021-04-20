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
import User from '../../models/types/User';
import Column from '../../models/types/Column';
import Task from '../../models/types/Task';
import InvitationDTO from '../../models/dto/InvitationDTO';
import BoardDTO from '../../models/dto/BoardDTO';
import Comment from '../../models/types/Comment';

import BoardInvitationFormModal from './BoardInvitationFormModal';
import BoardFormModal from './BoardFormModal';

import Chip from '../../widgets/Chip';

import * as actions from '../../store/actions';

interface IBoardsProps {
    deleteInvitation: (arg1: string) => Promise<any>,
    sendInvitation: (arg1: InvitationDTO) => Promise<any>,
    createBoard: (arg1: BoardDTO) => Promise<any>,
    updateBoard: (arg1: Board) => Promise<any>,
    deleteBoard: (arg1: string) => Promise<any>,
    deleteColumn: (arg1: string) => Promise<string>,
    deleteComment: (arg1: Comment) => Promise<any>,
    deleteTask: (arg1: Task) => Promise<any>
}

const Boards: React.FC<IBoardsProps> = props => {
    const [board, setBoard] = useState<Board | null>(null);
    const [open, setOpen] = useState(false);
    const [openInvitation, setOpenInvitation] = useState(false);

    const account: any = useSelector((state: any) => state.app.account);
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
    const users: User[] = useSelector((state: any) => state.user.users);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);

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
                accountID: account.id
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

        ids.forEach(id => {
            columns.forEach(col => {
                if (col.boardID !== id) return;

                promises.push(props.deleteColumn(col.id));
            });

            invitations.forEach(i => {
                if (i.boardID !== id) return;

                props.deleteInvitation(i.id);
            });

            comments.forEach(com => {
                if (com.boardID !== id) return;

                promises.push(props.deleteComment(com));
            })

            tasks.forEach(t => {
                if (t.boardID !== id) return;

                promises.push(props.deleteTask(t));
            });
        
            promises.push(props.deleteBoard(id));
        });

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

    const renderUsers = (board: Board) => {
        return (
            <div>
                {
                    invitations
                    .filter(i => i.boardID === board.id)
                    .map(i => 
                        {
                            const user = users.find(g => g.id === i.userID);

                            if (!user) return null;

                            return <Chip
                                key={i.id}
                                label={user.firstName + " " + user.lastName}
                                color={user.color}
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
        { id: "userCount", label: "Users", render: renderUsers },
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
        deleteBoard: (id: string) => dispatch(actions.deleteBoard(id)),
        deleteTask: (task: Task) => dispatch(actions.deleteTask(task)),
        deleteComment: (comment: Comment) => dispatch(actions.deleteComment(comment)),
        deleteColumn: (id: string) => dispatch(actions.deleteColumn(id))
    }
};

export default connect(null, mapDispatchToProps)(Boards);