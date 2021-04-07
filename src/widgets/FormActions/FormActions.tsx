import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import SendButton from './SendButton';

interface IFormActionsProps {
    loading?: boolean,
    success?: boolean,
    sendLabel?: string,
    handleSend?: () => void,
    handleCancel: () => void
}

const FormActions: React.FC<IFormActionsProps> = props => {
    return (
        <Grid container direction="row" justify="flex-end">
            {
                !props.loading && !props.success
                ? <Button
                    color="default"
                    onClick={props.handleCancel}
                    style={{marginRight: 10}}
                > Cancel</Button>
                : null
            }

            <SendButton
                label={props.sendLabel}
                loading={props.loading}
                success={props.success}
                handleClick={props.handleSend}
            />
        </Grid>
    );
};

export default FormActions;