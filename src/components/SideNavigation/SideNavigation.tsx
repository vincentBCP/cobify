import React from 'react';
import clsx from 'clsx';

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import WorkIcon from '@material-ui/icons/Work';
import AccountIcon from '@material-ui/icons/AccountCircle';
import BoardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/PeopleAlt';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import ExitToApp from '@material-ui/icons/ExitToApp';

import Logo from '../../widgets/Logo';

import logoPng from '../../assets/logo.png';

import './SideNavigation.scss';

import UserRole from '../../models/enums/UserRole';

import AppContext from '../../context/appContext';

export const SIDE_NAVIGATION_WIDTH = 240;
export const SHRINK_SIDE_NAVIGATION_WIDTH = 70;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: SIDE_NAVIGATION_WIDTH,
            flexShrink: 0,
            zIndex: 999
        },
        drawerPaper: {
            backgroundColor: '#233044',
            width: SIDE_NAVIGATION_WIDTH,
        },
        drawerOpen: {
            width: SIDE_NAVIGATION_WIDTH,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: SHRINK_SIDE_NAVIGATION_WIDTH
        },
        listItemIcon: {
            marginRight: 2
        },
        drawerItemIcon: {
            color: '#777f8a'
        },
        drawerItemText: {
            color: '#c5c8cc',
            margin: 0
        },
        extras: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        }
    }),
);

const SideNavigation: React.FC = props => {
    const classes = useStyles();

    const appContext = React.useContext(AppContext);

    const account = useSelector((state: any) => state.app.account);

    return (
        <Drawer
            id="SideNavigation"
            variant="persistent"
            anchor="left"
            open={true}
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: !appContext.shrinkNavigation,
                [classes.drawerClose]: appContext.shrinkNavigation,
            })}
            classes={{
                paper: clsx(classes.drawerPaper, {
                    [classes.drawerOpen]: !appContext.shrinkNavigation,
                    [classes.drawerClose]: appContext.shrinkNavigation,
                }),
            }}
        >
            <div id="SideNavigation_Header">
                {
                    !appContext.shrinkNavigation
                    ? <Logo />
                    : <img src={logoPng} alt="logo" />
                }
            </div>

            <div id="SideNavigation_Items">
                {
                    account.role === UserRole.SYSADMIN 
                    ? <Tooltip
                        title="Accounts"
                        placement="right"
                        disableFocusListener
                        disableTouchListener
                        disableHoverListener={!appContext.shrinkNavigation}
                    >
                        <NavLink to="/accounts" activeClassName="active">
                            <ListItem key="Accounts">
                                <ListItemIcon className={classes.listItemIcon}>
                                    <PeopleIcon className={classes.drawerItemIcon} />
                                </ListItemIcon>
                                <ListItemText className={classes.drawerItemText} primary="Accounts" />
                            </ListItem>
                        </NavLink>
                    </Tooltip>
                    : null
                }

                {
                    account.role === UserRole.SYSADMIN 
                    ? <Tooltip
                        title="Logout"
                        placement="right"
                        disableFocusListener
                        disableTouchListener
                        disableHoverListener={!appContext.shrinkNavigation}
                    >
                        <NavLink to="/logout" activeClassName="active">
                            <ListItem key="Logout">
                                <ListItemIcon className={classes.listItemIcon}>
                                    <ExitToApp className={classes.drawerItemIcon} />
                                </ListItemIcon>
                                <ListItemText className={classes.drawerItemText} primary="Logout" />
                            </ListItem>
                        </NavLink>
                    </Tooltip>
                    : null
                }

                {
                    account.role === UserRole.ADMIN || 
                    account.role === UserRole.COADMIN || 
                    account.role === UserRole.GUEST
                    ? <Tooltip
                        title="Workplace"
                        placement="right"
                        disableFocusListener
                        disableTouchListener
                        disableHoverListener={!appContext.shrinkNavigation}
                    >
                        <NavLink to="/workplace" activeClassName="active">
                            <ListItem key="Workplace">
                                <ListItemIcon className={classes.listItemIcon}>
                                    <WorkIcon className={classes.drawerItemIcon} />
                                </ListItemIcon>
                                <ListItemText className={classes.drawerItemText} primary="Workplace" />
                            </ListItem>
                        </NavLink>
                    </Tooltip>
                    : null
                }

                {
                    account.role === UserRole.ADMIN || 
                    account.role === UserRole.COADMIN || 
                    account.role === UserRole.GUEST
                    ? <Tooltip
                        title="Profile"
                        placement="right"
                        disableFocusListener
                        disableTouchListener
                        disableHoverListener={!appContext.shrinkNavigation}
                    >
                        <NavLink to="/profile" activeClassName="active">
                            <ListItem key="profile">
                                <ListItemIcon className={classes.listItemIcon}>
                                    <AccountIcon className={classes.drawerItemIcon} />
                                </ListItemIcon>
                                <ListItemText className={classes.drawerItemText} primary="Profile" />
                            </ListItem>
                        </NavLink>
                    </Tooltip>
                    : null
                }
                
                {
                    account.role === UserRole.ADMIN
                    ? <Tooltip
                        title="Boards"
                        placement="right"
                        disableFocusListener
                        disableTouchListener
                        disableHoverListener={!appContext.shrinkNavigation}
                    >
                        <NavLink to="/boards" activeClassName="active">
                            <ListItem key="Boards">
                            <ListItemIcon className={classes.listItemIcon}>
                                <BoardIcon className={classes.drawerItemIcon} />
                            </ListItemIcon>
                            <ListItemText className={classes.drawerItemText} primary="Boards" />
                            </ListItem>
                        </NavLink>
                    </Tooltip>
                    : null
                }

                {
                    account.role === UserRole.ADMIN
                    ? <Tooltip
                        title="Users"
                        placement="right"
                        disableFocusListener
                        disableTouchListener
                        disableHoverListener={!appContext.shrinkNavigation}
                    >
                        <NavLink to="/users" activeClassName="active">
                            <ListItem key="users">
                                <ListItemIcon className={classes.listItemIcon}>
                                    <PeopleIcon className={classes.drawerItemIcon} />
                                </ListItemIcon>
                                <ListItemText className={classes.drawerItemText} primary="Users" />
                            </ListItem>
                        </NavLink>
                    </Tooltip>
                    : null
                }
                {
                    appContext.shrinkNavigation && account.role !== UserRole.SYSADMIN
                    ? <div className={classes.extras}>
                        <span style={{flexGrow: 1}}></span>
                        <Tooltip
                            title="Contact support"
                            placement="right"
                            disableFocusListener
                            disableTouchListener
                        >
                            <NavLink to="/contactSupport">
                                <ListItem key="support">
                                    <ListItemIcon className={classes.listItemIcon}>
                                        <ContactSupportIcon className={classes.drawerItemText} />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                        </Tooltip>
                        <Tooltip
                            title="Logout"
                            placement="right"
                            disableFocusListener
                            disableTouchListener
                        >
                            <NavLink to="/logout">
                                <ListItem key="logout">
                                    <ListItemIcon className={classes.listItemIcon}>
                                        <PowerIcon className={classes.drawerItemText} />
                                    </ListItemIcon>
                                </ListItem>
                            </NavLink>
                        </Tooltip>
                    </div>
                    : null
                }
            </div>

            {
                !appContext.shrinkNavigation && account.role !== UserRole.SYSADMIN
                ? <footer id="SideNavigation_Footer">
                    <Tooltip title="Contact support">
                        <NavLink to="/contactSupport">
                            <ContactSupportIcon className={classes.drawerItemText} />
                        </NavLink>
                    </Tooltip>

                    <Tooltip title="Logout">
                        <NavLink to="/logout">
                            <PowerIcon className={classes.drawerItemText} />
                        </NavLink>
                    </Tooltip>
                </footer>
                : null
            }
        </Drawer>
    );
};

export default SideNavigation;