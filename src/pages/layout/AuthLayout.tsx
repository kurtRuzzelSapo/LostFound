// import { GalleryVerticalEnd } from "lucide-react";
import { Outlet } from "react-router";
const Auth = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-[#31C358] flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
        
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Auth;
