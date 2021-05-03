import React, { useEffect, useState } from 'react';
import filesize from 'filesize';

import CloseIcon from '@material-ui/icons/Close';
import DownloadIcon from '@material-ui/icons/GetApp';
import Tooltip from '@material-ui/core/Tooltip';

import LargeView from './LargeView';

import Auxi from '../../hoc/Auxi';

import './ImagePreview.scss';

import IAttachment from '../../models/interfaces/IAttachment';
import { Typography } from '@material-ui/core';

interface IImagePreviewProps {
    file?: File | IAttachment,
    handleRemove?: () => void,
    showFilename?: boolean
}

const ImagePreview: React.FC<IImagePreviewProps> = props => {
    const [url, setUrl] = useState<string>();
    const [name, setName] = useState<string>();
    const [open, setOpen] = useState(false);
    const [noPreview, setNoPreview] = useState(false);

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
        } else { // props.file is an IAttachment
            setName(props.file?.name);
            setUrl((props.file as IAttachment).downloadURL);
        }
    }, [ props.file ]);

    const isIAttachment = (arg: any): arg is IAttachment => {
        if (!arg) return false;
        return (arg as IAttachment).downloadURL !== undefined;
    }

    const getAttachment = (): IAttachment | null => {
        if (!isIAttachment(props.file)) return null;
        const attachment: IAttachment = props.file as unknown as IAttachment;
        return attachment
    }

    const download = () => {
        const attachment = getAttachment();
        if (!attachment) return;

        //https://firebase.google.com/docs/storage/web/download-files
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            console.log(event);
            console.log(xhr.response);

            /*var blob = xhr.response;

            // https://gist.github.com/davalapar/d0a5ba7cce4bc599f54800da22926da2

            const blobURL = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', attachment.name);
            // Safari thinks _blank anchor are pop ups. We only want to set _blank
            // target if the browser does not support the HTML5 download attribute.
            // This allows you to download files in desktop safari if pop up blocking
            // is enabled.
            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(blobURL);
            }, 100);*/
        };
        xhr.open('GET', attachment.downloadURL);
        xhr.send();
    }

    const getFileInfo = () => {
        if (!props.file) return "No info";

        return props.file.name + " - " + filesize(props.file.size || 0);
    }

    const openFile = () => {
        if (noPreview) return;
        setOpen(true);
    }

    if (!url) return null;

    return (
        <Auxi>
            <LargeView
                open={open}
                src={url}
                name={name}
                handleClose={() => setOpen(false)}
                handleDownload={download}
            />

            <Tooltip title={getFileInfo()}>
                <div id="image-preview" onClick={openFile}>
                    <div className="image-preview-image-container">
                        {!noPreview ? <img
                            src={url}
                            alt="attachment"
                            onLoad={() => setNoPreview(false)}
                            onError={() => setNoPreview(true)}
                            /> : null
                        }
                        {noPreview ? <Typography>No preview available</Typography> : null}
                    </div>
                    <div className="image-preview-overlay">
                        { !props.handleRemove 
                            ? <DownloadIcon
                                onClick={(ev: React.MouseEvent) => {
                                    ev.stopPropagation();
                                    download();
                                }}
                            />
                            : null
                        }
                        { props.handleRemove
                            ? <CloseIcon
                                onClick={(ev: React.MouseEvent) => {
                                    ev.stopPropagation();
                                    if (props.handleRemove)
                                        props.handleRemove();
                                }}
                            />
                            : null
                        }
                    </div>
                    {
                        props.showFilename
                        ? <Typography>{getFileInfo()}</Typography>
                        : null
                    }
                </div>
            </Tooltip>
        </Auxi>
    );
};

export default ImagePreview;