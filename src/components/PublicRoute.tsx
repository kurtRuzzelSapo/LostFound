import { useAuth } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

const PublicRoute = () => {
    const { user } = useAuth()
    
  if (user) {
    return <Navigate to="/home/lost-item" replace />;
  }

  return <Outlet/>
}

export default PublicRoute