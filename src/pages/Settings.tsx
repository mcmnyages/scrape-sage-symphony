
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Undo, Moon, Sun, Globe, EyeOff, Layout, RefreshCw, Database, Zap, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Settings interface
interface AppSettings {
  appearance: {
    theme: "light" | "dark" | "system";
    animationsEnabled: boolean;
    compactMode: boolean;
  };
  scraping: {
    defaultDelay: number;
    defaultMaxDepth: number;
    respectRobotsTxt: boolean;
    autoSaveHistory: boolean;
    historyLimit: number;
  };
  notifications: {
    scrapeComplete: boolean;
    errorNotifications: boolean;
    soundEnabled: boolean;
  };
}

// Default settings
const defaultSettings: AppSettings = {
  appearance: {
    theme: "system",
    animationsEnabled: true,
    compactMode: false,
  },
  scraping: {
    defaultDelay: 500,
    defaultMaxDepth: 1,
    respectRobotsTxt: true,
    autoSaveHistory: true,
    historyLimit: 10,
  },
  notifications: {
    scrapeComplete: true,
    errorNotifications: true,
    soundEnabled: false,
  },
};

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appearance");
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);
  
  // Track changes to settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        const parsedSavedSettings = JSON.parse(savedSettings);
        setHasChanges(JSON.stringify(parsedSavedSettings) !== JSON.stringify(settings));
      } else {
        setHasChanges(JSON.stringify(defaultSettings) !== JSON.stringify(settings));
      }
    } catch (error) {
      console.error("Error comparing settings:", error);
    }
  }, [settings]);
  
  const saveSettings = () => {
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
      setHasChanges(false);
      
      // Apply theme changes immediately
      if (settings.appearance.theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      } else {
        document.documentElement.classList.toggle("dark", settings.appearance.theme === "dark");
      }
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your preferences",
        variant: "destructive",
      });
    }
  };
  
  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults",
    });
  };
  
  const updateSetting = <K extends keyof AppSettings, S extends keyof AppSettings[K]>(
    category: K, 
    setting: S, 
    value: AppSettings[K][S]
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      }
    }));
  };
  
  return (
    <div className="min-h-screen relative">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[60%] w-[30%] h-[30%] bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '13s' }} />
        <div className="absolute bottom-[30%] right-[70%] w-[35%] h-[35%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '16s', animationDelay: '1s' }} />
      </div>
      
      <Header />
      
      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Customize your web scraper experience</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={resetSettings}
                disabled={!hasChanges}
              >
                <Undo className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={saveSettings}
                disabled={!hasChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 max-w-md">
              <TabsTrigger value="appearance">
                <Moon className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="scraping">
                <Globe className="h-4 w-4 mr-2" />
                Scraping
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <BellRing className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme & Display</CardTitle>
                    <CardDescription>Customize how the application looks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="theme" className="text-base">Theme</Label>
                        <div className="flex flex-col sm:flex-row mt-2 gap-4">
                          <div 
                            className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${
                              settings.appearance.theme === "light" 
                                ? "border-primary ring-2 ring-primary ring-opacity-50" 
                                : "border-input hover:border-muted-foreground"
                            }`}
                            onClick={() => updateSetting("appearance", "theme", "light")}
                          >
                            <div className="flex items-center justify-center mb-3">
                              <Sun className="h-8 w-8 text-orange-500" />
                            </div>
                            <p className="text-center font-medium">Light</p>
                          </div>
                          
                          <div 
                            className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${
                              settings.appearance.theme === "dark" 
                                ? "border-primary ring-2 ring-primary ring-opacity-50" 
                                : "border-input hover:border-muted-foreground"
                            }`}
                            onClick={() => updateSetting("appearance", "theme", "dark")}
                          >
                            <div className="flex items-center justify-center mb-3">
                              <Moon className="h-8 w-8 text-indigo-400" />
                            </div>
                            <p className="text-center font-medium">Dark</p>
                          </div>
                          
                          <div 
                            className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${
                              settings.appearance.theme === "system" 
                                ? "border-primary ring-2 ring-primary ring-opacity-50" 
                                : "border-input hover:border-muted-foreground"
                            }`}
                            onClick={() => updateSetting("appearance", "theme", "system")}
                          >
                            <div className="flex items-center justify-center mb-3">
                              <div className="relative">
                                <Sun className="h-8 w-8 text-orange-500 absolute -left-4" />
                                <Moon className="h-8 w-8 text-indigo-400 absolute -right-4" />
                              </div>
                            </div>
                            <p className="text-center font-medium mt-3">System</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Animations</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable UI animations and transitions
                          </p>
                        </div>
                        <Switch
                          checked={settings.appearance.animationsEnabled}
                          onCheckedChange={(checked) => updateSetting("appearance", "animationsEnabled", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce spacing for denser UI layout
                          </p>
                        </div>
                        <Switch
                          checked={settings.appearance.compactMode}
                          onCheckedChange={(checked) => updateSetting("appearance", "compactMode", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="scraping" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scraping Options</CardTitle>
                    <CardDescription>Configure default scraping behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="defaultDelay" className="text-base">Default Request Delay</Label>
                          <span className="text-sm font-medium">
                            {settings.scraping.defaultDelay} ms
                          </span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <Slider
                            id="defaultDelay"
                            min={0}
                            max={2000}
                            step={100}
                            value={[settings.scraping.defaultDelay]}
                            onValueChange={(value) => updateSetting("scraping", "defaultDelay", value[0])}
                            className="flex-grow"
                          />
                          <Input
                            type="number"
                            value={settings.scraping.defaultDelay}
                            onChange={(e) => updateSetting("scraping", "defaultDelay", parseInt(e.target.value) || 0)}
                            min={0}
                            max={2000}
                            step={100}
                            className="w-20"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Time to wait between requests in milliseconds
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="defaultMaxDepth" className="text-base">Default Max Depth</Label>
                        <Select
                          value={settings.scraping.defaultMaxDepth.toString()}
                          onValueChange={(value) => updateSetting("scraping", "defaultMaxDepth", parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select depth" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (Current page only)</SelectItem>
                            <SelectItem value="2">2 (Current page + linked pages)</SelectItem>
                            <SelectItem value="3">3 (Current + 2 levels deep)</SelectItem>
                            <SelectItem value="4">4 (Current + 3 levels deep)</SelectItem>
                            <SelectItem value="5">5 (Current + 4 levels deep)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          How many levels of links to follow when scraping
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Respect Robots.txt</Label>
                          <p className="text-sm text-muted-foreground">
                            Follow website crawling policies
                          </p>
                        </div>
                        <Switch
                          checked={settings.scraping.respectRobotsTxt}
                          onCheckedChange={(checked) => updateSetting("scraping", "respectRobotsTxt", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Auto-save to History</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically save scraping results
                          </p>
                        </div>
                        <Switch
                          checked={settings.scraping.autoSaveHistory}
                          onCheckedChange={(checked) => updateSetting("scraping", "autoSaveHistory", checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="historyLimit" className="text-base">History Limit</Label>
                          <span className="text-sm font-medium">
                            {settings.scraping.historyLimit} items
                          </span>
                        </div>
                        <Slider
                          id="historyLimit"
                          min={5}
                          max={50}
                          step={5}
                          value={[settings.scraping.historyLimit]}
                          onValueChange={(value) => updateSetting("scraping", "historyLimit", value[0])}
                        />
                        <p className="text-sm text-muted-foreground">
                          Maximum number of entries to keep in history
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Options</CardTitle>
                    <CardDescription>Additional scraping settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Content Filtering</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Content filtering options will be available in a future update
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Data Storage</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Data persistence and cloud sync options coming soon
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Scheduled Scraping</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Set up automatic scraping on a schedule (coming soon)
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" disabled>
                      <Zap className="h-4 w-4 mr-2" />
                      Unlock Pro Features
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Configure when and how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Scrape Complete</Label>
                          <p className="text-sm text-muted-foreground">
                            Notify when scraping process finishes
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.scrapeComplete}
                          onCheckedChange={(checked) => updateSetting("notifications", "scrapeComplete", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Error Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Notify when errors occur during scraping
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.errorNotifications}
                          onCheckedChange={(checked) => updateSetting("notifications", "errorNotifications", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Sound Effects</Label>
                          <p className="text-sm text-muted-foreground">
                            Play sounds with notifications
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.soundEnabled}
                          onCheckedChange={(checked) => updateSetting("notifications", "soundEnabled", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
