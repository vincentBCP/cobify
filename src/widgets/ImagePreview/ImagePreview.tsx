import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

import LargeView from './LargeView';

import Auxi from '../../hoc/Auxi';

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
    const [name, setName] = useState<string>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!props.file) return;
        
        if (props.file instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(props.file);
            reader.onload = () => {
                setName(props.file?.name);
                setUrl(reader.result as string);
            };
            reader.onerror = error => { };
        } else { // props.file is an URL
            setName(props.file?.name);
            setUrl(StorageAPI.getAttachmentPublicUrl(props.file as IAttachment));
        }
    }, [ props.file ]);

    if (!url) return null;

    return (
        <Auxi>
            <LargeView
                open={open}
                src={url}
                name={name}
                handleClose={() => setOpen(false)}
            />

            <Tooltip title={props.tooltip}>
                <div id="image-preview" onClick={() => setOpen(true)}>
                    <img src={url} alt="attachment" />
                    {props.handleRemove ? <div className="image-preview-overlay">
                        <CloseIcon
                            style={{cursor: 'pointer', color: 'lightgray'}}
                            onClick={props.handleRemove}
                        />
                    </div> : null}
                </div>
            </Tooltip>
        </Auxi>
    );
};

export default ImagePreview;