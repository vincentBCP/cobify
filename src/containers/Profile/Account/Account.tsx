import React, { useState } from 'react';
import randomcolor from 'randomcolor';

import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import User from '../../../models/types/User';
import UserRole from '../../../models/enums/UserRole';

import OrganizationFormModal from './OrganizationFormModal';

import UserAPI from '../../../api/UserAPI';

import ErrorContext from '../../../context/errorContext';

interface IAccountProps {
    account: User
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            marginBottom: 20,
            
            '& input': {
                color: 'black'
            },
            '&:last-of-type': {
                marginBottom: 0
            }
        },
        button: {
            marginLeft: 10
        }
    })
);

const Account: React.FC<IAccountProps> = props => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const errorContext = React.useContext(ErrorContext);

    const adminAccount: User = useSelector((state: any) => 
        state.user.users.find((u: User) => u.email === props.account.email && u.role === UserRole.ADMIN));

    const createAdminAccount = (data: any): [Promise<any>, (arg: any) => void, (arg: any) => void] => {
        return [
            UserAPI.createUser({
                firstName: props.account.firstName,
                lastName: props.account.lastName,
                email: props.account.email,
                color: randomcolor(),
                accountID: "upgraded",
                created: (new Date()).toISOString(),
                ...data,
                role: UserRole.ADMIN
            }),
            response => {
                localStorage.removeItem('account'); // clear selected account so when reloaded the admin account will be picked
                window.location.reload();
            },
            error => {
                errorContext.setError(error);
            }
        ]
    }

    return (
        <React.Fragment>
            <OrganizationFormModal
                open={open}
                handleSubmit={createAdminAccount}
                handleCancel={() => setOpen(false)}
            />

            <Card>
                <CardContent>
                    <Typography style={{marginBottom: 15}}>Account</Typography>
                    {
                        Boolean(adminAccount)
                        ? <React.Fragment>
                            <InputLabel style={{marginBottom: 7}}>Organization</InputLabel>

                            <TextField
                                id="account-organization"
                                fullWidth
                                variant="outlined"
                                className={classes.input}
                                disabled={true}
                                value={adminAccount.organization}
                            />
                        </React.Fragment>
                        : null
                    }

                    <InputLabel style={{marginBottom: 7}}>Email</InputLabel>
                    <TextField
                        id="account-email"
                        fullWidth
                        variant="outlined"
                        className={classes.input}
                        disabled={true}
                        value={props.account.email}
                    />

                    {
                        !Boolean(adminAccount)
                        ? <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpen(true)}
                            style={{
                                marginTop: 20
                            }}
                        >
                            Create admin account
                        </Button>
                        : null
                    }
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default Account;