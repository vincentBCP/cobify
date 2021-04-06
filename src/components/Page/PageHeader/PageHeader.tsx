import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

interface IPageHeaderProps {
    title: string
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: "50px 0 30px 0"
        },
        title: {
            color: 'rgba(0, 0, 0, 0.87)',//'rgb(158 158 158)',
            width: '100%',
            fontWeight: 500,
            marginBottom: 20
        }
    })
);

const PageHeader: React.FC<IPageHeaderProps> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="h5">{props.title}</Typography>
            <Divider />
        </div>
    );
};

export default PageHeader;