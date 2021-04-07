import React, { useEffect } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';

export const SUCCESS_DELAY = 400;

interface IButtonProgressProps {
    label?: string,
    loading?: boolean,
    success?: boolean,
    handleClick?: () => void,
    handleSuccess?: () => void,
};

const SendButton: React.FC<IButtonProgressProps> = props => {
    const { handleSuccess } = props;

    useEffect(() => {
        if (!props.success || !handleSuccess) return;

        setTimeout(() => {
            if (handleSuccess) handleSuccess();
        }, SUCCESS_DELAY);
    }, [ handleSuccess, props.success ]);

    return (
        <Button type="submit" variant="contained" color="primary" onClick={props.handleClick}>
            { (props.loading && !props.success) ? <CircularProgress size={22} style={{color: 'white'}} /> : null }
            { props.success ? <CheckIcon style={{fontSize: 22}} /> : null }
            { (!props.loading && !props.success) ? (props.label || 'Send') : null }
        </Button>
    )
};

export default SendButton;