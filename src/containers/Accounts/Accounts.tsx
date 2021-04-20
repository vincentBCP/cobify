import React, { useState } from 'react';
import randomcolor from 'randomcolor';

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

import AccountFormModal from './AccountFormModal';

import * as actions from '../../store/actions';

interface IUsersProps {
    createUser: (arg1: UserDTO) => Promise<any>,
    deleteUser: (arg1: string, arg2: string) => Promise<any>
}

const Users: React.FC<IUsersProps> = props => {
    const [open, setOpen] = useState(false);

    const account: User = useSelector((state: any) => state.app.account);
    const users: User[] = useSelector((state: any) =>
        state.user.users.filter((u: User) => u.accountID === account.id));

    const handleUserSubmit = (data: any): [Promise<any>, () => void, () => void] =>  {
        const request = props.createUser({
            ...data,
            role: UserRole.ADMIN,
            color: randomcolor(),
            accountID: account.id
        } as UserDTO)

        return [
            request,
            () => { // succes callback
                setOpen(false);
            },
            () => { // fail callback

            }
        ];
    }

    const handleUserCancel = () => {
        setOpen(false);
    }

    const handleDeleteSelectedRows = (ids: string[]): [Promise<any>, () => void, () => void] => {
        const promises: any = [];

        ids.forEach(id => {
            const user = users.find(u => u.id === id);

            if (!user) return;

            promises.push(props.deleteUser(id, user.email));
        });

        return [Promise.all(promises), () => {}, () => {}];
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

    const headCells: HeadCell[] = [
        { id: 'email', property: "email", label: 'Email' },
        { id: 'displayName', property: "displayName", label: 'Name' },
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
        createUser: (dto: UserDTO) => dispatch(actions.createUser(dto)),
        deleteUser: (id: string, email: string) => 
            dispatch(actions.deleteUser(id, email))
    }
};

export default connect(null, mapDispatchToProps)(Users);