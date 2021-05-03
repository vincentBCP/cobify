import React from 'react';

import { makeStyles, createStyles,Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DownloadIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: "#233044",//"#151d29",
            borderRadius: 0,
        },
        header: {
            position: 'fixed',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: "7px 20px",
            color: 'rgb(184, 199, 224)',

            '& p': {
                flexGrow: 1
            },
            '& svg': {
                color: 'rgb(184, 199, 224)',
                cursor: 'pointer',
                marginLeft: 5,
                height: 35,
                width: 35,
                padding: 5,

                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 5
                }
            }
        },
        content: {
            marginTop: 50,
            flexGrow: 1,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'inherit',
            padding: "0 10px 10px 10px",

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
    handleClose: () => void,
    handleDownload: () => void
}

const LargeView: React.FC<ILargeViewProps> = props => {
    const classes = useStyles();

    return (
        <Dialog fullScreen open={Boolean(props.open)}>
            <Paper className={classes.root}>
                <div className={classes.header}>
                    <Typography>{props.name}</Typography>
                    <DownloadIcon onClick={props.handleDownload} />
                    <CloseIcon onClick={props.handleClose} />
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