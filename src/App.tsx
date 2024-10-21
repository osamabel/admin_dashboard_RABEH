import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './layouts/Dashboard';
import Ranking from './pages/Ranking';
import Users from './pages/Users';
import Sponsors from './pages/Sponsors';
import QuizCreator from './components/Quiz';
import Reports from './pages/Reports';


const ProtectedRoute = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await fetch("/api/auth/status", {
  //         method: "GET",
  //         credentials: "include",
  //       });
  //       const data = await response.json();
  //       if (data.status === "Authenticated") {
  //         setIsAuthenticated(true);
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //     }
  //   };
    
  //   checkAuth();
  // }, []);

  // if (isAuthenticated === null) {
  //   return <div>Loading...</div>;
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

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
            <Route path="/newQuiz" element={<QuizCreator />} />
          </Route>
        </Route>
      </Routes>
  
  )
}

export default App
