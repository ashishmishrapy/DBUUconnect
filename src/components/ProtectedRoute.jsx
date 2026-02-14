import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import Loading from "./common/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
