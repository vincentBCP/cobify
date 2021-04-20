import React from 'react';

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

import Logo from '../../widgets/Logo';

import './SideNavigation.scss';

import UserRole from '../../models/enums/UserRole';

export const SIDE_NAVIGATION_WIDTH = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: SIDE_NAVIGATION_WIDTH,
            flexShrink: 0
        },
        drawerPaper: {
            backgroundColor: '#233044',
            width: SIDE_NAVIGATION_WIDTH,
        },
        drawerItemIcon: {
            color: '#777f8a'
        },
        drawerItemText: {
            color: '#c5c8cc'
        }
    }),
);

const SideNavigation: React.FC = props => {
    const classes = useStyles();

    const account = useSelector((state: any) => state.app.account);

    return (
        <Drawer
            id="SideNavigation"
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={true}
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <div id="SideNavigation_Header">
                <Logo />
            </div>

            <div id="SideNavigation_Items">
                {
                    account.role === UserRole.SYSADMIN 
                    ? <NavLink to="/accounts" activeClassName="active">
                        <ListItem key="Accounts">
                            <ListItemIcon>
                                <PeopleIcon className={classes.drawerItemIcon} />
                            </ListItemIcon>
                            <ListItemText className={classes.drawerItemText} primary="Accounts" />
                        </ListItem>
                    </NavLink>
                    : null
                }

                {
                    account.role === UserRole.ADMIN || 
                    account.role === UserRole.COADMIN || 
                    account.role === UserRole.GUEST
                    ? <NavLink to="/workplace" activeClassName="active">
                        <ListItem key="Workplace">
                            <ListItemIcon>
                                <WorkIcon className={classes.drawerItemIcon} />
                            </ListItemIcon>
                            <ListItemText className={classes.drawerItemText} primary="Workplace" />
                        </ListItem>
                    </NavLink>
                    : null
                }

                {
                    account.role === UserRole.ADMIN || 
                    account.role === UserRole.COADMIN || 
                    account.role === UserRole.GUEST
                    ? <NavLink to="/account" activeClassName="active">
                        <ListItem key="Account">
                            <ListItemIcon>
                                <AccountIcon className={classes.drawerItemIcon} />
                            </ListItemIcon>
                            <ListItemText className={classes.drawerItemText} primary="Account" />
                        </ListItem>
                    </NavLink>
                    : null
                }
                
                {
                    account.role === UserRole.ADMIN
                    ? <NavLink to="/boards" activeClassName="active">
                        <ListItem key="Boards">
                        <ListItemIcon>
                            <BoardIcon className={classes.drawerItemIcon} />
                        </ListItemIcon>
                        <ListItemText className={classes.drawerItemText} primary="Boards" />
                        </ListItem>
                    </NavLink>
                    : null
                }

                {
                    account.role === UserRole.ADMIN
                    ? <NavLink to="/users" activeClassName="active">
                        <ListItem key="users">
                        <ListItemIcon>
                            <PeopleIcon className={classes.drawerItemIcon} />
                        </ListItemIcon>
                        <ListItemText className={classes.drawerItemText} primary="Users" />
                        </ListItem>
                    </NavLink>
                    : null
                }
            </div>
            
            <footer id="SideNavigation_Footer">
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
        </Drawer>
    );
};

export default SideNavigation;