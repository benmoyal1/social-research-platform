import React, { useState } from 'react';
import FilterModalTelegram from '../popups/FilterModalTelegram';
import DataPreview from '../preview/DataPreview';
import { downloadAllMessages } from '../../services/telegramService';
import { TelegramFilters } from '../../types';
import './TelegramDashboard.css';

const TelegramDashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [activeFilters, setActiveFilters] = useState<TelegramFilters>({});

    const toggleModal = (): void => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDownloadAll = async (): Promise<void> => {
        setIsDownloading(true);
        try {
            await downloadAllMessages();
            alert('Download completed successfully!');
        } catch (error) {
            alert('Error downloading data: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsDownloading(false);
        }
    };

    const handleApplyFilters = (filters: TelegramFilters): void => {
        setActiveFilters(filters);
    };

    const handleClearFilters = (): void => {
        setActiveFilters({});
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Telegram Dashboard</h2>
                <div className="dashboard-actions">
                    <button onClick={toggleModal} className="action-btn filter-btn">
                        Filter Data
                    </button>
                    <button
                        onClick={handleDownloadAll}
                        disabled={isDownloading}
                        className="action-btn download-btn"
                    >
                        {isDownloading ? 'Downloading...' : 'Download All Data'}
                    </button>
                    {Object.keys(activeFilters).length > 0 && (
                        <button
                            onClick={handleClearFilters}
                            className="action-btn clear-btn"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>
            <DataPreview dataType="telegram" filters={activeFilters} />
            {isModalOpen && (
                <FilterModalTelegram
                    onToggle={toggleModal}
                    onApplyFilters={handleApplyFilters}
                />
            )}
        </div>
    );
};

export default TelegramDashboard;
