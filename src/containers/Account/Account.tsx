import React from 'react';

import { Theme, makeStyles, createStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import './Account.scss';

import PublicInfo from './PublicInfo';

import Auxi from '../../hoc/Auxi';
import Header from '../../components/Header';

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

    return (
        <Auxi>
            <Header title="Account" />

            <Paper id="AccountPage" className={classes.root} elevation={0}>
                <PublicInfo />
            </Paper>
        </Auxi>
    );
};

export default Account;