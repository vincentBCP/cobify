import React, { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import AppAPI from '../../api/AppAPI';

import CodeForm from './CodeForm';

interface ICodeAuthenticatorProps {
    open?: boolean,
    handleCancel: () => void,
    handleSuccess: () => void,
    handleFail: () => void
};

const CodeAuthenticator: React.FC<ICodeAuthenticatorProps> = props => {
    const [code, setCode] = useState<string | null>();

    const handleCancel = () => {
        props.handleCancel();
        setCode(null);
    };

    const handleSend = () => {
        if (!code) return;

        AppAPI
        .checkCode(code)
        .then(response => {
            props.handleSuccess();
            setCode(null);
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
                    handleCodeChange={(value: string) => setCode(value)}
                    handleCancel={handleCancel}
                    handleSend={handleSend}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CodeAuthenticator;