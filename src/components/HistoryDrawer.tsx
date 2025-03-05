
import { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Trash2, ExternalLink, Search, Filter, MessageSquare, Check, X } from "lucide-react";
import { ScrapeResult, getScrapeHistory, clearScrapeHistory } from "@/utils/scrapeService";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";

interface HistoryDrawerProps {
  onSelectResult: (result: ScrapeResult) => void;
}

const HistoryDrawer = ({ onSelectResult }: HistoryDrawerProps) => {
  const [history, setHistory] = useState<ScrapeResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScrapeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "error">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    if (open) {
      refreshHistory();
    }
  }, [open]);

  useEffect(() => {
    let filtered = [...history];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply sort
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredHistory(filtered);
  }, [history, searchQuery, statusFilter, sortOrder]);

  const refreshHistory = () => {
    const historyData = getScrapeHistory();
    setHistory(historyData);
    setFilteredHistory(historyData);
  };

  const handleClearHistory = () => {
    clearScrapeHistory();
    setHistory([]);
    setFilteredHistory([]);
  };

  const handleSelectResult = (result: ScrapeResult) => {
    onSelectResult(result);
    setOpen(false);
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
    } catch (e) {
      return url;
    }
  };

  const getTotalItemsCount = (result: ScrapeResult) => {
    return result.data.reduce((sum, group) => sum + (group.items?.length || 0), 0);
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} ${diffInSeconds === 1 ? 'second' : 'seconds'} ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${Math.floor(diffInSeconds / 60) === 1 ? 'minute' : 'minutes'} ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${Math.floor(diffInSeconds / 3600) === 1 ? 'hour' : 'hours'} ago`;
    
    return format(past, 'MMM d, yyyy • h:mm a');
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DrawerTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 hover:bg-secondary/40 transition-colors duration-200">
                <Clock className="h-4 w-4 text-primary/80" />
                History
              </Button>
            </DrawerTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm border-primary/10">
            <span>View your scraping history</span>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DrawerContent className="max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-3">
          <DrawerHeader className="py-3">
            <DrawerTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Scrape History
            </DrawerTitle>
            <DrawerDescription>View and manage your previous scraping activities</DrawerDescription>
          </DrawerHeader>
          
          <div className="pr-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refreshHistory}
                    className="flex items-center gap-1.5 hover:bg-secondary/30"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <span>Refresh history list</span>
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="px-4 py-2">
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 focus-visible:ring-primary/30"
              />
              {searchQuery && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <SelectTrigger className="w-[110px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={sortOrder} 
                onValueChange={(value) => setSortOrder(value as any)}
              >
                <SelectTrigger className="w-[110px] h-9">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredHistory.length > 0 && (
            <div className="mt-2 mb-1 text-xs text-muted-foreground flex items-center justify-between">
              <div>
                Showing {filteredHistory.length} of {history.length} results
              </div>
              {statusFilter !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1.5 h-6 bg-secondary/20">
                  {statusFilter}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                    onClick={() => setStatusFilter("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <ScrollArea className="px-4 max-h-[50vh]">
          <div className="space-y-3 pb-6">
            <AnimatePresence>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <motion.div 
                    key={`${item.url}-${item.timestamp}`}
                    className={`border rounded-lg p-3 ${item.status === 'error' ? 'border-destructive/30 hover:border-destructive/50' : 'hover:border-primary/50'} transition-all cursor-pointer bg-card/40 hover:bg-card/70`}
                    onClick={() => handleSelectResult(item)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate max-w-[200px] sm:max-w-[300px]">
                          {formatUrl(item.url)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getRelativeTime(item.timestamp)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <div className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          item.status === 'success' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {item.status === 'success' ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {item.status}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="Open website"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Open website</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs px-2 h-5 bg-secondary/40">
                          {item.data.length} pattern{item.data.length !== 1 ? 's' : ''}
                        </Badge>
                        <Badge variant="secondary" className="text-xs px-2 h-5 bg-secondary/40 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {getTotalItemsCount(item)} item{getTotalItemsCount(item) !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-12 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                        <Clock className="h-8 w-8 text-muted-foreground/60" />
                      </div>
                      No scraping history found
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                        <Filter className="h-8 w-8 text-muted-foreground/60" />
                      </div>
                      No results match your filters
                      <Button 
                        variant="link" 
                        className="mt-2" 
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
        
        <DrawerFooter className="pt-2">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="flex-1 flex items-center gap-2" 
                    onClick={handleClearHistory}
                    disabled={history.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear History
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>Permanently delete all history items</span>
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default HistoryDrawer;
