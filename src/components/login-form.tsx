import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/home/lost-item");
    }
  }, [user, navigate]);

  // Add your own signInWithEmail function in AuthContext or here
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = await signInWithEmail(email, password);
    if (!error) {
      // user will be set, useEffect will redirect
    } else {
      // handle error (show message)
    }
  };

  return (
    <>
      <form
        className={cn("flex flex-col gap-6 text-white", className)}
        {...props}
        onSubmit={handleSubmit}
      >
        <div className=" text-white flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className=" text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6 ">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="placeholder:text-white border-[#31C358]  bg-black/15 "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              className="placeholder:text-white border-[#31C358]  bg-black/15 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-[#3A6035]">
            Login
          </Button>
          <div className="text-black after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-[#31C358] text-white relative z-10 px-2">
              Or continue with
            </span>
          </div>
        </div>
      </form>
      <Button
        onClick={signInWithGoogle}
        variant="outline"
        className="w-full text-black flex items-center gap-2 m-2"
      >
        <FcGoogle size={20} />
        Login with Google
      </Button>

      <div className="text-center text-sm text-white">
        Don&apos;t have an account?{" "}
        <Link to={"/auth/signup"}>
          <span className="underline underline-offset-4">Sign up</span>
        </Link>
      </div>
    </>
  );
}
