import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import AppContext from '../../../context/appContext';

interface IPageHeaderProps {
    title: string
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: "50px 0 30px 0",

            '&.sm, &.md': {
                margin: "20px 0 20px 0"
            }
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

    const appContext = React.useContext(AppContext);

    return (
        <div className={[classes.root, appContext.screenSize].join(' ')}>
            <Typography className={classes.title} variant="h5">{props.title}</Typography>
            <Divider />
        </div>
    );
};

export default PageHeader;