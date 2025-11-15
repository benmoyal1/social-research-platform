import React, { useState, useEffect, useRef } from "react";
import "./css/TwitterFilterinputs.css";
import { twitterUniqueUsers } from "../../utils/twitterUniqueUsers";

const TwitterFilterInputs = ({
  filters,
  handleChange,
  handleAddFeatureItem,
  handleRemoveItem,
}) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [hashtagsInput, setHashtagsInput] = useState("");
  const [taggedUsersInput, setTaggedUsersInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null); // Reference for the tooltip

    // Automatically hide tooltip after 3 seconds
    useEffect(() => {
        if (showTooltip) {
            const timer = setTimeout(() => setShowTooltip(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showTooltip]);

    // Hide tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowTooltip(false);
            }
        };

        if (showTooltip) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showTooltip]);
  const handleKeyDown = (feature, e, setStateFun, featureInput) => {
    console.log(e.type === "input");
    if ((e.key === "Enter" || e.type === "input") && featureInput.trim()) {
      handleAddFeatureItem(feature, featureInput.trim());
      setStateFun(""); // Clear input after adding
    }
  };

  return (
    <div className="twitter-filter-container">
      {/* User Posted */}
      <label>
        User Posted:
        <input
          list="userPostedOptions"
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          onInput={(e) => {
            const selectedValue = e.target.value;
            if (twitterUniqueUsers.includes(selectedValue)) {
              handleKeyDown("user_posted", e, setUsernameInput, selectedValue);
              setTimeout(() => setUsernameInput(""), 0);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleKeyDown("user_posted", e, setUsernameInput, usernameInput);
            }
          }}
          placeholder="Enter Username"
        />
      </label>

      <datalist id="userPostedOptions">
        {twitterUniqueUsers.map((user, index) => (
          <option key={index} value={user} />
        ))}
      </datalist>

      <div className="username-dropdown">
        {filters.user_posted.map((user, index) => (
          <div
            key={index}
            className="dropdown-item"
            onClick={() => handleRemoveItem("user_posted", user)}
          >
            {user}
            <span className="remove-x"> ×</span>
          </div>
        ))}
      </div>

        {/* Description */}
        <label
            style={{ position: "relative", display: "flex", alignItems: "center" }}
        >
        <span
            style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
            }}
        >
          Description
          <span
              style={{
                  marginLeft: "5px",
                  backgroundColor: "#0078ff",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  position: "relative",
              }}
              className="info-icon"
              onClick={() => setShowTooltip(true)}
              ref={tooltipRef}
          >
            i
              {showTooltip && (
                  <div
                      ref={tooltipRef}
                      style={{
                          position: "absolute",
                          top: "30px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: "#0078ff",
                          color: "#fff",
                          textAlign: "center",
                          borderRadius: "12px",
                          padding: "12px",
                          width: "250px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                          zIndex: 10,
                          fontSize: "13px",
                          fontWeight: "normal",
                          whiteSpace: "normal",
                      }}
                  >
                      Tweets matching this filter will include this description.
                  </div>
              )}
          </span>
        </span>

            <input
                type="text"
                name="description"
                value={filters.description}
                onChange={handleChange}
                placeholder="Enter Description"
                style={{ marginLeft: "10px" }}
            />
        </label>
      {/* Hashtags */}
      <label>
        Hashtags:
        <input
          type="text"
          name="hashtags"
          value={hashtagsInput}
          onChange={(e) => setHashtagsInput(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown("hashtags", e, setHashtagsInput, hashtagsInput)
          }
          placeholder="Enter Hashtags"
        />
      </label>

      {filters.hashtags.length > 0 && (
        <div className="hashtags-dropdown">
          {filters.hashtags.map((hashtag, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleRemoveItem("hashtags", hashtag)}
            >
              {hashtag}
              <span className="remove-x"> x</span>
            </div>
          ))}
        </div>
      )}
      <label>
        Tagged Users:
        <input
          type="text"
          name="tagged_users"
          value={taggedUsersInput}
          onChange={(e) => setTaggedUsersInput(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(
              "tagged_users",
              e,
              setTaggedUsersInput,
              taggedUsersInput
            )
          }
          placeholder="Enter Tagged Users"
        />
      </label>
      {filters.tagged_users.length > 0 && (
        <div className="hashtags-dropdown">
          {filters.tagged_users.map((tagged_user, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleRemoveItem("tagged_users", tagged_user)}
            >
              {tagged_user}
              <span className="remove-x"> x</span>
            </div>
          ))}
        </div>
      )}

      {/* Start Date */}

      <label>
        Date:
        <div className="range-inputs">
          <input
            type="date"
            name="startDate"
            value={filters.dateMin}
            onChange={handleChange}
          />
          <span> - </span>
          <input
            type="date"
            name="endDate"
            value={filters.dateMax}
            onChange={handleChange}
          />
        </div>
      </label>
      {/*  */}
      {/* Replies Range */}
      <label>
        Replies Range:
        <div className="range-inputs">
          <input
            type="number"
            name="repliesMin"
            value={filters.repliesMin === 0 ? "" : filters.repliesMin}
            onChange={handleChange}
            placeholder="Min Replies"
            className="half-width"
          />
          <span>-</span>
          <input
            type="number"
            name="repliesMax"
            value={
              filters.repliesMax === Number.MAX_SAFE_INTEGER
                ? ""
                : filters.repliesMax
            }
            onChange={handleChange}
            placeholder="Max Replies"
            className="half-width"
          />
        </div>
      </label>

      {/* Reposts Range */}
      <label>
        Reposts Range:
        <div className="range-inputs">
          <input
            type="number"
            name="repostsMin"
            value={filters.repostsMin === 0 ? "" : filters.repostsMin}
            onChange={handleChange}
            placeholder="Min Reposts"
            className="half-width"
          />
          <span>-</span>
          <input
            type="number"
            name="repostsMax"
            value={
              filters.repostsMax === Number.MAX_SAFE_INTEGER
                ? ""
                : filters.repostsMax
            }
            onChange={handleChange}
            placeholder="Max Reposts"
            className="half-width"
          />
        </div>
      </label>

      {/* Likes Range */}
      <label>
        Likes Range:
        <div className="range-inputs">
          <input
            type="number"
            name="likesMin"
            value={filters.likesMin === 0 ? "" : filters.likesMin}
            onChange={handleChange}
            placeholder="Min Likes"
            className="half-width"
          />
          <span>-</span>
          <input
            type="number"
            name="likesMax"
            value={
              filters.likesMax === Number.MAX_SAFE_INTEGER
                ? ""
                : filters.likesMax
            }
            onChange={handleChange}
            placeholder="Max Likes"
            className="half-width"
          />
        </div>
      </label>

      {/* Views Range */}
      <label>
        Views Range:
        <div className="range-inputs">
          <input
            type="number"
            name="viewsMin"
            value={filters.viewsMin === 0 ? "" : filters.viewsMin}
            onChange={handleChange}
            placeholder="Min Views"
            className="half-width"
          />
          <span>-</span>
          <input
            type="number"
            name="viewsMax"
            value={
              filters.viewsMax === Number.MAX_SAFE_INTEGER
                ? ""
                : filters.viewsMax
            }
            onChange={handleChange}
            placeholder="Max Views"
            className="half-width"
          />
        </div>
      </label>
    </div>
  );
};

export default TwitterFilterInputs;
