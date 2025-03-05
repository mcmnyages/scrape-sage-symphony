
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PatternBuilder, { PatternItem } from "./PatternBuilder";
import ResultsDisplay from "./ResultsDisplay";
import HistoryDrawer from "./HistoryDrawer";
import { ScrapeRequest, ScrapeResult, scrapeWebsite } from "@/utils/scrapeService";

const ScrapeForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [patterns, setPatterns] = useState<PatternItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }
    
    if (patterns.length === 0) {
      toast({
        title: "No patterns defined",
        description: "Please add at least one pattern to extract data",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const request: ScrapeRequest = {
        url,
        patterns: patterns.map(p => ({
          name: p.name,
          type: p.type,
          selector: p.selector,
        })),
        options: {
          includeHtml: true,
          includeText: true,
        }
      };
      
      const response = await scrapeWebsite(request);
      setResult(response);
      
      if (response.status === 'success') {
        toast({
          title: "Scraping completed",
          description: "Data has been successfully extracted",
        });
      } else {
        toast({
          title: "Scraping failed",
          description: response.message || "An error occurred during scraping",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Scrape error:', error);
      toast({
        title: "Scraping failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (historyItem: ScrapeResult) => {
    setResult(historyItem);
    setUrl(historyItem.url);
    
    // Reconstruct patterns from the history item
    const reconstructedPatterns = historyItem.data.map(group => ({
      id: Math.random().toString(36).slice(2, 11),
      name: group.pattern,
      type: group.type as any,
      selector: group.selector
    }));
    
    setPatterns(reconstructedPatterns);
    
    toast({
      title: "History item loaded",
      description: "Previous scrape data and settings loaded",
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.form 
        onSubmit={handleSubmit}
        className="glass-panel rounded-xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium">Web Scraper</h2>
            <p className="text-muted-foreground mt-1">
              Extract data from any website with custom patterns
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <HistoryDrawer onSelectResult={handleHistorySelect} />
          </div>
        </div>
        
        <Tabs defaultValue="basic" className="w-full mb-6">
          <TabsList className="grid grid-cols-2 max-w-md mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <Glob className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !url} 
                  className="ml-2 shrink-0"
                >
                  Scrape
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <PatternBuilder patterns={patterns} setPatterns={setPatterns} />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Advanced Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delay" className="text-sm">Delay (ms)</Label>
                  <Input 
                    id="delay" 
                    type="number" 
                    defaultValue="0" 
                    min="0" 
                    className="mt-1" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Delay between requests to avoid rate limits
                  </p>
                </div>
                <div>
                  <Label htmlFor="depth" className="text-sm">Max Depth</Label>
                  <Input 
                    id="depth" 
                    type="number" 
                    defaultValue="1" 
                    min="1" 
                    max="5" 
                    className="mt-1" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum link traversal depth
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Note: Advanced options require a server-side implementation for actual web scraping.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.form>
      
      <ResultsDisplay result={result} loading={loading} />
    </div>
  );
};

export default ScrapeForm;
