import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
        },
        message: {
            width: '80%',
            maxWidth: '80%',
            textAlign: 'center',
            fontSize: '0.9em',
            borderRadius: 5,
            padding: 15,

            '&.success': {
                backgroundColor: '#f7ffff',
                border: '1px solid #2ec7c7'
            },
            '&.error': {
                backgroundColor: '#fff7f7',
                border: '1px solid #c72e2e'
            }
        }
    })
)

interface IFormMessage {
    type: 'success' | 'error'
    message?: string
}

const FormMessage: React.FC<IFormMessage> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography className={[classes.message, props.type].join(' ')}>{props.message}</Typography>
        </div>
    )
}

export default FormMessage;