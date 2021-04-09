import React from 'react';

import { useSelector, connect } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Popover from '@material-ui/core/Popover';
import ListItem from '@material-ui/core/ListItem';

import Avatar from '../../../widgets/Avatar';

import Guest from '../../../models/types/Guest';
import Invitation from '../../../models/types/Invitation';

import * as actions from '../../../store/actions';

interface IGuestListProps {
    boardID?: string,
    deleteInvitation: (arg1: string) => Promise<any>,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

const GuestList: React.FC<IGuestListProps> = props => {
    const classes = useStyles();

    const [selectedGuest, setSelectedGuest] = React.useState<Guest>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const guests: Guest[] = useSelector((state: any) => state.guest.guests);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);

    const filterGuests = (): Guest[] => {
        return guests.filter(g => {
            const inv = invitations.find(i => i.guestID === g.id && i.boardID === props.boardID);
            return inv ? true : false;
        })
    }

    const handleRemove = () => {
        setAnchorEl(null);
        
        const invitation = invitations.find(i => i.guestID === selectedGuest?.id && i.boardID === props.boardID);

        if (!invitation) return;

        props.deleteInvitation(invitation.id);
    };

    if (!props.boardID) return null;
    
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Popover
                id="board-selector-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                style={{marginTop: 5}}
            >
                <ListItem
                    button
                    onClick={handleRemove}
                >
                    Remove
                </ListItem>
            </Popover>
            {
                filterGuests().map(guest =>
                    <Button
                        key={"guest-list-" + guest.id}
                        className={classes.button}
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            setAnchorEl(event.currentTarget);
                            setSelectedGuest(guest);
                        }}
                    >
                        <Avatar
                            size={32}
                            initials={
                                ((guest.firstName || '').charAt(0).toUpperCase() + 
                                (guest.lastName || '').charAt(0)).toUpperCase()
                            }
                            
                            color={guest.color}
                        />
                    </Button>
                )
            }
            <Button className={classes.button} variant="contained">
                <AddIcon />
            </Button>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteInvitation: (id: string) => dispatch(actions.deleteInvitation(id))
    }
};

export default connect(null, mapDispatchToProps)(GuestList);