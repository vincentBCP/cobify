import React from 'react';

import { createStyles, makeStyles, Theme, withStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/NotificationsNoneOutlined';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';

import { useSelector } from 'react-redux';

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            right: 8,
            top: 6,
            border: 'none',
            padding: 0,
            width: 22,
            height: 22,
            borderRadius: 11,
            fontSize: 12
        },
    }),
)(Badge);

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        appBar: {
            backgroundColor: 'white',
            padding: 2,
            boxShadow: 'none'
        },
        title: {
            color: 'rgb(158 158 158)',
            flexGrow: 1,
            fontWeight: 'bold'
        },
        icon: {
            color: '#9e9e9e',
            fontSize: 30
        },
        avatar: {
            width: 30,
            height: 30,
            fontSize: 14
        }
    })
);

interface IHeaderProps {
    title: string
};

const Header: React.FC<IHeaderProps> = props => {
    const theme = useTheme();
    const classes = useStyles();

    const user = useSelector((state: any) => state.app.user);

    if (!user) return null;

    const getInitials = () => {
        return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    };

    return (
        <AppBar id="Header" position="static" className={classes.appBar}>
            <Toolbar>
                <Typography className={classes.title} variant="h6">{props.title}</Typography>

                <Tooltip title="Notifications">
                    <IconButton>
                        <StyledBadge badgeContent={4} color="primary">
                            <NotificationIcon className={classes.icon} />
                        </StyledBadge>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Account">
                    <IconButton>
                        <Avatar
                            className={classes.avatar}
                            style={{
                                backgroundColor: user.color ? user.color : deepPurple[500],
                                color: theme.palette.getContrastText(user.color ? user.color : deepPurple[500])
                            }}
                        >
                            {getInitials()}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default Header;