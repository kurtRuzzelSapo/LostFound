import * as React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import { SearchForm } from "@/components/search-form"
// import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LogOutIcon,
  MessageCircle,
  PackageSearch,
  Search,
  User,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    // {
    //   title: "Getting Started",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Installation",
    //       url: "#",
    //     },
    //     {
    //       title: "Project Structure",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      items: [
        {
          icon: <Search className="w-5 h-5" />,
          title: "Lost Item",
          url: "/home/lost-item",
          isActive: true,
        },
        {
          icon: <PackageSearch className="w-5 h-5" />,
          title: "Found Item",
          url: "/home/found-item",
        },
        {
          icon: <MessageCircle className="w-5 h-5" />,
          title: "Messaging",
          url: "/home/messaging",
        },
        {
          icon: <User className="w-5 h-5" />,
          title: "Profile",
          url: "/home/profile",
        },
      ],
    },
    // {
    //   title: "API Reference",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Components",
    //       url: "#",
    //     },
    //     {
    //       title: "File Conventions",
    //       url: "#",
    //     },
    //     {
    //       title: "Functions",
    //       url: "#",
    //     },
    //     {
    //       title: "next.config.js Options",
    //       url: "#",
    //     },
    //     {
    //       title: "CLI",
    //       url: "#",
    //     },
    //     {
    //       title: "Edge Runtime",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Architecture",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Accessibility",
    //       url: "#",
    //     },
    //     {
    //       title: "Fast Refresh",
    //       url: "#",
    //     },
    //     {
    //       title: "Next.js Compiler",
    //       url: "#",
    //     },
    //     {
    //       title: "Supported Browsers",
    //       url: "#",
    //     },
    //     {
    //       title: "Turbopack",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };

    if (showLogoutModal) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showLogoutModal]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    setShowLogoutModal(false);

    try {
      // Sign out first
      await signOut();

      // Navigate after successful signout
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate even if there's an error
      navigate("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleModalBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <Sidebar
        {...props}
        className="group peer text-sidebar-foreground hidden md:block rounded-r-lg"
      >
        <SidebarHeader>
          {/* <VersionSwitcher
            versions={data.versions}
            defaultVersion={data.versions[0]}
            /> */}
          <div className="flex items-center gap-1 font-bold m-2 ">
            <img
              src="/FI_logo.png"
              alt="logo"
              className="w-10 h-9 rounded-full"
            />
            {/* <MapPin /> */}
            <h1 className="text-lg font-bold"> FindIt.</h1>
          </div>
          {/* <SearchForm /> */}
        </SidebarHeader>
        <SidebarContent>
          {/* We create a SidebarGroup for each parent. */}
          {data.navMain.map((item) => (
            <SidebarGroup>
              {/* <SidebarGroupLabel>{item.title}</SidebarGroupLabel> */}
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.startsWith(item.url)}
                      >
                        <Link to={item.url}>
                          {item.icon}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 justify-start mb-4"
          onClick={() => setShowLogoutModal(true)}
          disabled={isLoggingOut}
        >
          <LogOutIcon
            className={`w-5 h-5 ${isLoggingOut ? "animate-spin" : ""}`}
          />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
        <SidebarRail />
      </Sidebar>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Logout
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Are you sure you want to log out?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
