import React from 'react';
import {csvFileDownload} from '../../utils/streanCsv';

interface DownloadButtonProps {
  label: string;
  fileUrl: string;
}

// DownloadButton Component
const DownloadButton: React.FC<DownloadButtonProps> = ({ label, fileUrl }) => {
    return (
        <button onClick={() => csvFileDownload(fileUrl)}>
            {label}
        </button>
    );
};

export default DownloadButton;
