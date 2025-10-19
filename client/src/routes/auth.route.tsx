import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_ROUTES } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading, isFetching } = useAuth();
  const user = authData?.user;

  // Check if current route is an auth route
  const isAuthPage = Object.values(AUTH_ROUTES).includes(location.pathname);
  const token = localStorage.getItem('token');

  // Show loading state if we're still checking auth
  if ((isLoading || isFetching) && token) {
    return <DashboardSkeleton />;
  }

  // If user is not authenticated and not on an auth page, redirect to login
  if (!user && !isAuthPage) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and on an auth page, redirect to workspace
  if (user && isAuthPage) {
    return <Navigate to={`/workspace/${user.currentWorkspace?._id}`} replace />;
  }

  // Otherwise, render the requested route
  return <Outlet />;
};

export default AuthRoute;
