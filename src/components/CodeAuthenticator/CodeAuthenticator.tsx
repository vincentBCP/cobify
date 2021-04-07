import React, { useEffect, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import AppAPI from '../../api/AppAPI';

import CodeForm from './CodeForm';

import { SUCCESS_DELAY } from '../../widgets/FormActions/SendButton/SendButton';

interface ICodeAuthenticatorProps {
    open?: boolean,
    title?: string,
    message?: string,
    handleCancel: () => void,
    handleSuccess: () => void,
    handleFail: () => void
};

const CodeAuthenticator: React.FC<ICodeAuthenticatorProps> = props => {
    const [code, setCode] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!props.open) return;

        setCode(null);
        setLoading(false);
        setSuccess(false);
    }, [ props.open ]);

    const handleCancel = () => {
        props.handleCancel();
        setCode(null);
    };

    const handleSend = () => {
        if (!code) return;

        setLoading(true);

        AppAPI
        .checkCode(code)
        .then(response => {
            setLoading(false);
            setSuccess(true);

            setTimeout(() => {
                props.handleSuccess();
            }, SUCCESS_DELAY);
        })
        .catch(error => {
            props.handleFail();
        });
    };

    return (
        <Dialog open={props.open || false}>
            <DialogContent>
                <CodeForm
                    code={code || ''}
                    title={props.title}
                    message={props.message}
                    handleCodeChange={(value: string) => setCode(value)}
                    handleCancel={handleCancel}
                    handleSend={handleSend}
                    loading={loading}
                    success={success}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CodeAuthenticator;