
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Server, Sparkles, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const [includeHtml, setIncludeHtml] = useState(true);
  const [includeText, setIncludeText] = useState(true);
  const [maxDepth, setMaxDepth] = useState(1);
  const [requestDelay, setRequestDelay] = useState(0);

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
          includeHtml,
          includeText,
          maxDepth,
          requestDelay,
        }
      };
      
      const response = await scrapeWebsite(request);
      setResult(response);
      
      if (response.status === 'success') {
        toast({
          title: "Scraping completed",
          description: `Extracted ${response.data.reduce((acc, group) => acc + group.items.length, 0)} items successfully`,
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

  const handleClearForm = () => {
    setUrl("");
    setPatterns([]);
    setResult(null);
    toast({
      title: "Form cleared",
      description: "All form data has been reset",
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.form 
        onSubmit={handleSubmit}
        className="glass-panel rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Web Scraper
            </h2>
            <p className="text-muted-foreground mt-1">
              Extract data from any website with custom patterns
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleClearForm}
            >
              Clear
            </Button>
            <HistoryDrawer onSelectResult={handleHistorySelect} />
          </div>
        </div>
        
        <Tabs defaultValue="basic" className="w-full mb-6">
          <TabsList className="grid grid-cols-2 max-w-md mb-4 bg-secondary/50">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">Website URL</Label>
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="submit" 
                        disabled={loading || !url} 
                        className="ml-2 shrink-0"
                      >
                        {loading ? "Scraping..." : "Scrape"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Start scraping the website
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <PatternBuilder patterns={patterns} setPatterns={setPatterns} />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <Card className="p-5 bg-secondary/30">
              <h3 className="font-medium mb-4 flex items-center">
                <Server className="h-4 w-4 mr-2" /> 
                Advanced Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="delay" className="text-sm">Request Delay (ms)</Label>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input 
                        id="delay" 
                        type="number" 
                        value={requestDelay}
                        onChange={(e) => setRequestDelay(Number(e.target.value))}
                        min="0" 
                        className="w-full" 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Delay between requests to avoid rate limits
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="depth" className="text-sm">Max Traversal Depth</Label>
                    <Input 
                      id="depth" 
                      type="number" 
                      value={maxDepth}
                      onChange={(e) => setMaxDepth(Number(e.target.value))}
                      min="1" 
                      max="5" 
                      className="mt-1" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum link traversal depth (1-5)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Include Content Types</h4>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="includeHtml" 
                      checked={includeHtml}
                      onCheckedChange={(checked) => setIncludeHtml(!!checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label 
                        htmlFor="includeHtml" 
                        className="text-sm font-medium cursor-pointer"
                      >
                        Include HTML
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Extract raw HTML content
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="includeText" 
                      checked={includeText}
                      onCheckedChange={(checked) => setIncludeText(!!checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label 
                        htmlFor="includeText" 
                        className="text-sm font-medium cursor-pointer"
                      >
                        Include Text
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Extract plain text content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2">Export Options</h4>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" disabled={!result}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    JSON
                  </Button>
                  <Button size="sm" variant="outline" disabled={!result}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    CSV
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.form>
      
      <ResultsDisplay result={result} loading={loading} />
    </div>
  );
};

export default ScrapeForm;
