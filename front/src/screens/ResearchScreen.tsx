import React, { useState } from "react";
import TwitterDashboard from "../components/dashboards/TwitterDashboard";
import TelegramDashboard from "../components/dashboards/TelegramDashboard";
import { removeAuthToken } from "../services/api";
import { DataType } from "../types";
import "./css/ResearchScreen.css";

const ResearchScreen: React.FC = () => {
  const [selectedDashboard, setSelectedDashboard] = useState<DataType>("telegram");

  const handleLogout = (): void => {
    removeAuthToken();
    window.location.reload();
  };

  const universitiesLogos = process.env.PUBLIC_URL + "/universitiesLogos.png";

  return (
    <div className="research-screen">
      <nav className="top-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h1>Research Platform</h1>
            <p className="navbar-subtitle">Israel War Social Media Analysis</p>
          </div>

          <div className="navbar-tabs">
            <button
              className={"nav-tab " + (selectedDashboard === "telegram" ? "active" : "")}
              onClick={() => setSelectedDashboard("telegram")}
            >
              <span className="tab-icon">Telegram</span>
              <span className="tab-label">Telegram</span>
            </button>
            <button
              className={"nav-tab " + (selectedDashboard === "twitter" ? "active" : "")}
              onClick={() => setSelectedDashboard("twitter")}
            >
              <span className="tab-icon">Twitter</span>
              <span className="tab-label">Twitter</span>
            </button>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h2>October 7th War Data Analysis</h2>
          <p>
            Explore comprehensive data from various channels covering politics, foreign
            administration, and newspapers. Filter and analyze social media activity
            related to the conflict.
          </p>
        </div>
      </div>

      <div className="main-content">
        {selectedDashboard === "twitter" && <TwitterDashboard />}
        {selectedDashboard === "telegram" && <TelegramDashboard />}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Prof Ilan Manor: <a href="mailto:manor.ilan@gmail.com">manor.ilan@gmail.com</a></p>
            <p>Prof Orly Manor: <a href="mailto:orlyma@ekmd.huji.ac.il">orlyma@ekmd.huji.ac.il</a></p>
          </div>

          <div className="footer-section">
            <h3>About the Project</h3>
            <p>Research platform for analyzing social media data related to the Israel-Hamas war</p>
          </div>

          {universitiesLogos && (
            <div className="footer-section footer-logos">
              <img src={universitiesLogos} alt="University Logos" className="university-logos" />
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Research Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ResearchScreen;
