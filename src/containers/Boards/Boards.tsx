import React, { useState } from 'react';
import randomcolor from 'randomcolor';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import './Boards.scss';

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
import Notification from '../../models/types/Notification';
import Label from '../../models/types/Label';

import BoardInvitationFormModal from './BoardInvitationFormModal';
import BoardFormModal from './BoardFormModal';

import Chip from '../../widgets/Chip';
import Avatar from '../../widgets/Avatar';

import * as actions from '../../store/actions';

import ErrorContext from '../../context/errorContext';
import AppContext, { SCREEN_SIZE } from '../../context/appContext';

import NotificationAPI from '../../api/NotificationAPI';

interface IBoardsProps {
    deleteInvitation: (arg1: string) => Promise<any>,
    sendInvitation: (arg1: InvitationDTO) => Promise<any>,
    createBoard: (arg1: BoardDTO) => Promise<any>,
    updateBoard: (arg1: Board) => Promise<any>,
    deleteBoard: (arg1: string) => Promise<any>,
    deleteColumn: (arg1: string) => Promise<string>,
    deleteComment: (arg1: Comment) => Promise<any>,
    deleteTask: (arg1: Task) => Promise<any>,
    deleteLabel: (arg1: string) => Promise<any>
}

const MAX_BOARDS = 1; // hard-coded for now

const Boards: React.FC<IBoardsProps> = props => {
    const [board, setBoard] = useState<Board | null>(null);
    const [open, setOpen] = useState(false);
    const [openInvitation, setOpenInvitation] = useState(false);

    const errorContext = React.useContext(ErrorContext);
    const appContext = React.useContext(AppContext);

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
    const notifications: Notification[] = useSelector((state: any) => state.notification.notifications);
    const labels: Label[] = useSelector((state: any) => state.label.labels);

    const handleRemoveInvitation = (id: string): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        return [
            props.deleteInvitation(id),
            response => {},
            error => {
                errorContext.setError(error);
            }
        ];
    };

    const handleCreateBoard = () => {
        if (boards.length >= MAX_BOARDS) {
            alert("You have reached the maximum allowed boards to create.");
            return;
        }

        setBoard(null);
        setOpen(true);
    }

    const handleBoardSubmit = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] =>  {
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
            response => {
                setOpen(false);
            },
            error => {
                errorContext.setError(error);
            }
        ];
    }

    const handleBoardCancel = () => {
        setOpen(false);
    }

    const handleDeleteSelectedRows = (ids: string[]): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
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

            tasks.forEach(t => {
                if (t.boardID !== id) return;

                comments.forEach(com => {
                    if (com.taskID !== t.id) return;
    
                    promises.push(props.deleteComment(com));
                });

                notifications.forEach(notif => {
                    if (notif.taskID !== t.id) return;

                    promises.push(NotificationAPI.deleteNotification(notif.id));
                });

                labels.forEach(l => {
                    if (l.boardID !== id) return;
    
                    promises.push(props.deleteLabel(l.id));
                });

                promises.push(props.deleteTask(t));
            });
        
            promises.push(props.deleteBoard(id));
        });

        return [
            Promise.all(promises),
            respone => {},
            error => {
                errorContext.setError(error);
            }
        ];
    }

    const handleBoardInvitationSubmit = (dto: InvitationDTO): [Promise<any>, (arg: any) => void, (arg: any) => void] =>  {
        return [
            props.sendInvitation(dto),
            response => {
                setOpenInvitation(false);
                setBoard(null);
            },
            error => {
                errorContext.setError(error);
            }
        ];
    }

    const handleBoardInvitationCancel = () => {
        setOpenInvitation(false);
        setBoard(null);
    }

    const handleRowClick = (record: any) => {
        if (appContext.screenSize === SCREEN_SIZE.lg) return;
        console.log(record);
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
                                handleDelete={(): [Promise<any>, (arg: any) => void, (arg: any) => void] => 
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
            <div style={{whiteSpace: 'nowrap'}}>
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

    const renderAvatar = (board: Board) => {
        return (
            <Avatar
                size={30}
                account={{
                    color: board.color,
                    initials: board.code
                } as User}
            />
        )
    }

    let headCells: HeadCell[] = [
        { id: "avatar", label: '', render: renderAvatar },
        { id: "name", label: "Name", property: "name" },
        { id: "columnCount", label: "Columns", property: "columnCount" },
        { id: "taskCount", label: "Tasks", property: "taskCount" },
        { id: "users", label: "Users", render: renderUsers },
        { id: "actions", label: "Actions", align: "center", render: renderActions }
    ];

    if (appContext.screenSize === SCREEN_SIZE.md) {
        headCells = [
            { id: "avatar", label: '', render: renderAvatar },
            { id: "name", label: "Name", property: "name" },
            { id: "users", label: "Users", render: renderUsers }
        ];
    } else if (appContext.screenSize === SCREEN_SIZE.sm) {
        headCells = [
            { id: "avatar", label: '', render: renderAvatar },
            { id: "name", label: "Name", property: "name" }
        ];
    }

    const tableActions = (
        <Tooltip title="Add Board">
            <IconButton
                aria-label="Add Board"
                onClick={handleCreateBoard}
            >
                <AddIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <React.Fragment>
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
                    handleRowClick={handleRowClick}
                />
            </Page>
        </React.Fragment>
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
        deleteColumn: (id: string) => dispatch(actions.deleteColumn(id)),
        deleteLabel: (id: string) => dispatch(actions.deleteLabel(id))
    }
};

export default connect(null, mapDispatchToProps)(Boards);