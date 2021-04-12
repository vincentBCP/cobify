import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';

import './ImagePreview.scss';

interface IImagePreviewProps {
    file: File,
    handleRemove: () => void
}

const ImagePreview: React.FC<IImagePreviewProps> = props => {
    const [base64, setBase64] = useState<string>();

    useEffect(() => {
        if (!props.file) return;
        
        const reader = new FileReader();
        reader.readAsDataURL(props.file);
        reader.onload = () => {
            setBase64(reader.result as string);
        };
        reader.onerror = error => { };
    }, [ props.file ])

    if (!base64) return null;

    return (
        <div id="image-preview">
            <img src={base64} alt="attachment" />
            {props.handleRemove ? <div className="image-preview-overlay">
                <CloseIcon
                    style={{cursor: 'pointer', color: 'lightgray'}}
                    onClick={props.handleRemove}
                />
            </div> : null}
        </div>
    );
};

export default ImagePreview;