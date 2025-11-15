import React from 'react';
import {csvFileDownload} from '../../utils/streanCsv';

// DownloadButton Component
const DownloadButton = ({ label, fileUrl }) => {
    return (
        <button onClick={() => csvFileDownload(fileUrl)}>
            {label}
        </button>
    );
};


export default DownloadButton;
