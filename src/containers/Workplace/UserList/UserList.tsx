import React from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import Avatar from '../../../widgets/Avatar';

import User from '../../../models/types/User';
import Invitation from '../../../models/types/Invitation';

interface IUserListProps {
    boardID?: string,
    handleSelectionChange: (arg1: string[]) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        buttonContainer: {
            border: '2px solid #f7f9fc',
            marginLeft: -10,
            borderRadius: '50%',

            '&:first-of-type': {
                marginLeft: 0
            },
            '&:hover': {
                zIndex: '100 !important'
            },
            '&.selected': {
                border: '2px solid ' + theme.palette.primary.light
            }
        },
        button: {
            width: 40,
            height: 40,
            minWidth: 40,
            minHeight: 40,
            margin: 0,
            borderRadius: '50%',
            boxShadow: 'none',
            zIndex: 0,

            '&:hover': {
                boxShadow: 'none'
            }
        }
    })
);

const UserList: React.FC<IUserListProps> = props => {
    const classes = useStyles();
    const [selectedUserIDs, setSelectedUserIDs] = React.useState<string[]>();

    const users: User[] = useSelector((state: any) => state.user.users);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);

    const filterUsers = (): User[] => {
        const gs = users.filter(g => {
            const inv = invitations.find(i => i.userID === g.id && i.boardID === props.boardID);
            return inv ? true : false;
        });

        return _.orderBy(gs, ["firstName"]);
    }

    const toggleSelection = (user: User) => {
        if (!selectedUserIDs) {
            const newArr = [user.id]
            setSelectedUserIDs(newArr);
            props.handleSelectionChange(newArr);
            return;
        }

        const ind = selectedUserIDs.findIndex(id => id === user.id);

        if (ind !== -1) {
            const newArr = [...selectedUserIDs];
            newArr.splice(ind, 1);
            setSelectedUserIDs(newArr);
            props.handleSelectionChange(newArr);
            return;
        }

        const newArr = [
            ...selectedUserIDs,
            user.id
        ];
        setSelectedUserIDs(newArr);
        props.handleSelectionChange(newArr);
    }

    if (!props.boardID) return null;

    const userList = filterUsers();
    
    return (
        <div className={classes.root}>
            {
                userList.map((user, index) =>
                    <Tooltip key={"user-list-" + user.id} title={user.displayName || ""}>
                        <div
                            className={[classes.buttonContainer,
                                selectedUserIDs?.includes(user.id) ? "selected" : ""].join(' ')}
                            style={{
                                zIndex: (userList.length - index)
                            }}
                        >
                            <Button
                                className={classes.button}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => toggleSelection(user)}
                            >
                                <Avatar
                                    size={40}
                                    account={user}
                                />
                            </Button>
                        </div>
                    </Tooltip>                    
                )
            }
        </div>
    );
};

export default UserList;