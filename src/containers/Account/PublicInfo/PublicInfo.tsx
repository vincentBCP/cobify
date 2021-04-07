import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import './PublicInfo.scss';

import DetailsForm from './DetailsForm';
import ProfilePicture from './ProfilePicture';

import * as actions from '../../../store/actions';

import UserDetails from '../../../models/types/UserDetails';

import SendButton from '../../../widgets/FormActions/SendButton';

interface IPublicInfoProps {
    user: any,
    updateUserDetails: (arg1: UserDetails) => Promise<any>
};

const PublicInfo: React.FC<IPublicInfoProps> = props => {
    const [hasChange, setHasChange] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<UserDetails>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!props.user) return;

        setUserDetails({
            id: props.user.id,
            firstName: props.user.firstName,
            lastName: props.user.lastName
        });
    }, [ props.user ]);

    const handleUserDetailsChange = (ud: UserDetails) => {
        setUserDetails(ud);
        setHasChange(true);
    };

    const isUserDetailsValid = () => {
        return userDetails?.firstName.trim() !== '' &&
                userDetails?.lastName.trim() !== '';
    };

    const handleSaveChanges = () => {
        if (!hasChange || !userDetails || !isUserDetailsValid()) return;
        
        setLoading(true);

        props.updateUserDetails({...userDetails})
        .then(response => {
            setLoading(false);
            setHasChange(false);
        })
        .catch(erorr => { });
    };

    if (!userDetails) return null;

    return (
        <Card style={{marginBottom: 30}}>
            <CardContent>
                <Typography>Public info</Typography>
                <Grid container spacing={2}>
                    <DetailsForm
                        userDetails={userDetails}
                        handleUserDetailsChange={handleUserDetailsChange}
                    />
                    <ProfilePicture user={props.user} />
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
        updateUserDetails: (userDetails: UserDetails) => dispatch(actions.updateUserDetails(userDetails))
    }
};

export default connect(null, mapDispatchToProps)(PublicInfo);