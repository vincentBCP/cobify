import React from 'react';

// import CircularProgress from '@material-ui/core/CircularProgress';

import './PreLoader.sass';

const PreLoader: React.FC = props => {
    //https://codepen.io/AsLittleDesign/pen/ZbVVwa

    return (
        /*<div id="page-loader">
            <CircularProgress />
            <span className="page-loader-message">Loading... please wait a moment</span>
        </div>*/

        <div id="preloader">
            <div className="loader">
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--text"></div>
            </div>
        </div>
    );
};

export default PreLoader;