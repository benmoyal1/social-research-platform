import { useState, React } from "react";
import FilterModalTwitter from "../popups/FilterModalTwitter";
import DataPreview from '../preview/DataPreview';
import { downloadAllPosts } from '../../services/twitterService';
import './TwitterDashboard.css';

function TwitterDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      await downloadAllPosts();
      alert('✅ Download completed successfully!');
    } catch (error) {
      alert('❌ Error downloading data: ' + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
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
}

export default TwitterDashboard;
