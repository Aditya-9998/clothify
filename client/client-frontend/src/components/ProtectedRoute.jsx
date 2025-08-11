import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  // 👤 Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // 🚫 Admin-only route but user is not admin
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
