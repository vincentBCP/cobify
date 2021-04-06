import React from 'react';

import { Theme, makeStyles, createStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import PageHeader from './PageHeader';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            borderRadius: 0,
            backgroundColor: 'transparent',
            padding: '0 50px 30px 50px',
            border: 'none'
        }
    })
);

interface IPageProps {
    title: string
};

const Page: React.FC<IPageProps> = props => {
    const classes = useStyles();

    return (
        <Paper className={classes.root} elevation={0}>
            <PageHeader title={props.title} />
            {props.children}
        </Paper>
    );
};

export default Page;