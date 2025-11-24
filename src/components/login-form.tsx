import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { signInWithGoogle, signInWithEmail, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/home/lost-item");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signInWithEmail(email, password);
      if (!error) {
        // User will be redirected by the useEffect when user state changes
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className={cn("flex flex-col gap-6 text-white", className)}
        {...props}
        onSubmit={handleSubmit}
      >
        {/* Add app branding */}
        <div className="text-white flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2">
            <span className="text-[#31C358] font-bold">LF</span>
          </div>
          <h1 className="text-2xl font-bold">Lost & Found</h1>
          <p className="text-sm text-balance text-gray-300">
            Login to your Lost & Found account
          </p>
        </div>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com" 
              required
              className="placeholder:text-gray-400 border-[#31C358] bg-black/15" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/auth/forgot-password" 
                className="ml-auto text-sm underline-offset-4 hover:underline text-gray-300"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              placeholder="Enter your password" 
              className="placeholder:text-gray-400 border-[#31C358] bg-black/15"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#3A6035] hover:bg-[#31C358]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login to Lost & Found"} {/* More specific */}
          </Button>
          
          {/* Remove the "Or continue with" separator since it's confusing without Google branding */}
        </div>
      </form>

      {/* Make the alternative login method clear */}
      <div className="text-center text-sm text-gray-300 mb-4">
        Alternative login method
      </div>
      
      <Button
        onClick={signInWithGoogle}
        variant="outline"
        className="w-full text-black bg-white hover:bg-gray-100 flex items-center justify-center gap-2 m-2 border-gray-300"
        disabled={isLoading}
      >
        Continue with Google {/* Clear what this button does */}
      </Button>

      <div className="text-center text-sm text-white mt-6">
        Don't have an account?{" "}
        <Link to={"/auth/signup"}>
          <span className="underline underline-offset-4 text-[#31C358]">Sign up</span>
        </Link>
      </div>

      {/* Add privacy links */}
      <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-600">
        By logging in, you agree to our{" "}
        <Link to="/privacy" className="underline hover:text-gray-300">
          Privacy Policy
        </Link>
        {" "}and{" "}
        <Link to="/terms" className="underline hover:text-gray-300">
          Terms of Service
        </Link>
      </div>
    </>
  );
}