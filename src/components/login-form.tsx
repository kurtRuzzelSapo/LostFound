import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
  import { FcGoogle } from "react-icons/fc";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      className={cn("flex flex-col gap-6 text-white", className)}
      {...props}
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
      
        <Button
          variant="outline"
          className="w-full text-black flex items-center gap-2"
        >
          <FcGoogle size={20} />
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to={"/auth/signup"}>
          <span className="underline underline-offset-4">Sign up</span>
        </Link>
      </div>
    </form>
  );
}
