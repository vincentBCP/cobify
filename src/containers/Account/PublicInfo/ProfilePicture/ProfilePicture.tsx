import React from 'react';

import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Avatar from '../../../../widgets/Avatar';

import User from '../../../../models/types/User';

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
        upload: {
            paddingLeft: 15,
            paddingRight: 15,
            marginTop: 10
        }
    })
);

interface IProfilePictureProps {
    account: User
}

const ProfilePicture: React.FC<IProfilePictureProps> = props => {
    const classes = useStyles();

    return (
        <Grid item xs={4} className={classes.root}>
            <Avatar
                size={130}
                color={props.account.color}
                initials={props.account.initials}
            />
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