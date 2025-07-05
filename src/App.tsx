import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Auth from "./pages/layout/AuthLayout";
import { LoginForm } from "./components/login-form";
import { SignupForm } from "./components/signup-form";
import DashboardLayout from "./pages/layout/DashboardLayout";
import LostItem from "./pages/LostItem";
function App() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="about" element={<About />} />

      
      <Route path="auth" element={<Auth />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<SignupForm />} />
      </Route>

      <Route path="home" element={<DashboardLayout/>}>
        <Route path="lost-item" element={<LostItem />} />
      </Route>
    </Routes>
  );
}

export default App;
