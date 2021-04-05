import React from 'react';
import { useSelector } from 'react-redux';

import { Theme, makeStyles, createStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import './Account.scss';

import Auxi from '../../hoc/Auxi';
import Header from '../../components/Header';

import PublicInfo from './PublicInfo';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            borderRadius: 0,
            backgroundColor: 'transparent',
            padding: '30px 50px',
            border: 'none'
        }
    })
);

const Account: React.FC = props => {
    const classes = useStyles();

    const user: any = useSelector((state: any) => state.app.user);

    return (
        <Auxi>
            <Header title="Account" />

            <Paper id="AccountPage" className={classes.root} elevation={0}>
                <PublicInfo user={user} />
            </Paper>
        </Auxi>
    );
};

export default Account;