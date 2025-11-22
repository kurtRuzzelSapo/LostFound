// src/components/ProtectedRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile"; // Import your hook
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  allowedRoles = [] 
}: ProtectedRouteProps = {}) {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile(); // Use your hook
  const location = useLocation();

  const isLoading = authLoading || profileLoading;

  // Show loading screen while checking auth and profile
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access if specific roles are required
  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    console.log(`Access denied. User role: ${profile.role}, Required: ${allowedRoles}`);
    
    // Smart redirect based on user's actual role
    if (profile.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/home/dashboard" replace />;
    }
  }

  // Debug: Check what role you have
  console.log("Access granted. User role:", profile?.role);

  return <Outlet />;
}