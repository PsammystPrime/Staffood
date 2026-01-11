import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = false }) => {
    return (
        <div className={`loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
            <div className="loader-spinner"></div>
            <p className="loader-text">Loading Freshness...</p>
        </div>
    );
};

export default Loader;
