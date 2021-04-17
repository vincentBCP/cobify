import React from 'react';
import _ from 'lodash';

import { useSelector, connect } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import Avatar from '../../../widgets/Avatar';

import User from '../../../models/types/User';
import Invitation from '../../../models/types/Invitation';
import InvitationDTO from '../../../models/dto/InvitationDTO';

import * as actions from '../../../store/actions';

interface IUserListProps {
    boardID?: string,
    deleteInvitation: (arg1: string) => Promise<any>,
    sendInvitation: (arg1: InvitationDTO) => Promise<any>
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
        },
        popover: {
            marginTop: 7
        },
        userList: {
            minWidth: 100
        },
        userListItem : {
            paddingTop: 10,
            paddingBottom: 10
        },
        userName: {
            marginRight: 15, 
            flexGrow: 1, 
            textAlign: 'right', 
            overflow: 'nowrap', 
            textOverflow: 'nowrap'
        }
    })
);

const UserList: React.FC<IUserListProps> = props => {
    const classes = useStyles();

    const [selectedUser, setSelectedUser] = React.useState<User>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [add, setAdd] = React.useState(false);

    const users: User[] = useSelector((state: any) => state.user.users);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);

    const filterUsers = (): User[] => {
        const gs = users.filter(g => {
            const inv = invitations.find(i => i.userID === g.id && i.boardID === props.boardID);
            return inv ? true : false;
        });

        return _.orderBy(gs, ["firstName"]);
    }

    const getAvailableUsers = (): User[] => {
        const gs = users.filter(g => {
            const inv = invitations.find(i => i.userID === g.id && i.boardID === props.boardID);
            return inv ? false : true;
        })

        return _.orderBy(gs, ["firstName"]);
    }

    const handleRemove = () => {
        setAnchorEl(null);

        const invitation = invitations.find(i => i.userID === selectedUser?.id && i.boardID === props.boardID);

        if (!invitation) return;

        props.deleteInvitation(invitation.id);
    };

    const handleAdd = (userID: string) => {
        setAnchorEl(null);

        props.sendInvitation({
            userID: userID,
            boardID: props.boardID
        } as InvitationDTO);
    }

    if (!props.boardID) return null;
    
    return (
        <div className={classes.root}>
            <Popover
                id="user-list-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: add ? 'right' : 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: add ? 'right' : 'center',
                }}
                className={classes.popover}
            >
                {!add ? <ListItem
                    button
                    onClick={handleRemove}
                >
                    Remove
                </ListItem> : null}

                {add ? <List className={classes.userList}>
                    {getAvailableUsers().map(user =>
                        <ListItem
                            key={"add-user-" + user.id}
                            button
                            onClick={() => handleAdd(user.id)}
                            className={classes.userListItem}
                        >
                            <Typography className={classes.userName}>{user.firstName + " " + user.lastName}</Typography>
                            <ListItemSecondaryAction>
                                <Avatar
                                    initials={user.initials}
                                    color={user.color}
                                    size={32}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </List> : null}
            </Popover>

            {
                filterUsers().map(user =>
                    <Button
                        key={"user-list-" + user.id}
                        className={classes.button}
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            setAdd(false);
                            setAnchorEl(event.currentTarget);
                            setSelectedUser(user);
                        }}
                    >
                        <Avatar
                            size={32}
                            initials={user.initials}
                            
                            color={user.color}
                        />
                    </Button>
                )
            }

            <Button
                className={classes.button}
                variant="contained"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    setAnchorEl(event.currentTarget);
                    setAdd(true);
                }}
            >
                <AddIcon />
            </Button>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id)),
        sendInvitation: (dto: InvitationDTO) => dispatch(actions.sendInvitation(dto))
    }
};

export default connect(null, mapDispatchToProps)(UserList);