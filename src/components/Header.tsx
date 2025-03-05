
import { motion } from "framer-motion";
import { Database, Menu, Moon, Sun, FileText, Settings as SettingsIcon, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/templates", label: "Templates" },
    { path: "/help", label: "Help" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass-panel px-6 py-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-medium">WebScraper</h1>
      </Link>
      
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <TooltipArrow />
              {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`text-lg hover:text-primary transition-colors ${
                      location.pathname === item.path ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        )}
        
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`relative hover:text-primary transition-colors ${
                  location.pathname === item.path ? 'text-primary font-medium' : ''
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        )}
        
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/help">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <TooltipArrow />
                  Help & Documentation
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/settings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <TooltipArrow />
                  Settings
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
