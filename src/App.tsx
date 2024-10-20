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
  const isAuthenticated = !!localStorage.getItem('token');
  
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
