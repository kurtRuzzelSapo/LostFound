import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      className={cn("flex flex-col gap-6 text-white", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up your account</h1>
        <p className="text-sm text-balance">
          Enter your email below to Sign up to your account
        </p>
      </div>
      <div className="grid gap-6 ">
        <div className="grid gap-3">
          <Label htmlFor="email">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            required
            className="placeholder:text-white border-[#31C358]  bg-black/15 "
          />
        </div>
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
          </div>
          <Input
            id="password"
            type="password"
            required
            className="placeholder:text-white border-[#31C358]  bg-black/15 "
          />
        </div>
        <Button type="submit" className="w-full bg-[#3A6035]">
          Sign up
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to={"/auth/login"}>
          <span className="underline underline-offset-4">Sign up</span>
        </Link>
      </div>
    </form>
  );
}
