import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

// Wraps any route that requires authentication
// Redirects to /login if no token is present
export default function ProtectedRoute({ children }) {
  const { token } = useApp();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}