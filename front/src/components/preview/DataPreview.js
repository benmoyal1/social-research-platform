import React from 'react';
import { usePaginatedData } from '../../hooks/usePaginatedData';
import { fetchPaginatedMessages } from '../../services/telegramService';
import { fetchPaginatedPosts } from '../../services/twitterService';
import './DataPreview.css';

const DataPreview = ({ dataType, filters = {} }) => {
  // Select appropriate fetch function based on data type
  const fetchFunction = dataType === 'telegram' ? fetchPaginatedMessages : fetchPaginatedPosts;

  // Use custom hook for data fetching
  const {
    data,
    pagination,
    loading,
    error,
    hasFilters,
    firstPage,
    previousPage,
    nextPage,
    lastPage,
  } = usePaginatedData(fetchFunction, filters);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const renderTelegramRow = (row, index) => (
    <tr key={row.id || index}>
      <td className="date-cell">{formatDate(row.date)}</td>
      <td className="time-cell">{row.time}</td>
      <td className="channel-cell">{row.channel_name}</td>
      <td className="content-cell" title={row.content}>{row.content}</td>
      <td className="number-cell">{formatNumber(row.views)}</td>
      <td className="number-cell">{formatNumber(row.comments_num)}</td>
    </tr>
  );

  const renderTwitterRow = (row, index) => (
    <tr key={row.id || index}>
      <td className="date-cell">{formatDate(row.date_posted)}</td>
      <td className="user-cell">{row.user_posted}</td>
      <td className="content-cell" title={row.description}>{row.description}</td>
      <td className="hashtag-cell">{row.hashtags}</td>
      <td className="number-cell">{formatNumber(row.likes)}</td>
      <td className="number-cell">{formatNumber(row.reposts)}</td>
      <td className="number-cell">{formatNumber(row.replies)}</td>
      <td className="number-cell">{formatNumber(row.views)}</td>
    </tr>
  );

  const renderTableHeaders = () => {
    if (dataType === 'telegram') {
      return (
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Channel</th>
          <th>Content</th>
          <th>Views</th>
          <th>Comments</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>Date</th>
          <th>User</th>
          <th>Description</th>
          <th>Hashtags</th>
          <th>Likes</th>
          <th>Reposts</th>
          <th>Replies</th>
          <th>Views</th>
        </tr>
      );
    }
  };

  if (loading) {
    return (
      <div className="data-preview">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading data preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-preview">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="data-preview">
        <div className="empty-container">
          <div className="empty-icon">📭</div>
          <h3>No Data Found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-preview">
      <div className="preview-header">
        <h3>Data Preview</h3>
        <div className="preview-info">
          {hasFilters && (
            <span className="filter-badge">
              Showing preview (first 3 pages) of {pagination.totalRecords} filtered results
            </span>
          )}
          {!hasFilters && (
            <span>
              Total Records: {pagination.totalRecords}
            </span>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            {renderTableHeaders()}
          </thead>
          <tbody>
            {data.map((row, index) =>
              dataType === 'telegram'
                ? renderTelegramRow(row, index)
                : renderTwitterRow(row, index)
            )}
          </tbody>
        </table>
      </div>

      {!hasFilters && (
        <div className="pagination-controls">
          <button
            onClick={firstPage}
            disabled={!pagination.hasPreviousPage}
            className="pagination-btn"
            title="First Page"
          >
            «
          </button>
          <button
            onClick={previousPage}
            disabled={!pagination.hasPreviousPage}
            className="pagination-btn"
            title="Previous Page"
          >
            ‹
          </button>

          <span className="page-info">
            Page <strong>{pagination.currentPage.toLocaleString()}</strong> of <strong>{pagination.totalPages.toLocaleString()}</strong>
            <span className="records-info">({pagination.totalRecords.toLocaleString()} records)</span>
          </span>

          <button
            onClick={nextPage}
            disabled={!pagination.hasNextPage}
            className="pagination-btn"
            title="Next Page"
          >
            ›
          </button>
          <button
            onClick={lastPage}
            disabled={!pagination.hasNextPage}
            className="pagination-btn"
            title="Last Page"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default DataPreview;
