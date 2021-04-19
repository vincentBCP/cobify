import React from 'react';

import ActualComponent from './TextEditorActualComponent';

export interface ITextEditorValue {
    content: string,
    attachments: any
}

interface ITextEditorProps {
    title: string,
    value?: ITextEditorValue | null,
    handleChange: (arg1: ITextEditorValue) => void
}

const TextEditor: React.FC<ITextEditorProps> = props => {
    return <ActualComponent
        title={props.title}
        value={props.value}
        handleChange={props.handleChange}
    />;
};

export default TextEditor;