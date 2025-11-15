import React, { useState } from "react";
import { saveAuthToken } from "../services/api";
import { LoginScreenProps } from "../types";
import "./css/LoginScreen.css";

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const universitiesLogos = `${process.env.PUBLIC_URL}/universitiesLogos.png`;
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/login/ilan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();

      // Save JWT token to localStorage
      if (data.token) {
        saveAuthToken(data.token);
      }

      onLogin(true);
      setUsername("");
      setPassword("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Top Section */}
      <div className="top-section">
        <p>Welcome to the Data Bank Website! Please login to continue.</p>
      </div>

      {/* Center Section */}
      <div className="center-section">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="logo-container">
          <img src={universitiesLogos} alt="Logo 1" className="logo" />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
