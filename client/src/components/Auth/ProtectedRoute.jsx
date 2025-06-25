import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";
import { useEffect, useState } from "react";
import LoadingSpinner from "../Loading/LoadingSpinner";

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
