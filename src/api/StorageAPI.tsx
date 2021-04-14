import axios from '../axios';

//https://stackoverflow.com/questions/37631158/uploading-files-to-firebase-storage-using-rest-api

const myBucket = "cobify-59a63.appspot.com";
// const url = "https://storage.googleapis.com/storage/v1/b/" + myBucket + "/o/attachments/";
const path = "https://firebasestorage.googleapis.com/v0/b/" + myBucket + "/o/attachments%2F";

class StorageAPI {
    public static upload(file: File): Promise<any> {
        const url = path + file.name;
        const config = {
            headers: {
                "Content-Type": file.type
            }
        };

        return axios.post(url + file.name, file, config)
            .then(response => response);
    };
};

export default StorageAPI;