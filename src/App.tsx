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
import Feedback from "./pages/Feedback";

const apiUrl = import.meta.env.VITE_API_URL;

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await fetch(
          `${apiUrl}/auth/check-auth`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "include",
          }
        );

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
    return <div>Loading...6</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/تسجيل-الدخول" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Routes>
    <Route path="/تسجيل-الدخول" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Dashboard />}>
        <Route path="/" element={<Navigate to="/الرئيسية" replace />} />
        <Route path="/الرئيسية" element={<Home />} />
        <Route path="/التصنيف" element={<Ranking />} />
        <Route path="/المستخدمين" element={<Users />} />
        <Route path="/الرعاة" element={<Sponsors />} />
        <Route path="/التقارير" element={<Reports />} />
        <Route path="/المتجر" element={<Store />} />
        <Route path="/اختبار-جديد" element={<QuizCreator />} />
        <Route path="/التعليقات" element={<Feedback />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  );
}

export default App;
