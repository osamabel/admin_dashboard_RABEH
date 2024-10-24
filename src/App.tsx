import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./layouts/Dashboard";
import Ranking from "./pages/Ranking";
import Users from "./pages/Users";
import Sponsors from "./pages/Sponsors";
import QuizCreator from "./components/Quiz";
import Reports from "./pages/Reports";
import { useEffect, useState } from "react";
import Store from "./pages/Store";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await fetch("http://10.32.108.154:3000/auth/check-auth", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        const data = await response.json();
        if (data.status === "Authenticated") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    // Add a small delay to ensure cookie is set
    setTimeout(checkAuth, 100);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Dashboard />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/users" element={<Users />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/store" element={<Store />} />
          <Route path="/newQuiz" element={<QuizCreator />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
