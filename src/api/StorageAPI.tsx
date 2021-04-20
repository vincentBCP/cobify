import axios from '../axios';
import { format } from 'date-fns';

import { BUCKET } from '../config';

import IAttachment from '../models/interfaces/IAttachment';

//https://stackoverflow.com/questions/37631158/uploading-files-to-firebase-storage-using-rest-api

// const url = "https://storage.googleapis.com/storage/v1/b/" + myBucket + "/o/attachments/";
const path = "https://firebasestorage.googleapis.com/v0/b/" + BUCKET + "/o/attachments%2F";

class StorageAPI {
    public static upload(file: File): Promise<IAttachment> {
        const tokens = file.name.split(".");
        const extension = tokens[tokens.length - 1];
        const filename = "attachment-" + format(new Date(), "yyyy-MM-dd-HH-mm-ss-T") + "." + extension;

        const url = path + filename;
        const config = {
            headers: {
                "Content-Type": file.type
            }
        };

        return axios.post(url, file, config)
            .then(response => ({
                name: filename,
                downloadTokens: response.data.downloadTokens,
                timeCreated: response.data.timeCreated
            }));
    };

    public static delete(attachment: IAttachment): Promise<boolean> {
        const url = path + attachment.name;

        return axios.delete(url)
            .then(response => {
                return true;
            });
    }

    public static getAttachmentPublicUrl(attachment: IAttachment): string {
        return path + attachment.name + "?alt=media&token=" + attachment.downloadTokens;
    }
};

export default StorageAPI;