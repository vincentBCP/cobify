import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';

import StorageAPI from '../../api/StorageAPI';

import IAttachment from '../../models/interfaces/IAttachment';

import './ImagePreview.scss';

interface IImagePreviewProps {
    file?: File,
    attachment?: IAttachment,
    handleRemove?: () => void
}

const ImagePreview: React.FC<IImagePreviewProps> = props => {
    const [url, setUrl] = useState<string>();

    useEffect(() => {
        if (!props.file) return;
        
        const reader = new FileReader();
        reader.readAsDataURL(props.file);
        reader.onload = () => {
            setUrl(reader.result as string);
        };
        reader.onerror = error => { };
    }, [ props.file ]);

    useEffect(() => {
        if (!props.attachment) return;

        const url = StorageAPI.getAttachmentPublicUrl(props.attachment);
        setUrl(url);
    }, [ props.attachment ]);

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