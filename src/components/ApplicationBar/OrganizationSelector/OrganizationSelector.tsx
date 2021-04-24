import React from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import Auxi from '../../../hoc/Auxi';
import Avatar from '../../../widgets/Avatar';

import User from '../../../models/types/User';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        popover: {
            marginTop: 20,
            marginLeft: -10,

            '& .MuiPopover-paper': {
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.05)'
            }
        },
        root: {
            width: 320,
        },
        account: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px 0 20px 0',

            '& p:nth-of-type(1)': {
                marginTop: 10,
                fontSize: '1.3em'
            },
            '& p:nth-of-type(2)': {
                color: "#5f6368",
                fontSize: '1em'
            },
            '& p:nth-of-type(3)': {
                fontSize: '1em',
                width: '70%',
                textAlign: 'center',
                marginTop: 20,
                padding: '7px 10px',
                border: '1px solid #eee',
                color: theme.palette.primary.main,
                borderRadius: 20
            }
        },
        action: {
            borderTop: '1px solid #ccc',
            padding: "15px 50px",

            '& button': {
                color: '#5f6368'
            }
        }
    })
);

const OrganizationSelector: React.FC = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const account: User = useSelector((state: any) => state.app.account);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <Auxi>
            <Tooltip title="Account">
                <IconButton onClick={handleClick}>
                    <Avatar
                        size={30}
                        account={account}
                    />
                </IconButton>
            </Tooltip>

            <Popover
                id="organization-selector-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                className={classes.popover}
            >
                <Paper className={classes.root}>
                    <div className={classes.account}>
                        <Avatar
                            size={100}
                            account={account}
                        />
                        <Typography>{account.displayName}</Typography>
                        <Typography>{account.email}</Typography>
                        <Typography>{account.role}</Typography>
                    </div>
                </Paper>
            </Popover>
        </Auxi>
    )
}

export default OrganizationSelector;