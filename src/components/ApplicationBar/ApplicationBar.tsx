import React from 'react';
import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import OrganizationSelector from './OrganizationSelector';
import Notifications from './Notifications';

import { SIDE_NAVIGATION_WIDTH, SHRINK_SIDE_NAVIGATION_WIDTH } from '../SideNavigation/SideNavigation';

import AppContext from '../../context/appContext';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        appBar: {
            backgroundColor: 'white',
            boxShadow: 'none',
            zIndex: 1000,
            paddingTop: 2,
            paddingLeft: 25,
            paddingRight: 10
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
        arrow: {
            width: 25,
            height: 25,
            backgroundColor: '#233044',
            cursor: 'pointer',
            borderRadius: '50%',
            position: 'absolute',
            left: -40,

            '& svg': {
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
            className={clsx(classes.appBar, {
                [classes.appBarOpen]: !appContext.shrinkNavigation,
                [classes.appBarClose]: appContext.shrinkNavigation,
            })}
        >
            <Toolbar>
                {
                    <div
                        className={classes.arrow}
                        onClick={() => appContext.toggleNavigation()}
                    >
                        { appContext.shrinkNavigation ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                    </div>
                }

                <div style={{flexGrow: 1}}>
                    {props.component}
                </div>
                <Notifications />
                <OrganizationSelector />
            </Toolbar>
        </AppBar>
    );
};

export default ApplicationBar;