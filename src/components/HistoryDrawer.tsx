
import { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Trash2, ExternalLink } from "lucide-react";
import { ScrapeResult, getHistory, clearHistory } from "@/utils/scrapeService";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryDrawerProps {
  onSelectResult: (result: ScrapeResult) => void;
}

const HistoryDrawer = ({ onSelectResult }: HistoryDrawerProps) => {
  const [history, setHistory] = useState<ScrapeResult[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      refreshHistory();
    }
  }, [open]);

  const refreshHistory = () => {
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          History
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Scrape History</DrawerTitle>
          <DrawerDescription>View your previous scraping activities</DrawerDescription>
        </DrawerHeader>
        
        <div className="flex justify-end px-4 pb-2">
          <Button variant="ghost" size="sm" onClick={refreshHistory} className="h-8">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>
        
        <ScrollArea className="px-4 max-h-[60vh]">
          <div className="space-y-4 pb-8">
            <AnimatePresence>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    className={`border rounded-lg p-3 ${item.status === 'error' ? 'border-destructive/30' : 'hover:border-primary/40'} transition-colors cursor-pointer`}
                    onClick={() => handleSelectResult(item)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm truncate max-w-[200px] sm:max-w-[300px]">
                          {formatUrl(item.url)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(item.timestamp), 'MMM d, yyyy • h:mm a')}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`text-xs px-2 py-0.5 rounded ${
                          item.status === 'success' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {item.status}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.data.length} pattern{item.data.length !== 1 ? 's' : ''}, {
                        item.data.reduce((sum, group) => sum + (group.items?.length || 0), 0)
                      } item{item.data.reduce((sum, group) => sum + (group.items?.length || 0), 0) !== 1 ? 's' : ''}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-8 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  No scraping history found
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
        
        <DrawerFooter className="pt-2">
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              className="flex-1" 
              onClick={handleClearHistory}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
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
