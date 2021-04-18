import React from 'react';

import { makeStyles, createStyles,Theme } from '@material-ui/core';

import ImagePreview from '../../../../widgets/ImagePreview';

import IAttachment from '../../../../models/interfaces/IAttachment';

import StorageAPI from '../../../../api/StorageAPI';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        attachment: {
            marginBottom: 10,
            marginRight: 10
        }
    })
);

interface IAttachmentsProps {
    attachments: IAttachment[]
}

const Attachments: React.FC<IAttachmentsProps> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {
                props.attachments.map(attachment =>
                    <div key={"attachment-" + attachment.name} className={classes.attachment}>
                        <ImagePreview file={StorageAPI.getAttachmentPublicUrl(attachment)} />
                    </div>
                )
            }
        </div>
    );
};

export default Attachments;