import React from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import Avatar from '../../../widgets/Avatar';

import User from '../../../models/types/User';
import Invitation from '../../../models/types/Invitation';

interface IUserListProps {
    boardID?: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        button: {
            width: 30,
            height: 32,
            minWidth: 30,
            minHeight: 32,
            margin: 0,
            marginLeft: 5,
            borderRadius: '50%',
            boxShadow: 'none',
            '&:hover': {
                boxShadow: 'none'
            }
        }
    })
);

const UserList: React.FC<IUserListProps> = props => {
    const classes = useStyles();

    const users: User[] = useSelector((state: any) => state.user.users);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);

    const filterUsers = (): User[] => {
        const gs = users.filter(g => {
            const inv = invitations.find(i => i.userID === g.id && i.boardID === props.boardID);
            return inv ? true : false;
        });

        return _.orderBy(gs, ["firstName"]);
    }

    if (!props.boardID) return null;
    
    return (
        <div className={classes.root}>
            {
                filterUsers().map(user =>
                    <Button
                        key={"user-list-" + user.id}
                        className={classes.button}
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                    >
                        <Avatar
                            size={32}
                            account={user}
                        />
                    </Button>
                )
            }
        </div>
    );
};

export default UserList;