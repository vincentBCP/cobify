import React from 'react';
import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';

import OrganizationSelector from './OrganizationSelector';
import Notifications from './Notifications';

import { SIDE_NAVIGATION_WIDTH, SHRINK_SIDE_NAVIGATION_WIDTH } from '../SideNavigation/SideNavigation';

import AppContext, { SCREEN_SIZE } from '../../context/appContext';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        appBar: {
            backgroundColor: 'white',
            boxShadow: 'none',
            zIndex: 1000,
            padding: '0 10px 0 25px',

            '&.sm, &.md': {
                zIndex: 998,
                padding: 0
            }
        },
        appBarOpen: {
            width: 'calc(100vw - ' + SIDE_NAVIGATION_WIDTH + 'px)',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        appBarClose: {
            width: 'calc(100vw - ' + SHRINK_SIDE_NAVIGATION_WIDTH + 'px)',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        appBarShow: {
            width: 'calc(100vw - ' + SIDE_NAVIGATION_WIDTH + 'px)',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        appBarHide: {
            width: 'calc(100vw)',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        toolbar: {
            margin: 0,
            padding: '0 25px 0 25px',
            display: 'flex',

            '&.sm, &.md': {
                padding: '0 0 0 10px'
            }
        },
        component: {
            flexGrow: 1,
            overflow: 'hidden'
        },
        menu: {
            color: '#233044',
            width: 30,
            height: 30,
            marginRight: 10
        },
        arrow: {
            width: 25,
            height: 25,
            backgroundColor: '#233044',
            cursor: 'pointer',
            borderRadius: '50%',
            position: 'absolute',
            left: -40,

            '& svg': {
                width: 25,
                height: 25,
                color: '#ccc', 
            }
        }
    })
);

interface IHeaderProps {
    title: string,
    component?: JSX.Element
};

const ApplicationBar: React.FC<IHeaderProps> = props => {
    const classes = useStyles();

    const appContext = React.useContext(AppContext);

    return (
        <AppBar
            id="Header"
            position="fixed"
            className={clsx(classes.appBar, appContext.screenSize, {
                [classes.appBarOpen]: !appContext.shrinkNavigation && appContext.screenSize === SCREEN_SIZE.lg,
                [classes.appBarClose]: appContext.shrinkNavigation && appContext.screenSize === SCREEN_SIZE.lg,
                [classes.appBarShow]: !appContext.shrinkNavigation && appContext.screenSize !== SCREEN_SIZE.lg,
                [classes.appBarHide]: appContext.shrinkNavigation && appContext.screenSize !== SCREEN_SIZE.lg,
            })}
        >
            <Toolbar className={[classes.toolbar, appContext.screenSize].join(' ')}>
                {
                    appContext.screenSize !== SCREEN_SIZE.lg
                    ? <MenuIcon
                        className={classes.menu}
                        onClick={() => appContext.toggleNavigation()}
                    />
                    : <div
                        className={classes.arrow}
                        onClick={() => appContext.toggleNavigation()}
                    >
                        { appContext.shrinkNavigation ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                    </div>
                }

                <div className={classes.component}>
                    {props.component}
                </div>
                <Notifications />
                <OrganizationSelector />
            </Toolbar>
        </AppBar>
    );
};

export default ApplicationBar;