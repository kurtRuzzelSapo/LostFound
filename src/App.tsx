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

function App() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="about" element={<About />} />

        {/* Authentication */}
        <Route path="auth" element={<Auth />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
        </Route>

        <Route path="home" element={<DashboardLayout />}>
          <Route path="lost-item" element={<LostItem />} />
          <Route path="found-item" element={<FoundItem />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>

      {/* Floating Button */}
      {location.pathname === "/home/lost-item" && <CreateLostItem />}
      {location.pathname === "/home/found-item" && <CreateFoundItem />}
    </>
  );
}

export default App;
