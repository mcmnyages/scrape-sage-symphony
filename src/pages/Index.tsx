
import { useEffect } from "react";
import { motion } from "framer-motion";
import ScrapeForm from "@/components/ScrapeForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  // Apply smooth scrolling globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[60%] right-[-5%] w-[30%] h-[30%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[60%] w-[25%] h-[25%] bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '18s', animationDelay: '4s' }} />
      </div>
      
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Powerful{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Web Scraping
            </span>
          </motion.h1>
          
          <motion.p 
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Extract structured data from any website with intuitive patterns and templates.
          </motion.p>
        </motion.div>
        
        <ScrapeForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
