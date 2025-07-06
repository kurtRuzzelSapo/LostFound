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
} from "lucide-react";
import { Button } from "./ui/button";

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
  return (
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
        onClick={() => navigate("/auth/login")}
      >
        <LogOutIcon className="w-5 h-5" />
        Logout
      </Button>
      <SidebarRail />
    </Sidebar>
  );
}
