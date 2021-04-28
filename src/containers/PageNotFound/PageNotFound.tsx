import React, { useEffect } from 'react';

import Button from '@material-ui/core/Button';

import './PageNotFound.scss';

const PageNotFound: React.FC = props => {
    useEffect(() => {
        window.document.title = "404 - Cobify";
    }, []);

    return (
        <div id="page-not-found">
            <p>404</p>
            <p>Page not found.</p>
            <p>The page you are looking for might have been removed.</p>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    window.location.replace("/");
                }}
            >
                Back to home
            </Button>
        </div>
    );
};

export default PageNotFound;