import React, { useRef, useState, useEffect } from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Avatar from '../../../../widgets/Avatar';

import Auxi from '../../../../hoc/Auxi';

import Task from '../../../../models/types/Task';
import User from '../../../../models/types/User';
import Invitation from '../../../../models/types/Invitation';

interface IAsigneeSelectorProps {
    task: Task,
    handleChange: (arg1: User) => void,
    fullScreen?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
            '& .MuiPopover-paper': {
                borderRadius: 0
            }
        },
        root: {
            overflow: 'hidden',
            flexGrow: 1,
            display: 'flex'
        },
        button: {
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            padding: "5px 0 5px 10px",
            borderRadius: 0,

            '& p': {
                fontSize: 14,
                fontWeight: 300,
                textAlign: 'left',
                marginLeft: 10,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },

            '& *': {
                fontWeight: 400
            }
        },
        listItem: {
            display: 'flex',

           '& p': {
               flexGrow: 1,
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               whiteSpace: 'nowrap'
           }
        }
    })
);

const AsigneeSelector: React.FC<IAsigneeSelectorProps> = props => {
    const classes = useStyles();

    const elemRef = useRef(null);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [listWidth, setListWidth] = useState<number>();

    useEffect(() => {
        if (!(elemRef && elemRef.current)) return;

        const elem: any = elemRef.current || {};

        setListWidth(elem.offsetWidth);
    }, [ elemRef, props.fullScreen ]);

    const account: User = useSelector((state: any) => state.app.account);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);
    const users: User[] = useSelector((state: any) => {
        return state.user.users.filter((user: User) => {
            if (user.id === account.id) return false;
            const invitation = invitations.find(i => i.boardID === props.task.boardID && i.userID === user.id);

            return Boolean(invitation);
        });
    });
    const asignee = useSelector((state: any) =>
        state.user.users.find((u: User) => u.id === props.task.asigneeID));

    const handlelistItemClick = (asignee: User) => {
        setAnchorEl(null);
        props.handleChange(asignee);
    }

    return (
        <Auxi>
            <div ref={elemRef} className={classes.root}>
                <Button
                    className={classes.button}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget);
                    }}
                >
                    {
                        asignee
                        ? <Avatar
                            size={30}
                            account={asignee}
                        />
                        : <Avatar
                            size={30}
                            account={{
                                color: "#ccc",
                                initials: "U"
                            } as User}
                        />
                    }
                    <Typography>{asignee?.displayName || 'Unassigned'}</Typography>
                </Button>
            </div>

            <Popover
                id="asignee-selector-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                className={classes.popover}
            >
                <List
                    style={{
                        width: !props.fullScreen ? (listWidth || 'auto') : 'auto',
                        maxWidth: props.fullScreen ? (listWidth || 'auto') : 'auto'
                    }}
                >
                    {
                        [account, ...(_.orderBy(users, ["firstName"]))].map((user, index) => {
                            const isSelected = props.task.asigneeID === user.id;

                            return isSelected
                                ? <ListItem
                                    key={"user-selector-" + user.id}
                                    className={classes.listItem}
                                    selected
                                >
                                    <ListItemIcon>
                                        <Avatar
                                            size={30}
                                            account={user}
                                        />
                                    </ListItemIcon>
                                    <Typography>{index === 0 ? "Assign to me" : user.displayName}</Typography>
                                </ListItem>
                                : <ListItem
                                    button
                                    className={classes.listItem}
                                    key={"user-selector-" + user.id}
                                    onClick={() => handlelistItemClick(user)}
                                >
                                    <ListItemIcon>
                                        <Avatar
                                            size={30}
                                            account={user}
                                        />
                                    </ListItemIcon>
                                    <Typography>{index === 0 ? "Assign to me" : user.displayName}</Typography>
                                </ListItem>;
                        })
                    }
                </List>
            </Popover>
        </Auxi>
    );
}

export default AsigneeSelector;