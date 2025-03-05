
import { useState } from "react";
import { Code, Copy, Download, Archive, Check, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrapeResult } from "@/utils/scrapeService";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  result: ScrapeResult | null;
  loading: boolean;
}

const ResultsDisplay = ({ result, loading }: ResultsDisplayProps) => {
  const { toast } = useToast();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  if (loading) {
    return (
      <motion.div 
        className="mt-6 glass-panel rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary border-opacity-20 rounded-full"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-l-primary border-t-primary border-opacity-80 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium animate-pulse">Scraping website...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments</p>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.status === 'error') {
    return (
      <motion.div 
        className="mt-6 glass-panel rounded-xl p-8 border-destructive"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <h3 className="text-xl font-medium text-destructive mb-2">Scraping Failed</h3>
          <p className="text-muted-foreground">{result.message || 'An unknown error occurred while scraping the website.'}</p>
        </div>
      </motion.div>
    );
  }

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The data has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Copy failed",
        description: "Could not copy data to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(result.data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `scrape-${result.url.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().slice(0, 10)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${exportName}.json`);
    linkElement.click();
  };

  const downloadCsv = () => {
    let csv = '';
    
    // Process each pattern group
    result.data.forEach(group => {
      csv += `"${group.pattern} (${group.type})"\n`;
      
      // Get all possible keys from items
      const allKeys = new Set<string>();
      group.items.forEach((item: any) => {
        Object.keys(item).forEach(key => allKeys.add(key));
      });
      
      // Header row
      const keys = Array.from(allKeys);
      csv += keys.map(key => `"${key}"`).join(',') + '\n';
      
      // Data rows
      group.items.forEach((item: any) => {
        const row = keys.map(key => {
          const value = item[key];
          const cellValue = typeof value === 'object' ? JSON.stringify(value) : value;
          return `"${cellValue?.toString().replace(/"/g, '""') || ''}"`;
        });
        csv += row.join(',') + '\n';
      });
      
      csv += '\n'; // Add empty line between groups
    });
    
    const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    const exportName = `scrape-${result.url.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().slice(0, 10)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${exportName}.csv`);
    linkElement.click();
  };

  return (
    <motion.div 
      className="mt-6 glass-panel rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium">Scraped Results</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        
        <div className="flex space-x-2 self-end sm:self-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={downloadJson}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            JSON
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={downloadCsv}
          >
            <Archive className="h-3.5 w-3.5 mr-1" />
            CSV
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="visual" className="w-full">
        <div className="px-6 pt-4 border-b">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="visual" className="p-0 m-0">
          <ScrollArea className="h-[400px] sm:h-[500px]">
            <div className="p-6">
              <AnimatePresence>
                {result.data.map((group, i) => (
                  <motion.div 
                    key={`group-${i}`}
                    className="mb-6 last:mb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div 
                      className="flex items-center justify-between bg-secondary/50 p-3 rounded-t-lg cursor-pointer"
                      onClick={() => toggleGroup(`group-${i}`)}
                    >
                      <div>
                        <span className="font-medium">{group.pattern}</span>
                        <span className="text-xs ml-2 bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {group.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {group.items.length} items
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          {expandedGroups[`group-${i}`] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedGroups[`group-${i}`] && (
                        <motion.div 
                          className="border rounded-b-lg border-t-0 divide-y"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {group.items.length > 0 ? (
                            group.items.map((item: any, j: number) => (
                              <div key={`item-${i}-${j}`} className="p-3 text-sm">
                                {Object.entries(item).map(([key, value]) => {
                                  if (key === 'id') return null;
                                  return (
                                    <div key={key} className="mb-1 last:mb-0">
                                      <span className="font-medium text-xs text-muted-foreground inline-block w-24">
                                        {key}:
                                      </span>
                                      <span>
                                        {typeof value === 'object' 
                                          ? JSON.stringify(value) 
                                          : String(value)
                                        }
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-muted-foreground">
                              No items found for this pattern
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="raw" className="p-0 m-0">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-4 top-4 z-10"
              onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </Button>
            
            <ScrollArea className="h-[400px] sm:h-[500px] bg-secondary/30 rounded-b-lg font-mono text-sm">
              <div className="p-6 pt-16">
                <pre>{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ResultsDisplay;
