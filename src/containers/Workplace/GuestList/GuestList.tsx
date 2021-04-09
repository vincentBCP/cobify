import React from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Avatar from '../../../widgets/Avatar';

import Guest from '../../../models/types/Guest';
import Invitation from '../../../models/types/Invitation';

interface IGuestListProps {
    boardID?: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            width: 30,
            height: 32,
            minWidth: 30,
            minHeight: 32,
            margin: 0,
            marginLeft: 4,
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

    const guests: Guest[] = useSelector((state: any) => state.guest.guests);
    const invitations: Invitation[] = useSelector((state: any) => state.invitation.invitations);

    const filterGuests = (): Guest[] => {
        return guests.filter(g => {
            const inv = invitations.find(i => i.guestID === g.id && i.boardID === props.boardID);
            return inv ? true : false;
        })
    }

    if (!props.boardID) return null;
    
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {
                filterGuests().map(guest =>
                    <div key={"guest-list-" + guest.id} style={{marginLeft: 4}}>
                        <Avatar
                            size={32}
                            initials={
                                ((guest.firstName || '').charAt(0).toUpperCase() + 
                                (guest.lastName || '').charAt(0)).toUpperCase()
                            }
                            
                            color={guest.color}
                        />
                    </div>
                )
            }
            <Button className={classes.button} variant="contained">
                <AddIcon />
            </Button>
        </div>
    );
};

export default GuestList;