import { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { BellIcon, MoonIcon, SunIcon } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  overview: "Dashboard Overview",
  campaigns: "Campaign Management",
  settings: "Settings",
  "": "Dashboard Overview",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const currentPath = location.pathname.split("/")[1] || "overview";
  const currentPage =
    PAGE_TITLES[currentPath] ||
    currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode ? "true" : "false");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header
          className={`sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 transition-all duration-200 ease-in-out bg-background/95 backdrop-blur-sm border-b ${
            isScrolled ? "shadow-sm" : ""
          } group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12`}
        >
          <div className="flex items-center gap-4 px-4 w-full">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="cursor-pointer text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="h-4" />
            </div>

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link
                    to="/overview"
                    className="hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    {currentPage}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex-1"></div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-muted-foreground hover:text-foreground"
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground relative"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary"></span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">{children}</div>

          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Campaign Dashboard. All rights
              reserved.
            </p>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
