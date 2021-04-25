import React from 'react';
import _ from 'lodash';

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
            marginTop: 10,
            marginLeft: -10,

            '& .MuiPopover-paper': {
                width: 320,
                maxHeight: 'calc(100vh * .70)',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.05)'
            }
        },
        root: {
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
        accountList: {
            borderTop: '1px solid rgba(0,0,0,0.1)',
            
            '& > div.selected': {
                backgroundColor: '#f7f9fc'
            },
            '& > div:not(.selected):hover': {
                cursor: 'pointer',
                backgroundColor: '#f7f9fc'
            },
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                padding: '12px 30px'
            },
            '& > div > div:last-of-type': {
                marginLeft: 10,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            },
            '& > div div p': {
                fontSize: '1.2em',
                flexGrow: 1,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.2em',
                color: '#3c4043'
            },
            '& > div div p:nth-of-type(2)': {
                fontSize: '0.9em',
                color: "#5f6368"
            }
        }
    })
);

const OrganizationSelector: React.FC = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const account: User = useSelector((state: any) => state.app.account);
    const users: User[] = useSelector((state: any) => state.user.users);
    const userAccounts: User[] = users.filter(u => u.email === account.email);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleChooseAccount = (account: User) => {
        localStorage.setItem("account", account.id);
        window.location.reload();
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
                        {/*<Typography>{account.role}</Typography>*/}
                    </div>
                    <div className={classes.accountList}>
                        {
                            _.orderBy(userAccounts, ["role"]).map(uAccount => {
                                const adminAccount = uAccount.organization
                                    ? uAccount
                                    : users.find(u => u.id === uAccount.accountID);
                                
                                if (!adminAccount) return null;

                                return (
                                    <div
                                        key={"user-account-" + uAccount.id}
                                        className={uAccount.id === account.id ? "selected" : ""}
                                        onClick={() => {
                                            if (uAccount.id === account.id) return;
                                            handleChooseAccount(uAccount);
                                        }}
                                    >
                                        <Avatar
                                            size={38}
                                            account={{
                                                color: adminAccount.color,
                                                initials: adminAccount.organization?.charAt(0)
                                            } as User}
                                        />
                                        <div>
                                            <Typography>{adminAccount.organization}</Typography>
                                            <Typography>{uAccount.role}</Typography>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Paper>
            </Popover>
        </Auxi>
    )
}

export default OrganizationSelector;