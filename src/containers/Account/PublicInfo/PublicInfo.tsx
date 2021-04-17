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

import SendButton from '../../../widgets/FormModal/FormActions/SendButton';

import User from '../../../models/types/User';

interface IPublicInfoProps {
    account: User,
    updateUserDetails: (arg1: UserDetails) => Promise<any>
};

const PublicInfo: React.FC<IPublicInfoProps> = props => {
    const [hasChange, setHasChange] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<UserDetails>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!props.account) return;

        setUserDetails({
            id: props.account.id,
            firstName: props.account.firstName,
            lastName: props.account.lastName
        });
    }, [ props.account ]);

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
                    <ProfilePicture account={props.account} />
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