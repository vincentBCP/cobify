import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './PublicInfo.scss';

import DetailsForm from './DetailsForm';
import ProfilePicture from './ProfilePicture';

interface IPublicInfoProps {
    user: any
};

const PublicInfo: React.FC<IPublicInfoProps> = props => {
    return (
        <Card style={{marginBottom: 30}}>
            <CardContent>
                <Typography>Public info</Typography>
                <Grid container spacing={2}>
                    <DetailsForm
                        firstName={props.user.firstName}
                        lastName={props.user.lastName}
                    />
                    <ProfilePicture user={props.user} />
                </Grid>
                <Button variant="contained" color="primary">
                    Save changes
                </Button>
            </CardContent>
        </Card>
    );
};

export default PublicInfo;