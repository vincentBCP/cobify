import React, { useEffect } from 'react';

import firebase from '../../firebase';

const Logout: React.FC = props => {
    useEffect(() => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("account");
        
        firebase.auth().signOut();
        window.location.reload();
    }, []);

    return null;
};

export default Logout;