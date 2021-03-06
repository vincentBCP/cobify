import React, { useState } from 'react';
import randomcolor from 'randomcolor';
import { format } from 'date-fns';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

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
import Notification from '../../models/types/Notification';
import Label from '../../models/types/Label';

import AccountFormModal from './AccountFormModal';
import AccountModal from './AccountModal';

import Avatar from '../../widgets/Avatar';

import * as actions from '../../store/actions';

import ErrorContext from '../../context/errorContext';
import AppContext, { SCREEN_SIZE } from '../../context/appContext';

import NotificationAPI from '../../api/NotificationAPI';

interface IUsersProps {
    createUser: (arg1: UserDTO) => Promise<any>,
    deleteUser: (arg1: User) => Promise<any>,
    deleteBoard: (arg1: string) => Promise<any>,
    deleteColumn: (arg1: string) => Promise<string>,
    deleteComment: (arg1: Comment) => Promise<any>,
    deleteTask: (arg1: Task) => Promise<any>,
    deleteInvitation: (arg1: string) => Promise<any>,
    deleteLabel: (arg1: string) => Promise<any>
}

const Users: React.FC<IUsersProps> = props => {
    const [openForm, setOpenForm] = useState(false);
    const [openAccount, setOpenAccount] = useState(false);
    const [viewingAccount, setViewingAccount] = useState<User | null>();

    const errorContext = React.useContext(ErrorContext);
    const appContext = React.useContext(AppContext);

    const account: User = useSelector((state: any) => state.app.account);
    const users: User[] = useSelector((state: any) => state.user.users);
    const boards: Board[] = useSelector((state: any) => state.board.boards);
    const columns: Column[] = useSelector((state: any) => state.column.columns);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const tasks: Task[] = useSelector((state: any) => state.task.tasks);
    const comments: Comment[] = useSelector((state: any) => state.comment.comments);
    const notifications: Notification[] = useSelector((state: any) => state.notification.notifications);
    const labels: Label[] = useSelector((state: any) => state.label.labels);

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
                setOpenForm(false);
            },
            (error: any) => {
                errorContext.setError(error);
            }
        ];
    }

    const handleUserCancel = () => {
        setOpenForm(false);
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

            notifications.forEach(n => {
                if (n.accountID !== user.id) return;

                promises.push(NotificationAPI.deleteNotification(n.id));
            });

            labels.forEach(l => {
                if (l.accountID !== user.id) return;

                promises.push(props.deleteLabel(l.id));
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

    const handleRowClick = (record: any) => {
        if (appContext.screenSize === SCREEN_SIZE.lg) return;

        setViewingAccount(record as User);
        setOpenAccount(true);
    }

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

    let headCells: HeadCell[] = [
        { id: 'avatar', label: '', render: renderAvatar },
        { id: 'email', property: "email", label: 'Email' },
        { id: 'displayName', property: "displayName", label: 'Name' },
        { id: 'organization', property: "organization", label: 'Organization' },
        { id: 'created', property: 'created', label: 'Created', render: renderCreated }
    ];

    if (appContext.screenSize === SCREEN_SIZE.md) {
        headCells = [
            { id: 'avatar', label: '', render: renderAvatar },
            { id: 'email', property: "email", label: 'Email' },
            { id: 'displayName', property: "displayName", label: 'Name' },
            { id: 'organization', property: "organization", label: 'Organization' },
        ];
    } else if (appContext.screenSize === SCREEN_SIZE.sm) {
        headCells = [
            { id: 'avatar', label: '', render: renderAvatar },
            { id: 'email', property: "email", label: 'Email' },
            { id: 'displayName', property: "displayName", label: 'Name' }
        ];
    }

    const tableActions = (
        <Tooltip title="Add Account">
            <IconButton
                aria-label="Add Account"
                onClick={() => {
                    setOpenForm(true);
                }}
            >
                <AddIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <React.Fragment>
            <ApplicationBar title="Accounts" />

            {
                viewingAccount && openAccount
                ? <AccountModal
                    account={viewingAccount}
                    handleClose={() => {
                        setOpenAccount(false);
                        setViewingAccount(null);
                    }}
                    fullScreen={appContext.screenSize === SCREEN_SIZE.sm}
                />
                : null
            }

            <AccountFormModal
                open={openForm}
                handleSubmit={handleUserSubmit}
                handleCancel={handleUserCancel}
            />

            <Page title="Accounts">
                <Table
                    actions={tableActions}
                    dataList={users.filter((u: User) => u.role === UserRole.ADMIN)}
                    headCells={headCells}
                    defaultOrderBy="displayName"
                    handleDeleteSelectedRows={handleDeleteSelectedRows}
                    handleRowClick={handleRowClick}
                />
            </Page>
        </React.Fragment>
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
        deleteLabel: (id: string) => dispatch(actions.deleteLabel(id))
    }
};

export default connect(null, mapDispatchToProps)(Users);