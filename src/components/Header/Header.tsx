import React from 'react';
import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/NotificationsNoneOutlined';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Avatar from '../../widgets/Avatar';

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
        }
    })
);

interface IHeaderProps {
    title: string
};

const Header: React.FC<IHeaderProps> = props => {
    const classes = useStyles();

    const user = useSelector((state: any) => state.app.user);

    if (!user) return null;

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
                            size="sm"
                            firstName={user.firstName}
                            lastName={user.lastName}
                            color={user.color}
                        />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default Header;