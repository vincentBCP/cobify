import React from 'react';
import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/NotificationsNoneOutlined';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import Avatar from '../../widgets/Avatar';

import { SIDE_NAVIGATION_WIDTH } from '../SideNavigation/SideNavigation';

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            right: 6,
            top: 2,
            border: 'none',
            padding: 0,
            width: 22,
            height: 22,
            borderRadius: 11,
            fontSize: 12,
            backgroundColor: "#407ad6",
            color: "white"
        },
    }),
)(Badge);

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        appBar: {
            backgroundColor: 'white',
            padding: 2,
            boxShadow: 'none',
            paddingLeft: SIDE_NAVIGATION_WIDTH
        },
        icon: {
            color: '#9e9e9e',
            fontSize: 30
        }
    })
);

interface IHeaderProps {
    title: string,
    component?: JSX.Element
};

const ApplicationBar: React.FC<IHeaderProps> = props => {
    const classes = useStyles();

    const account = useSelector((state: any) => state.app.account);

    if (!account) return null;

    return (
        <AppBar id="Header" position="fixed" className={classes.appBar}>
            <Toolbar>
                <div style={{flexGrow: 1}}>
                    {props.component}
                </div>
                <Tooltip title="Notifications">
                    <IconButton>
                        <StyledBadge badgeContent={4}>
                            <NotificationIcon className={classes.icon} />
                        </StyledBadge>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Account">
                    <IconButton>
                        <Avatar
                            size={30}
                            account={account}
                        />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default ApplicationBar;