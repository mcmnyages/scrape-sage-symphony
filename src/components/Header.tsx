
import { motion } from "framer-motion";
import { Database, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isMobile = useIsMobile();

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

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass-panel px-6 py-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-medium">WebScraper</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
        
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4 mt-8">
                <a href="#" className="text-lg hover:text-primary transition-colors">Home</a>
                <a href="#" className="text-lg hover:text-primary transition-colors">Templates</a>
                <a href="#" className="text-lg hover:text-primary transition-colors">History</a>
                <a href="#" className="text-lg hover:text-primary transition-colors">Help</a>
              </nav>
            </SheetContent>
          </Sheet>
        )}
        
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#" className="hover:text-primary transition-colors">Templates</a>
            <a href="#" className="hover:text-primary transition-colors">History</a>
            <a href="#" className="hover:text-primary transition-colors">Help</a>
          </nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
