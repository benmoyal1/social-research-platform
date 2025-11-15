import React, { useState, useRef, useEffect } from "react";
import { TelegramFilterInputsProps } from "../../types";
import "./css/TwitterFilterinputs.css";

const CHANNEL_NAMES: string[] = [
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
];

const TelegramFilterInputs: React.FC<TelegramFilterInputsProps> = ({
  filters,
  handleChange,
  toggleSelectAll,
  toggleChannel,
  dropdownOpen,
  setDropdownOpen,
  handleAddKeyword,
  handleRemoveKeyword,
}) => {
  const [currentKeyword, setCurrentKeyword] = useState<string>(""); // State to track the current input
  const dropdownRef = useRef<HTMLDivElement>(null); // To track the dropdown container

  // Close dropdown on outside click or Escape key press
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [setDropdownOpen]);

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && currentKeyword.trim() !== "") {
      handleAddKeyword(currentKeyword.trim()); // Add the keyword to the filters array
      setCurrentKeyword(""); // Clear the input after adding
    }
  };

  return (
    <div>
      <label>
        Keywords
        <input
          type="text"
          value={currentKeyword}
          onChange={(e) => setCurrentKeyword(e.target.value)}
          onKeyDown={handleKeywordKeyDown}
          placeholder="Enter Keyword That Appears in Message"
        />
      </label>
      <div>
        {/* Display search term if it exists */}
        {filters.searchTerm && (
          <button
            className="keyword-button"
            onClick={() => handleRemoveKeyword(filters.searchTerm || '')}
          >
            {filters.searchTerm}
            <span className="remove-x"> ×</span>
          </button>
        )}
      </div>

      <div className="channel-dropdown" ref={dropdownRef}>
        <input
          type="text"
          readOnly
          value={filters.channels?.join(", ") || "Select Channels"}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          placeholder="Select Channels"
        />
        {dropdownOpen && (
          <div className="dropdown-list">
            <div className="dropdown-item" onClick={toggleSelectAll}>
              {(filters.channels?.length || 0) === CHANNEL_NAMES.length
                ? "Deselect All"
                : "Select All"}
            </div>
            {CHANNEL_NAMES.map((channel) => (
              <div
                key={channel}
                className={`dropdown-item ${
                  filters.channels?.includes(channel) ? "selected" : ""
                }`}
                onClick={() => toggleChannel(channel)}
              >
                {channel}
              </div>
            ))}
          </div>
        )}
      </div>

      <label>
        Start Date:
        <input
          type="date"
          name="dateStart"
          value={filters.dateStart || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="dateEnd"
          value={filters.dateEnd || ''}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default TelegramFilterInputs;
