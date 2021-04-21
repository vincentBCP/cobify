import React from 'react';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: "#172b4d",
            borderRadius: 0
        },
        header: {
            position: 'fixed',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 20,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            color: 'rgba(255,255,255,0.5)',

            '& svg': {
                color: 'rgba(255,255,255,0.5)'
            }
        },
        content: {
            marginTop: 50,
            flexGrow: 1,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            '& img': {
                maxHeight: '100%',
                maxWidth: '100%'
            }
        }
    })
);

interface ILargeViewProps {
    open?: boolean,
    name?: string,
    src?: string,
    handleClose: () => void
}

const LargeView: React.FC<ILargeViewProps> = props => {
    const classes = useStyles();

    return (
        <Dialog fullScreen open={Boolean(props.open)}>
            <Paper className={classes.root}>
                <div className={classes.header}>
                    <Typography>{props.name}</Typography>
                    <IconButton onClick={props.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={classes.content}>
                    {
                        props.src
                        ? <img src={props.src} alt="large view" />
                        : null
                    }
                </div>
            </Paper>
        </Dialog>
    );
};

export default LargeView;