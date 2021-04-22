import React, { useState } from 'react';

import { useForm } from 'react-hook-form';

import { useSelector } from 'react-redux';

import './ContactSupport.scss';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import SendButton from '../../widgets/FormModal/FormActions/SendButton';
import Alert from '../../widgets/Alert';

import AppAPI from '../../api/AppAPI';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: '100%',
            width: 500,
            margin: 'auto'
        },
        content: {
            padding: "30px 20px"
        },
        action: {
            textAlign: 'right'
        }
    })
);

interface IFormInputs {
    subject: string,
    content: string
}

const ContactSupport: React.FC = props => {
    const classes = useStyles();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInputs>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const account = useSelector((state: any) => state.app.account);

    const send = (data: IFormInputs) => {
        if (!data) return;

        if (loading) return;
        setLoading(true);

        AppAPI.sendSupportMessage(account.email, data.subject, data.content)
        .then(response => {
            reset();
            setSuccess(true);
        })
        .catch(error => {
            console.log(error.response);
            setError(true);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <Auxi>
            {
                error
                ? <Alert
                    open={true}
                    type="error"
                    handleClose={() => setError(false)}
                    message="Request failed!"
                />
                : null
            }

            {
                success
                ? <Alert
                    open={true}
                    type="success"
                    handleClose={() => setSuccess(false)}
                    message="Successfully sent!"
                />
                : null
            }

            <ApplicationBar title="Contact Support" />

            <Page title="Contact support">
                <div className={classes.root}>
                    <Paper className={classes.content}>
                        <form onSubmit={handleSubmit(send)}>
                            <TextField
                                fullWidth
                                required
                                label="Subject"
                                variant="outlined"
                                style={{marginBottom: 30}}
                                inputProps={{
                                    ...register('subject', { 
                                        required: 'Required'
                                    })
                                }}
                            />
                            <TextField
                                fullWidth
                                required
                                label="Content"
                                variant="outlined"
                                multiline
                                rows={5}
                                rowsMax={10}
                                style={{marginBottom: 20}}
                                inputProps={{
                                    ...register('content', { 
                                        required: 'Required'
                                    })
                                }}
                                
                            />
                            <div className={classes.action}>
                                <SendButton
                                    loading={loading}
                                />
                            </div>
                        </form>
                    </Paper>
                </div>
            </Page>
        </Auxi>
    );
};

export default ContactSupport;