
import { useState } from "react";
import { Plus, Search, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatternType, validatePattern, formatPatternDescription, samplePatterns } from "@/utils/patternHelpers";
import { motion, AnimatePresence } from "framer-motion";

export interface PatternItem {
  id: string;
  name: string;
  type: PatternType;
  selector: string;
}

interface PatternBuilderProps {
  patterns: PatternItem[];
  setPatterns: (patterns: PatternItem[]) => void;
}

const PatternBuilder = ({ patterns, setPatterns }: PatternBuilderProps) => {
  const [currentPattern, setCurrentPattern] = useState<PatternItem>({
    id: '',
    name: '',
    type: 'css',
    selector: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddPattern = () => {
    if (!currentPattern.name || !currentPattern.selector) return;
    
    if (validatePattern(currentPattern.selector, currentPattern.type)) {
      setPatterns([
        ...patterns, 
        { ...currentPattern, id: Math.random().toString(36).slice(2, 11) }
      ]);
      
      setCurrentPattern({
        id: '',
        name: '',
        type: 'css',
        selector: ''
      });
    }
  };

  const handleDeletePattern = (id: string) => {
    setPatterns(patterns.filter(p => p.id !== id));
  };

  const handleSamplePattern = (pattern: typeof samplePatterns[0]) => {
    setCurrentPattern({
      id: '',
      name: pattern.name,
      type: pattern.type,
      selector: pattern.selector
    });
    setShowSuggestions(false);
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Extraction Patterns</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-sm"
        >
          <Search className="h-3.5 w-3.5 mr-1" />
          Example Patterns
        </Button>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-3 bg-secondary/50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {samplePatterns.map((pattern) => (
              <motion.div
                key={pattern.id}
                className="p-2 border rounded-md cursor-pointer hover:bg-background transition-colors"
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSamplePattern(pattern)}
              >
                <div className="font-medium text-sm">{pattern.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{pattern.description}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="col-span-1">
          <Input
            placeholder="Pattern name"
            value={currentPattern.name}
            onChange={(e) => setCurrentPattern({ ...currentPattern, name: e.target.value })}
            className="w-full"
          />
        </div>
        
        <div className="col-span-1">
          <Select
            value={currentPattern.type}
            onValueChange={(value) => setCurrentPattern({ ...currentPattern, type: value as PatternType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pattern type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="css">CSS Selector</SelectItem>
              <SelectItem value="xpath">XPath</SelectItem>
              <SelectItem value="regex">Regex</SelectItem>
              <SelectItem value="json">JSON Path</SelectItem>
              <SelectItem value="auto">Auto-detect</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 md:col-span-2 flex space-x-2">
          <div className="flex-grow">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Input
                      placeholder={`Enter ${currentPattern.type} pattern`}
                      value={currentPattern.selector}
                      onChange={(e) => setCurrentPattern({ ...currentPattern, selector: e.target.value })}
                      className={`w-full peer ${!validatePattern(currentPattern.selector, currentPattern.type) && currentPattern.selector.length > 0 ? 'border-destructive' : ''}`}
                    />
                    {validatePattern(currentPattern.selector, currentPattern.type) && currentPattern.selector.length > 0 && (
                      <Check className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {formatPatternDescription(currentPattern.type)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button onClick={handleAddPattern} size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <AnimatePresence>
          {patterns.length > 0 ? (
            <motion.div 
              className="bg-secondary/50 rounded-lg p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {patterns.map((pattern) => (
                <motion.div 
                  key={pattern.id}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <span className="font-medium">{pattern.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 inline-block bg-muted px-2 py-0.5 rounded">
                      {pattern.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate hidden sm:inline">
                      {pattern.selector}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive" 
                      onClick={() => handleDeletePattern(pattern.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-6 text-muted-foreground bg-secondary/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Add patterns to extract specific data from the website
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PatternBuilder;
