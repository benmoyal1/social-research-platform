import React, { useState, useEffect } from "react";
import { downloadFilteredData, fetchMetadata } from "../../utils/streanCsv";

import "./css/FilterModalTelegram.css";
import TelegramFilterInputs from "../inputs/TelegramFilterInputs";
const FilterModalTelegram = ({ onToggle, onApplyFilters }) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Set the start date to October 7th of the current year
  const startDate = new Date(currentYear - 1, 9, 8).toISOString().split("T")[0]; // October is month 9 (0-based index)

  // Set the end date to today
  const endDate = today.toISOString().split("T")[0]; // Format as yyyy-mm-dd

  const [availableChannels, setAvailableChannels] = useState([]);
  const [filters, setFilters] = useState({
    dateStart: startDate,
    dateEnd: endDate,
    channels: [],
    searchTerm: '', // Changed from keywords to searchTerm
    minViews: null,
    maxViews: null,
    minComments: null,
    maxComments: null,
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const data = await fetchMetadata('telegram', 'channels');
        setAvailableChannels(data.channels || []);
      } catch (error) {
        console.error("Error loading channels:", error);
        // Fallback to hardcoded channels if API fails
        setAvailableChannels([
          "newsil_tme",
          "Yediotnews",
          "tzenzora",
          "gazaalannet",
          "israel_news_telegram",
          "hotnews1",
          "newsdeskisrael",
          "newss",
          "haravot_barzel_no_size",
          "News_24_0_7",
          "News_cabinet_news",
          "zmanemmet",
          "qassambrigades",
          "admma_news",
          "Realtimesecurity1",
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, []);

  const prepareBackendFilters = () => {
    return {
      dateStart: filters.dateStart,
      dateEnd: filters.dateEnd,
      channels: filters.channels.length > 0 ? filters.channels : undefined,
      searchTerm: filters.searchTerm || undefined,
      minViews: filters.minViews,
      maxViews: filters.maxViews,
      minComments: filters.minComments,
      maxComments: filters.maxComments,
    };
  };

  const handleApplyFilters = () => {
    const backendFilters = prepareBackendFilters();
    onApplyFilters(backendFilters);
    onToggle();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const backendFilters = prepareBackendFilters();
      await downloadFilteredData('telegram', backendFilters);
      alert('Filtered data downloaded successfully!');
      onToggle();
    } catch (error) {
      console.error("Error downloading filtered data:", error);
      alert('Error downloading filtered data: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleAddKeyword = (keyword) => {
    // Not used anymore - search is now a single term
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchTerm: keyword,
    }));
  };

  const handleRemoveKeyword = (key) => {
    // Not used anymore
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchTerm: '',
    }));
  };

  const toggleChannel = (channel) => {
    setFilters((prevFilters) => {
      const isSelected = prevFilters.channels.includes(channel);
      const newChannels = isSelected
        ? prevFilters.channels.filter((c) => c !== channel)
        : [...prevFilters.channels, channel];
      return { ...prevFilters, channels: newChannels };
    });
  };

  const toggleSelectAll = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      channels:
        filters.channels.length === availableChannels.length ? [] : availableChannels,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Apply Filters</h2>
        <TelegramFilterInputs
          filters={filters}
          handleChange={handleChange}
          toggleSelectAll={toggleSelectAll}
          toggleChannel={toggleChannel}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          handleAddKeyword={handleAddKeyword} // Pass the method
          handleRemoveKeyword={handleRemoveKeyword} // Pass remove method
        />

        <div className="modal-actions">
          <button onClick={handleApplyFilters} disabled={loading} className="apply-btn">
            Apply Filters
          </button>
          <button onClick={handleDownload} disabled={loading || downloading} className="download-btn">
            {downloading ? "Downloading..." : loading ? "Loading..." : "Download Filtered Data"}
          </button>
          <button onClick={onToggle} disabled={downloading} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModalTelegram;
