// import { format } from 'date-fns';

import IAttachment from '../models/interfaces/IAttachment';

import firebase from '../firebase';

class StorageAPI {
    // https://firebase.google.com/docs/storage/web/upload-files

    public upload(file: File, isProfilePic?: boolean, fname?: string): Promise<IAttachment> {
        //const tokens = file.name.split(".");
        //const extension = tokens[tokens.length - 1];
        const filename = fname || file.name;//"attachment-" + format(new Date(), "yyyy-MM-dd-HH-mm-ss-T") + "." + extension;

        const path = (isProfilePic ? "profilePicture/" : "attachment/") + filename;

        return firebase.storage()
        .ref(path)
        .put(file)
        .then(uploadTask => {
            return uploadTask.ref.getDownloadURL();
        })
        .then(downloadUrl => {
            return {
                name: filename,
                size: file.size,
                path: path,
                downloadURL: downloadUrl,
                timeCreated: (new Date()).toISOString()
            } as IAttachment;
        });
    };

    public delete(attachment: IAttachment): Promise<boolean> {
        return firebase.storage().ref(attachment.path).delete()
            .then(response => true)
            .catch(error => {
                const notFoundCode = "storage/object-not-found";

                if (error.code === notFoundCode)
                    return Promise.resolve(true);

                return Promise.reject(error);
            });
    }
};

export default new StorageAPI();