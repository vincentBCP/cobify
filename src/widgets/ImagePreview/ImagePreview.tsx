import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

import './ImagePreview.scss';

import IAttachment from '../../models/interfaces/IAttachment';
import StorageAPI from '../../api/StorageAPI';

interface IImagePreviewProps {
    file?: File | IAttachment,
    tooltip: string,
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
            setUrl(StorageAPI.getAttachmentPublicUrl(props.file as IAttachment));
        }
    }, [ props.file ]);

    if (!url) return null;

    return (
        <Tooltip title={props.tooltip}>
            <div id="image-preview">
                <img src={url} alt="attachment" />
                {props.handleRemove ? <div className="image-preview-overlay">
                    <CloseIcon
                        style={{cursor: 'pointer', color: 'lightgray'}}
                        onClick={props.handleRemove}
                    />
                </div> : null}
            </div>
        </Tooltip>
    );
};

export default ImagePreview;