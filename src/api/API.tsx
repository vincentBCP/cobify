import firebase from '../firebase';

class API<T> {
    readonly _path: string;

    constructor(path: string) {
        this._path = path;
    }

    protected getDatabaseRef(childPath?: string) {
        return firebase.database().ref(this._path + (childPath ? "/" + childPath : ""));
    }

    protected getRecords(): Promise<T[]> {
        return firebase.database().ref(this._path).get()
            .then(snapshot => {
                return Object.keys(snapshot.val() || {}).map(key =>
                    ({...snapshot.child(key).val()} as T));
            });
    }

    protected getRecord(childPath: string): Promise<T> {
        return this.getDatabaseRef().child(childPath).get()
            .then(snapshot => ({...snapshot.val()} as T));
    }

    protected create(childPath: string, record: T): Promise<T> {
        return this.getDatabaseRef(childPath).set(record)
            .then(() => record);
    }

    protected update(childPath: string, record: T): Promise<T> {
        return this.getDatabaseRef(childPath).update(record)
            .then(() => record);
    }

    protected delete(childPath: string): Promise<string> {
        return this.getDatabaseRef(childPath).remove()
            .then(() => childPath);
    } 
}

export default API;