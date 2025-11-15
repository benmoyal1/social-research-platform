import { useEffect, useState } from "react";
import "./App.css";
import LoginScreen from "./screens/LoginScreen";
import ResearchScreen from "./screens/ResearchScreen";

const SESSION_DURATION_MS: number = 3 * 60 * 60 * 1000; // 3 hours

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) return false;
    const now = Date.now();
    const isExpired = now - parseInt(loginTime, 10) > SESSION_DURATION_MS;
    return !isExpired && localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
      if (!localStorage.getItem("loginTime")) {
        localStorage.setItem("loginTime", Date.now().toString());
      }
    } else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loginTime");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem("loginTime");
      // console.log(Date.now() - parseInt(loginTime, 10))
      if (loginTime && Date.now() - parseInt(loginTime, 10) > SESSION_DURATION_MS) {
        setIsLoggedIn(false); // auto logout
      }
    };
    const interval = setInterval(checkSession, 10 * 60 * 1000); // every 10 min
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="App">
        {isLoggedIn ? (
            <ResearchScreen />
        ) : (
            <LoginScreen onLogin={setIsLoggedIn} />
        )}
      </div>
  );
}

export default App;
