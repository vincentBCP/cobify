import React, { useState } from 'react';
import randomcolor from 'randomcolor';
import { format } from 'date-fns';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import Table, { HeadCell } from '../../components/Table/Table';

import User from '../../models/types/User';
import UserDTO from '../../models/dto/UserDTO';
import UserRole from '../../models/enums/UserRole';
import Task from '../../models/types/Task';
import Comment from '../../models/types/Comment';
import Board from '../../models/types/Board';
import Column from '../../models/types/Column';
import Invitation from '../../models/types/Invitation';

import AccountFormModal from './AccountFormModal';

import Avatar from '../../widgets/Avatar';

import * as actions from '../../store/actions';

import ErrorContext from '../../context/errorContext';

interface IUsersProps {
    createUser: (arg1: UserDTO) => Promise<any>,
    deleteUser: (arg1: User) => Promise<any>,
    deleteBoard: (arg1: string) => Promise<any>,
    deleteColumn: (arg1: string) => Promise<string>,
    deleteComment: (arg1: Comment) => Promise<any>,
    deleteTask: (arg1: Task) => Promise<any>,
    deleteInvitation: (arg1: string) => Promise<any>
}

const Users: React.FC<IUsersProps> = props => {
    const [open, setOpen] = useState(false);

    const errorContext = React.useContext(ErrorContext);

    const account: User = useSelector((state: any) => state.app.account);
    const users: User[] = useSelector((state: any) => state.user.users);
    const boards: Board[] = useSelector((state: any) => state.board.boards);
    const columns: Column[] = useSelector((state: any) => state.column.columns);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);

    const handleUserSubmit = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] =>  {
        const request = props.createUser({
            ...data,
            role: UserRole.ADMIN,
            color: randomcolor(),
            accountID: account.id,
            created: (new Date()).toISOString()
        } as UserDTO)

        return [
            request,
            (response: any) => {
                setOpen(false);
            },
            (error: any) => {
                errorContext.setError(error);
            }
        ];
    }

    const handleUserCancel = () => {
        setOpen(false);
    }

    const handleDeleteSelectedRows = (ids: string[]): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        const promises: any = [];

        ids.forEach(id => {
            const user = users.find(u => u.id === id);

            if (!user) return;

            comments.forEach(c => {
                if (c.accountID !== user.id) return;

                promises.push(props.deleteComment(c));
            });

            tasks.forEach(t => {
                if (t.accountID !== user.id) return;

                promises.push(props.deleteTask(t));
            });

            columns.forEach(c => {
                if (c.accountID !== user.id) return;

                promises.push(props.deleteColumn(c.id));
            });

            invitations.forEach(i => {
                if (i.accountID !== user.id) return;

                promises.push(props.deleteInvitation(i.id));
            });

            boards.forEach(b => {
                if (b.accountID !== user.id) return;

                promises.push(props.deleteBoard(b.id));
            });

            users.forEach(u => {
                if (u.accountID !== user.id) return;

                promises.push(props.deleteUser(u));
            });

            promises.push(props.deleteUser(user));
        });

        return [
            Promise.all(promises),
            (response: any) => {},
            (error: any) => {
                errorContext.setError(error);
            }
        ];
    }

    const renderActions = (user: User) => {
        return (
            <div>
                <IconButton size="medium">
                    <EditIcon />
                </IconButton>
            </div>
        );
    };

    const renderCreated = (user: User) => {
        return <span>{format(new Date(user.created), "MMM d, yyyy")}</span>
    }

    const renderAvatar = (user: User) => {
        return (
            <Avatar
                size={30}
                account={user}
            />
        );
    }

    const headCells: HeadCell[] = [
        { id: 'avatar', label: '', render: renderAvatar },
        { id: 'email', property: "email", label: 'Email' },
        { id: 'displayName', property: "displayName", label: 'Name' },
        { id: 'organization', property: "organization", label: 'Organization' },
        { id: 'created', property: 'created', label: 'Created', render: renderCreated },
        { id: 'actions', label: 'Actions', align: 'center', render: renderActions }
    ];

    const tableActions = (
        <Tooltip title="Add Account">
            <IconButton
                aria-label="Add Account"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <AddIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <Auxi>
            <ApplicationBar title="Accounts" />

            <AccountFormModal
                open={open}
                handleSubmit={handleUserSubmit}
                handleCancel={handleUserCancel}
            />

            <Page title="Accounts">
                <Table
                    actions={tableActions}
                    dataList={users.filter((u: User) => u.accountID === account.id)}
                    headCells={headCells}
                    defaultOrderBy="displayName"
                    handleDeleteSelectedRows={handleDeleteSelectedRows}
                />
            </Page>
        </Auxi>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        createUser: (dto: UserDTO) => dispatch(actions.createUser(dto)),
        deleteUser: (user: User) => 
            dispatch(actions.deleteUser(user)),
        deleteBoard: (id: string) => dispatch(actions.deleteBoard(id)),
        deleteTask: (task: Task) => dispatch(actions.deleteTask(task)),
        deleteComment: (comment: Comment) => dispatch(actions.deleteComment(comment)),
        deleteColumn: (id: string) => dispatch(actions.deleteColumn(id)),
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id)),
    }
};

export default connect(null, mapDispatchToProps)(Users);