import React, { useState } from 'react';
import randomcolor from 'randomcolor';

import { useSelector, connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import './Users.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import Table, { HeadCell } from '../../components/Table/Table';

import User from '../../models/types/User';
import Invitation from '../../models/types/Invitation';
import Board from '../../models/types/Board';
import InvitationDTO from '../../models/dto/InvitationDTO';
import UserDTO from '../../models/dto/UserDTO';
import UserRole from '../../models/enums/UserRole';

import Chip from '../../widgets/Chip';
import Avatar from '../../widgets/Avatar';

import UserInvitationFormModal from './UserInvitationFormModal';
import UserFormModal from './UserFormModal';

import * as actions from '../../store/actions';

interface IUsersProps {
    deleteInvitation: (arg1: string) => Promise<any>,
    sendInvitation: (arg1: InvitationDTO) => Promise<any>,
    createUser: (arg1: UserDTO) => Promise<any>,
    updateUser: (arg21: User) => Promise<any>,
    deleteUser: (arg1: string, arg2: string) => Promise<any>
}

const Users: React.FC<IUsersProps> = props => {
    const [openInvitation, setOpenInvitation] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);

    const account: User = useSelector((state: any) => state.app.account);
    const users: User[] = useSelector((state: any) =>
        state.user.users.filter((u: User) => u.accountID === account.id));
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const boards: Board[] = useSelector((state: any) => state.board.boards);

    const handleUserSubmit = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] =>  {
        const request = user
            ? props.updateUser({
                ...user,
                ...data
            })
            : props.createUser({
                ...data,
                color: randomcolor(),
                accountID: account.id,
                created: (new Date()).toISOString()
            } as UserDTO);

        return [
            request,
            response => { // succes callback
                setOpen(false);
            },
            error => { // fail callback
                //TO DO: handle error
                alert("Error occured.");
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

            invitations.forEach(inv => {
                if(inv.userID !== id) return;

                promises.push(props.deleteInvitation(inv.id));
            });

            promises.push(props.deleteUser(id, user.email));
        });

        return [
            Promise.all(promises),
            respones => {},
            error => {
                //TO DO: handle error
                alert("Error occured.");
            }
        ];
    }

    const handleUserInvitationSubmit = (dto: InvitationDTO): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        return [
            props.sendInvitation(dto),
            response => { // succes callback
                setOpenInvitation(false);
                setUser(null);
            },
            error => { // fail callback
                //TO DO: handle error
                alert("Error occured.");
            }
        ];
    }

    const handleUserInvitationCancel = () => {
        setOpenInvitation(false);
        setUser(null);
    }

    const handleRemoveInvitation = (id: string): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        return [
            props.deleteInvitation(id),
            response => {},
            error => {
                //TO DO: handle error
                alert("Error occured.");
            }
        ];
    };

    const renderInvitations = (user: User): JSX.Element => {
        return (
            <div>
                {
                    invitations
                    .filter(i => i.userID === user.id)
                    .map(i => 
                        {
                            const board = boards.find(b => b.id === i.boardID);

                            if (!board) return null;

                            return <Chip
                                key={i.id}
                                label={board.name}
                                color={board.color}
                                handleDelete={(): [Promise<any>, (arg: any) => void, (arg: any) => void] => 
                                    handleRemoveInvitation(i.id)}
                            />;
                        }
                    )
                }
            </div>
        );
    };

    const renderActions = (user: User) => {
        return (
            <div>
                <IconButton
                    size="medium"
                    onClick={(ev: React.MouseEvent) => {
                        ev.stopPropagation();
                        setUser(user);
                        setOpen(true);
                    }}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    size="medium"
                    onClick={(ev: React.MouseEvent) => {
                        ev.stopPropagation();
                        setUser(user);
                        setOpenInvitation(true);
                    }}
                >
                    <ShareIcon />
                </IconButton>
            </div>
        );
    };

    const renderRole = (user: User) => {
        switch (user.role) {
            case UserRole.COADMIN: return <span>Co-admin</span>
            case UserRole.GUEST: return <span>Guest</span>
            default: return <span></span>
        }
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
        { id: 'role', property: 'role', label: 'Role', render: renderRole},
        { id: 'boards', label: 'Boards', render: renderInvitations },
        { id: 'actions', label: 'Actions', align: 'center', render: renderActions }
    ];

    const tableActions = (
        <Tooltip title="Add User">
            <IconButton
                aria-label="Add User"
                onClick={() => {
                    setUser(null);
                    setOpen(true);
                }}
            >
                <AddIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <Auxi>
            <ApplicationBar title="Users" />

            <UserInvitationFormModal
                open={openInvitation}
                user={user}
                handleSubmit={handleUserInvitationSubmit}
                handleCancel={handleUserInvitationCancel}
            />

            <UserFormModal
                open={open}
                user={user}
                handleSubmit={handleUserSubmit}
                handleCancel={handleUserCancel}
            />

            <Page title="Users">
                <Table
                    actions={tableActions}
                    dataList={users}
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
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id)),
        sendInvitation: (dto: InvitationDTO) => dispatch(actions.sendInvitation(dto)),
        createUser: (dto: UserDTO) => dispatch(actions.createUser(dto)),
        updateUser: (user: User) => dispatch(actions.updateUser(user)),
        deleteUser: (id: string, email: string) => 
            dispatch(actions.deleteUser(id, email))
    }
};

export default connect(null, mapDispatchToProps)(Users);