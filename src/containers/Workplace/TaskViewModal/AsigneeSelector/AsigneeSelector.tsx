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
import Guest from '../../../../models/types/Guest';

interface IAsigneeSelectorProps {
    task: Task
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
            '& .MuiPopover-paper': {
                borderRadius: 0
            }
        },
        root: {
            display: 'flex',
            flexGrow: 1
        },
        button: {
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            padding: "5px 10px",
            borderRadius: 0,
            overflow: 'hidden',

            '& p': {
                flexGrow: 1,
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
    }, [ elemRef ]);

    const guests: Guest[] = useSelector((state: any) => state.guest.guests);
    const asignee = guests.find(g => g.id === props.task.asigneeID);

    const handlelistItemClick = (asignee: Guest) => {
        setAnchorEl(null);
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
                    <Avatar
                        color="#ccc"
                        initials="U"
                        size={30}
                    />
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
                        width: listWidth || 'auto'
                    }}
                >
                    {
                        (_.orderBy(guests, ["firstName"])).map(guest => {
                            const isSelected = props.task.asigneeID === guest.id;

                            return isSelected
                                ? <ListItem
                                    key={"guest-selector-" + guest.id}
                                    selected
                                >
                                    <ListItemIcon>
                                        <Avatar
                                            color={guest.color}
                                            initials={guest.initials}
                                            size={30}
                                        />
                                    </ListItemIcon>
                                    <Typography>{guest.displayName}</Typography>
                                </ListItem>
                                : <ListItem
                                    button
                                    key={"guest-selector-" + guest.id}
                                    onClick={() => handlelistItemClick(guest)}
                                >
                                    <ListItemIcon>
                                        <Avatar
                                            color={guest.color}
                                            initials={guest.initials}
                                            size={30}
                                        />
                                    </ListItemIcon>
                                    <Typography>{guest.displayName}</Typography>
                                </ListItem>;
                        })
                    }
                </List>
            </Popover>
        </Auxi>
    );
}

export default AsigneeSelector;