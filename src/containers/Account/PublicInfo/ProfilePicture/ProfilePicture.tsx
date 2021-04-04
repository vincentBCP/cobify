import React from 'react';

import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        inputFile: {
            display: 'none'
        },
        avatar: {
            width: theme.spacing(14),
            height: theme.spacing(14),
            marginBottom: 10
        },
        upload: {
            paddingLeft: 25,
            paddingRight: 25
        }
    })
);

const ProfilePicture: React.FC = props => {
    const classes = useStyles();

    return (
        <Grid item xs={4} className={classes.root}>
            <Avatar className={classes.avatar}>VP</Avatar>
            <input
                accept="image/*"
                className={classes.inputFile}
                id="contained-button-file"
                multiple
                type="file"
            />
            <label htmlFor="contained-button-file">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    className={classes.upload}
                >
                    Upload
                </Button>
            </label>
        </Grid>
    );
};

export default ProfilePicture;