import React, { useEffect } from 'react';

import { Theme, makeStyles, createStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import AppContext from '../../context/appContext';

import PageHeader from './PageHeader';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            borderRadius: 0,
            backgroundColor: 'transparent',
            padding: '0 50px 30px 50px',
            border: 'none',

            '&.sm, &.md': {
                padding: '0 10px 30px 10px'
            }
        }
    })
);

interface IPageProps {
    title: string
};

const Page: React.FC<IPageProps> = props => {
    const classes = useStyles();

    const appContext = React.useContext(AppContext);

    useEffect(() => {
        window.document.title = props.title + " - Cobify";
    }, [props.title]);

    return (
        <Paper className={[classes.root, appContext.screenSize].join(' ')} elevation={0}>
            <PageHeader title={props.title} />
            {props.children}
        </Paper>
    );
};

export default Page;