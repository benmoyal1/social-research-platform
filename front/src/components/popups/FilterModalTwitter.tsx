import React, { useState, useEffect } from "react";
import { downloadFilteredData, fetchMetadata } from "../../utils/streanCsv";
import { FilterModalTwitterProps, TwitterFilters } from "../../types";
import "./css/FilterModalTwitter.css";
import TwitterFilterInputs from "../inputs/TwitterFilterInputs";

const FilterModalTwitter: React.FC<FilterModalTwitterProps> = ({ onToggle, onApplyFilters }) => {
  const today = new Date();
  const startDate = new Date(2023, 9, 7).toISOString().split("T")[0]; // October 7th, 2023
  const endDate = today.toISOString().split("T")[0];

  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<TwitterFilters>({
    description: "",
    dateStart: startDate,
    dateEnd: endDate,
    user_posted: [],
    tagged_users: [],
    hashtags: [],
    repliesMin: null,
    repliesMax: null,
    repostsMin: null,
    repostsMax: null,
    likesMin: null,
    likesMax: null,
    viewsMin: null,
    viewsMax: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchMetadata('twitter', 'users');
        setAvailableUsers(data.users || []);
      } catch (error) {
        console.error("Error loading users:", error);
        // Fallback to empty array if API fails
        setAvailableUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const prepareBackendFilters = (): TwitterFilters => {
    return {
      dateStart: filters.dateStart,
      dateEnd: filters.dateEnd,
      users: filters.user_posted && filters.user_posted.length > 0 ? filters.user_posted : undefined,
      searchTerm: filters.description || undefined,
      hashtags: filters.hashtags && filters.hashtags.length > 0 ? filters.hashtags : undefined,
      minReplies: filters.repliesMin,
      maxReplies: filters.repliesMax,
      minReposts: filters.repostsMin,
      maxReposts: filters.repostsMax,
      minLikes: filters.likesMin,
      maxLikes: filters.likesMax,
      minViews: filters.viewsMin,
      maxViews: filters.viewsMax,
    };
  };

  const handleApplyFilters = (): void => {
    const backendFilters = prepareBackendFilters();
    onApplyFilters(backendFilters);
    onToggle();
  };

  const handleDownload = async (): Promise<void> => {
    setDownloading(true);
    try {
      const backendFilters = prepareBackendFilters();
      await downloadFilteredData('twitter', backendFilters);
      alert('Filtered data downloaded successfully!');
      onToggle();
    } catch (error) {
      console.error("Error downloading filtered data:", error);
      alert('Error downloading filtered data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDownloading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleAddFeatureItem = (feature: string, item: string): void => {
    setFilters((prevFilters) => {
      const currentArray = (prevFilters as any)[feature] as string[] | undefined;
      // Check if item already exists in the list
      if (!currentArray?.includes(item)) {
        const updatedFilters = {
          ...prevFilters,
          [feature]: [...(currentArray || []), item],
        };
        return updatedFilters;
      }
      return prevFilters;
    });
  };

  const handleRemoveItem = (feature: string, item: string): void => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [feature]: ((prevFilters as any)[feature] as string[])?.filter(
        (currentItem) => currentItem !== item
      ) || [],
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Apply Filters</h2>
        <TwitterFilterInputs
          filters={filters}
          handleChange={handleChange}
          handleAddFeatureItem={handleAddFeatureItem}
          handleRemoveItem={handleRemoveItem}
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

export default FilterModalTwitter;
