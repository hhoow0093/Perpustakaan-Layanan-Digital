import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard/admin/:adminID"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user/:userID"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
