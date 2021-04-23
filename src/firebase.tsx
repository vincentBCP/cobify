import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

import { FIREBASE_CONFIG } from './config';

class Firebase {
    constructor() {
        app.initializeApp(FIREBASE_CONFIG);
    }

    public database() {
        return app.database();
    }

    public auth() {
        return app.auth();
    }

    public storage() {
        return app.storage();
    }
}

export default new Firebase()