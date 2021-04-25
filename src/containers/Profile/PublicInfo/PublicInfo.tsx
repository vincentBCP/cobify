import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import './PublicInfo.scss';

import DetailsForm from './DetailsForm';
import ProfilePicture from './ProfilePicture';

import SendButton from '../../../widgets/FormModal/FormActions/SendButton';

import User from '../../../models/types/User';

import StorageAPI from '../../../api/StorageAPI';

import * as actions from '../../../store/actions';

import ErrorContext from '../../../context/errorContext';

export type PublicInfoDetails = {
    firstName: string,
    lastName: string,
    organization?: string
}

interface IPublicInfoProps {
    account: User,
    updateUserDetails: (arg1: User) => Promise<any>
};

const PublicInfo: React.FC<IPublicInfoProps> = props => {
    const [hasChange, setHasChange] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<PublicInfoDetails>();
    const [loading, setLoading] = useState(false);

    const errorContext = React.useContext(ErrorContext);

    useEffect(() => {
        if (!props.account) return;

        setUserDetails({
            firstName: props.account.firstName,
            lastName: props.account.lastName,
            organization: props.account?.organization
        });
    }, [ props.account ]);

    const handleUserDetailsChange = (ud: PublicInfoDetails) => {
        setUserDetails(ud);
        setHasChange(true);
    };

    const isUserDetailsValid = () => {
        return userDetails?.firstName.trim() !== '' &&
                userDetails?.lastName.trim() !== '';
    };

    const handleSaveChanges = () => {
        if (!hasChange || !userDetails || !isUserDetailsValid()) return;
        
        if (loading) return;
        setLoading(true);

        props.updateUserDetails({
            ...props.account,
            ...userDetails
        })
        .then(response => { })
        .catch(error => {
            errorContext.setError(error);
        })
        .finally(() => {
            setLoading(false);
            setHasChange(false);
        });
    };

    const handleProfilePictureChange = (pic: File) => {
        if (loading) return;
        setLoading(true);

        const tokens = pic.name.split(".");
        const extension = tokens[tokens.length - 1];
        const filename = props.account.id + "." + extension;

        const req = props.account.profilePicture 
            ? StorageAPI.delete(props.account.profilePicture)
            : Promise.resolve();
        
        req
        .then(() => {
            return StorageAPI.upload(pic, true, filename);
        })
        .then(uploadedFile => {
            props.updateUserDetails({
                ...props.account,
                profilePicture: uploadedFile
            })
        })
        .catch(error => {
            errorContext.setError(error);
        })
        .finally(() => setLoading(false));
    };

    if (!userDetails) return null;

    return (
        <Card style={{marginBottom: 30}}>
            <CardContent>
                <Typography>Public info</Typography>
                <Grid container spacing={2}>
                    <DetailsForm
                        publicInfo={userDetails}
                        handleUserDetailsChange={handleUserDetailsChange}
                    />
                    <ProfilePicture
                        account={props.account}
                        uploading={loading}
                        handleChange={handleProfilePictureChange}
                    />
                </Grid>
                {/*<Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                >
                    Save changes
                </Button>*/}
                <SendButton
                    label="Save changes"
                    loading={loading}
                    handleClick={handleSaveChanges}
                />
            </CardContent>
        </Card>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateUserDetails: (user: User) => dispatch(actions.updateUserDetails(user))
    }
};

export default connect(null, mapDispatchToProps)(PublicInfo);