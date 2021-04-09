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

import Guest from '../../../models/types/Guest';
import Invitation from '../../../models/types/Invitation';
import InvitationDTO from '../../../models/dto/InvitationDTO';

import * as actions from '../../../store/actions';

interface IGuestListProps {
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
        guestList: {
            minWidth: 100
        },
        guestListItem : {
            paddingTop: 10,
            paddingBottom: 10
        },
        guestName: {
            marginRight: 15, 
            flexGrow: 1, 
            textAlign: 'right', 
            overflow: 'nowrap', 
            textOverflow: 'nowrap'
        }
    })
);

const GuestList: React.FC<IGuestListProps> = props => {
    const classes = useStyles();

    const [selectedGuest, setSelectedGuest] = React.useState<Guest>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [add, setAdd] = React.useState(false);

    const guests: Guest[] = useSelector((state: any) => state.guest.guests);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);

    const filterGuests = (): Guest[] => {
        const gs = guests.filter(g => {
            const inv = invitations.find(i => i.guestID === g.id && i.boardID === props.boardID);
            return inv ? true : false;
        });

        return _.orderBy(gs, ["firstName"]);
    }

    const getAvailableGuests = (): Guest[] => {
        const gs = guests.filter(g => {
            const inv = invitations.find(i => i.guestID === g.id && i.boardID === props.boardID);
            return inv ? false : true;
        })

        return _.orderBy(gs, ["firstName"]);
    }

    const handleRemove = () => {
        setAnchorEl(null);

        const invitation = invitations.find(i => i.guestID === selectedGuest?.id && i.boardID === props.boardID);

        if (!invitation) return;

        props.deleteInvitation(invitation.id);
    };

    const handleAdd = (guestID: string) => {
        setAnchorEl(null);

        props.sendInvitation({
            guestID: guestID,
            boardID: props.boardID
        } as InvitationDTO);
    }

    if (!props.boardID) return null;
    
    return (
        <div className={classes.root}>
            <Popover
                id="guest-list-popup"
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

                {add ? <List className={classes.guestList}>
                    {getAvailableGuests().map(guest =>
                        <ListItem
                            key={"add-guest-" + guest.id}
                            button
                            onClick={() => handleAdd(guest.id)}
                            className={classes.guestListItem}
                        >
                            <Typography className={classes.guestName}>{guest.firstName + " " + guest.lastName}</Typography>
                            <ListItemSecondaryAction>
                                <Avatar
                                    initials={guest.initials}
                                    color={guest.color}
                                    size={32}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </List> : null}
            </Popover>

            {
                filterGuests().map(guest =>
                    <Button
                        key={"guest-list-" + guest.id}
                        className={classes.button}
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            setAdd(false);
                            setAnchorEl(event.currentTarget);
                            setSelectedGuest(guest);
                        }}
                    >
                        <Avatar
                            size={32}
                            initials={guest.initials}
                            
                            color={guest.color}
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

export default connect(null, mapDispatchToProps)(GuestList);