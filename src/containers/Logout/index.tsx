import React, { useEffect } from 'react';

const Logout: React.FC = props => {
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("email");
        window.location.reload();
    }, []);

    return null;
};

export default Logout;