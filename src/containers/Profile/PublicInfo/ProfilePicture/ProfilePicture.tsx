import React from 'react';

import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';

import Avatar from '../../../../widgets/Avatar';

import User from '../../../../models/types/User';

const MAX_PROFILE_PIC_SIZE_IN_MB = 2;

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
        },
        message: {
            marginTop: 5,
            fontSize: '0.9em',
            textAlign: 'center'
        }
    })
);

interface IProfilePictureProps {
    account: User,
    uploading?: boolean,
    handleChange: (arg1: File) => void
}

const ProfilePicture: React.FC<IProfilePictureProps> = props => {
    const classes = useStyles();

    return (
        <Grid item xs={4} className={classes.root}>
            <Avatar
                size={130}
                account={props.account}
            />
            <input
                accept="image/*"
                className={classes.inputFile}
                id="contained-button-file"
                type="file"
                onChange={(ev: React.ChangeEvent) => {
                    const fileList = (ev.target as HTMLInputElement).files || [];
                    const pic = fileList[0];

                    if (!pic) return;

                    (ev.target as HTMLInputElement).value = "";

                    const sizeInMB = (pic.size / (1024*1024));

                    if (sizeInMB > MAX_PROFILE_PIC_SIZE_IN_MB) {
                        alert("File is too large.");
                        return;
                    };

                    props.handleChange(pic);
                }}
            />
            <label htmlFor="contained-button-file">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    className={classes.upload}
                    disabled={props.uploading}
                >
                    Upload
                </Button>
            </label>
            <Typography className={classes.message}>
                For best results, use an image at least 128px by 128px in .jpg format. Maximum of {MAX_PROFILE_PIC_SIZE_IN_MB}mb.
            </Typography>
        </Grid>
    );
};

export default ProfilePicture;