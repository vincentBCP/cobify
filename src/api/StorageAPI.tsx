import axios from '../axios';
import { format } from 'date-fns';

import { FIREBASE_CONFIG } from '../config';

import IAttachment from '../models/interfaces/IAttachment';

const URL = "https://firebasestorage.googleapis.com/v0/b/" + FIREBASE_CONFIG.storageBucket + "/o/";
const attachmentURL = URL + "attachments%2F";
const profilePicURL = URL + "profilePicture%2F";

class StorageAPI {
    public static upload(file: File, isProfilePic?: boolean, fname?: string): Promise<IAttachment> {
        const tokens = file.name.split(".");
        const extension = tokens[tokens.length - 1];
        const filename = fname || "attachment-" + format(new Date(), "yyyy-MM-dd-HH-mm-ss-T") + "." + extension;

        const url = (isProfilePic ? profilePicURL : attachmentURL) + filename;
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

    public static delete(attachment: IAttachment, isProfilePic?: boolean): Promise<boolean> {
        const url = (isProfilePic ? profilePicURL : attachmentURL) + attachment.name;

        return axios.delete(url)
            .then(response => {
                return true;
            });
    }

    public static getAttachmentPublicUrl(attachment: IAttachment, isProfilePic?: boolean): string {
        return (isProfilePic ? profilePicURL : attachmentURL) + attachment.name + "?alt=media&token=" + attachment.downloadTokens;
    }
};

export default StorageAPI;