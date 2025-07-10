import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Auth from "./pages/layout/AuthLayout";
import { LoginForm } from "./components/login-form";
import { SignupForm } from "./components/signup-form";
import DashboardLayout from "./pages/layout/DashboardLayout";
import LostItem from "./pages/LostItem";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import FoundItem from "./pages/FoundItem";
import CreateFoundItem from "./components/create-found-item";
import CreateLostItem from "./components/create-lost-item";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {

  const location = useLocation();

 

  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
        <Route index element={<Landing />} />
        </Route>
        <Route path="about" element={<About />} />

        {/* Authentication */}
        <Route path="auth" element={<PublicRoute />}>
        <Route  element={<Auth />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
        </Route>
        </Route>

        <Route path="home" element={<ProtectedRoute />}>  
        <Route  element={<DashboardLayout />}>
          <Route path="lost-item" element={<LostItem />} />
          <Route path="found-item" element={<FoundItem />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* Floating Button */}
      {location.pathname === "/home/lost-item" && <CreateLostItem />}
      {location.pathname === "/home/found-item" && <CreateFoundItem />}
    </>
  );
}

export default App;
