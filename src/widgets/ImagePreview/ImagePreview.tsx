import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';

import './ImagePreview.scss';

interface IImagePreviewProps {
    file?: File | string,
    handleRemove?: () => void
}

const ImagePreview: React.FC<IImagePreviewProps> = props => {
    const [url, setUrl] = useState<string>();

    useEffect(() => {
        if (!props.file) return;
        
        if (props.file instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(props.file);
            reader.onload = () => {
                setUrl(reader.result as string);
            };
            reader.onerror = error => { };
        } else { // props.file is an URL
            setUrl(props.file);
        }
    }, [ props.file ]);

    if (!url) return null;

    return (
        <div id="image-preview">
            <img src={url} alt="attachment" />
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