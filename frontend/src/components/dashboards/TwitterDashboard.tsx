import React, { useState } from "react";
import FilterModalTwitter from "../popups/FilterModalTwitter";
import DataPreview from '../preview/DataPreview';
import { downloadAllPosts } from '../../services/twitterService';
import { TwitterFilters } from '../../types';
import './TwitterDashboard.css';

const TwitterDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<TwitterFilters>({});

  const toggleModal = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDownloadAll = async (): Promise<void> => {
    setIsDownloading(true);
    try {
      await downloadAllPosts();
      alert('Download completed successfully!');
    } catch (error) {
      alert('Error downloading data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApplyFilters = (filters: TwitterFilters): void => {
    setActiveFilters(filters);
  };

  const handleClearFilters = (): void => {
    setActiveFilters({});
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Twitter Dashboard</h2>
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
      <DataPreview dataType="twitter" filters={activeFilters} />
      {isModalOpen && (
        <FilterModalTwitter
          onToggle={toggleModal}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default TwitterDashboard;
