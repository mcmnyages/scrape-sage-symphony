
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Save, Download, Plus, Filter, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PatternItem } from "@/components/PatternBuilder";
import { ScrapeOptions } from "@/utils/scrapeService";

interface Template {
  id: string;
  name: string;
  description: string;
  url: string;
  patterns: PatternItem[];
  options: ScrapeOptions;
  createdAt: string;
  lastUsed?: string;
}

// Local storage key for templates
const TEMPLATES_STORAGE_KEY = 'scrapeTemplates';

const Templates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");

  // Load templates from local storage on component mount
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Error loading templates from local storage:', error);
      toast({
        title: "Error",
        description: "Failed to load saved templates",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Save templates to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Template deleted",
      description: "The template has been removed",
    });
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your template",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      description: newTemplateDescription,
      url: "https://example.com",
      patterns: [],
      options: {
        includeHtml: true,
        includeText: true,
        maxDepth: 1,
        requestDelay: 0,
      },
      createdAt: new Date().toISOString(),
    };

    setTemplates([...templates, newTemplate]);
    setNewTemplateName("");
    setNewTemplateDescription("");
    toast({
      title: "Template created",
      description: "New template has been created. Edit it to add patterns.",
    });
  };

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else { // "last-used"
        const aLastUsed = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
        const bLastUsed = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
        return bLastUsed - aLastUsed;
      }
    });

  return (
    <div className="min-h-screen relative">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[25%] h-[25%] bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '18s', animationDelay: '4s' }} />
      </div>
      
      <Header />
      
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Scraping Templates</h1>
          <p className="text-muted-foreground">Save and reuse your scraping configurations</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar with filters and new template form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Create Template</CardTitle>
                  <CardDescription>Add a new scraping template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="templateName" className="text-sm font-medium block mb-1">
                      Template Name
                    </label>
                    <Input
                      id="templateName"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="My Scraping Template"
                    />
                  </div>
                  <div>
                    <label htmlFor="templateDescription" className="text-sm font-medium block mb-1">
                      Description
                    </label>
                    <Input
                      id="templateDescription"
                      value={newTemplateDescription}
                      onChange={(e) => setNewTemplateDescription(e.target.value)}
                      placeholder="What this template is for"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCreateTemplate} 
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>Sort and filter templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="search" className="text-sm font-medium block mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search templates..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sortBy" className="text-sm font-medium block mb-1">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="last-used">Last Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Templates grid */}
          <div className="md:col-span-2 space-y-6">
            {filteredTemplates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-muted/30 rounded-lg p-12 text-center"
              >
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? "Try adjusting your search criteria"
                    : "Create your first template to start scraping faster"
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => document.getElementById('templateName')?.focus()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{template.name}</CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <TooltipArrow />
                                Delete template
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <CardDescription className="line-clamp-2 min-h-[40px]">
                          {template.description || "No description provided"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex items-center text-sm text-muted-foreground gap-x-4">
                          <div className="flex items-center">
                            <span className="font-medium">{template.patterns.length}</span>
                            <span className="ml-1">patterns</span>
                          </div>
                          {template.lastUsed && (
                            <div>
                              Last used: {new Date(template.lastUsed).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex space-x-2 w-full">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Download className="h-4 w-4 mr-2" />
                                  Use
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <TooltipArrow />
                                Load this template
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Save className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <TooltipArrow />
                                Edit template
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Templates;
