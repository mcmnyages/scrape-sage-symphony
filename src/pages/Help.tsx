
import { useState } from "react";
import { motion } from "framer-motion";
import { Code, FileText, Github, HelpCircle, Mail, ExternalLink, BookOpen, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Help = () => {
  const [activeTab, setActiveTab] = useState("guide");
  
  return (
    <div className="min-h-screen relative">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '17s', animationDelay: '3s' }} />
      </div>
      
      <Header />
      
      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how to use the Web Scraper application effectively
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 max-w-2xl mx-auto">
              <TabsTrigger value="guide">
                <BookOpen className="h-4 w-4 mr-2" />
                Guide
              </TabsTrigger>
              <TabsTrigger value="faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="api">
                <Code className="h-4 w-4 mr-2" />
                API
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="guide" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Learn the basics of web scraping with our application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">1. Enter a URL</h3>
                    <p className="text-muted-foreground">
                      Start by entering the URL of the website you want to scrape in the input field. 
                      Make sure to include the full URL with https:// or http://.
                    </p>
                    <div className="p-4 bg-muted rounded-lg">
                      <code>https://example.com</code>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">2. Create Patterns</h3>
                    <p className="text-muted-foreground">
                      Patterns tell the scraper what data to extract. Click "Add Pattern" and define:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li><strong>Name:</strong> A descriptive name for the data you're extracting</li>
                      <li><strong>Type:</strong> The selector type (CSS, XPath, RegEx, or JSON)</li>
                      <li><strong>Selector:</strong> The actual pattern to match elements</li>
                    </ul>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium mb-2">Example CSS selector:</p>
                      <code>.article h2.title</code>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">3. Configure Options</h3>
                    <p className="text-muted-foreground">
                      Set advanced options in the Advanced tab for more control:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li><strong>Request Delay:</strong> Time to wait between requests (ms)</li>
                      <li><strong>Max Depth:</strong> How deep to follow links</li>
                      <li><strong>Include HTML/Text:</strong> What content to extract</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">4. Run the Scraper</h3>
                    <p className="text-muted-foreground">
                      Click the "Scrape" button to start the process. Results will appear below.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">5. Save as Template</h3>
                    <p className="text-muted-foreground">
                      Save your patterns and settings as templates for future use.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pattern Types</CardTitle>
                    <CardDescription>Learn about different selector types</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">CSS Selectors</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use standard CSS selectors to target elements by class, ID, or attributes.
                      </p>
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <code>.product .price</code>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">XPath</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        More powerful than CSS selectors for complex document navigation.
                      </p>
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <code>//div[@class='product']//span[@class='price']</code>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">RegEx</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Extract data with regular expressions for text patterns.
                      </p>
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <code>Price: \$([0-9.]+)</code>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">JSON</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Extract data from JavaScript objects or JSON responses.
                      </p>
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <code>data.products[*].price</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Features</CardTitle>
                    <CardDescription>Take your scraping to the next level</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Templates</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Save and reuse scraping configurations for different websites.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">History</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        View and restore previous scraping sessions from history.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Export Options</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Download scraped data in JSON or CSV format for further analysis.
                      </p>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-2">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Advanced Tutorial
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Common questions about using the web scraper
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="faq-1">
                      <AccordionTrigger>Is web scraping legal?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Web scraping legality depends on several factors:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>The website's Terms of Service</li>
                          <li>Whether the data is publicly available</li>
                          <li>How you use the collected data</li>
                          <li>Local laws and regulations</li>
                        </ul>
                        <p className="text-muted-foreground mt-2">
                          Always check a website's robots.txt file and Terms of Service before scraping. 
                          Use the "respectRobotsTxt" option to automatically comply with robots.txt rules.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-2">
                      <AccordionTrigger>Why isn't my CSS selector working?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Common reasons for CSS selector issues:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Content is loaded dynamically with JavaScript</li>
                          <li>The selector syntax has errors</li>
                          <li>The website structure has changed</li>
                          <li>Elements are within iframes</li>
                        </ul>
                        <p className="text-muted-foreground mt-2">
                          Try using browser developer tools to verify your selectors. 
                          For dynamic content, you may need to increase the request delay.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-3">
                      <AccordionTrigger>How can I avoid being blocked?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          To reduce the risk of being blocked:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Use the "requestDelay" option to slow down requests</li>
                          <li>Limit the "maxDepth" to scrape fewer pages</li>
                          <li>Set "respectRobotsTxt" to true</li>
                          <li>Don't overload websites with too many requests</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-4">
                      <AccordionTrigger>How do I extract data from a table?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          For tables, use CSS selectors like:
                        </p>
                        <div className="p-2 bg-muted rounded mb-2">
                          <code>table tr</code> - to get all rows
                        </div>
                        <div className="p-2 bg-muted rounded mb-2">
                          <code>table tr td:nth-child(2)</code> - to get the second column
                        </div>
                        <p className="text-muted-foreground mt-2">
                          For more complex tables, you might need multiple patterns or use XPath for 
                          better structure preservation.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-5">
                      <AccordionTrigger>Can I scrape multiple pages at once?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Yes, there are two approaches:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                          <li>Set "followLinks" to true and define a "maxDepth" in the advanced options</li>
                          <li>Create multiple scrape requests for different URLs</li>
                        </ol>
                        <p className="text-muted-foreground mt-2">
                          For pagination, you can use the "followLinks" option with a pattern that matches "Next" buttons or page links.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>
                    Technical details for developers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-3">Scrape Request Format</h3>
                    <div className="p-4 bg-muted rounded-lg overflow-auto max-h-80">
                      <pre className="text-sm">
{`{
  "url": "https://example.com",
  "patterns": [
    {
      "name": "titles",
      "type": "css",
      "selector": "h2.title"
    },
    {
      "name": "prices",
      "type": "css",
      "selector": ".product .price"
    }
  ],
  "options": {
    "includeHtml": true,
    "includeText": true,
    "maxDepth": 2,
    "requestDelay": 500,
    "followLinks": true,
    "respectRobotsTxt": true
  }
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-3">Scrape Response Format</h3>
                    <div className="p-4 bg-muted rounded-lg overflow-auto max-h-80">
                      <pre className="text-sm">
{`{
  "status": "success",
  "timestamp": "2023-09-20T12:34:56.789Z",
  "url": "https://example.com",
  "data": [
    {
      "pattern": "titles",
      "type": "css",
      "selector": "h2.title",
      "items": [
        {
          "id": "item-0",
          "text": "Sample Product Title 1",
          "href": "https://example.com/product-1",
          "html": "<h2 class='title'>Sample Product Title 1</h2>"
        },
        {
          "id": "item-1",
          "text": "Sample Product Title 2",
          "href": null,
          "html": "<h2 class='title'>Sample Product Title 2</h2>"
        }
      ]
    },
    {
      "pattern": "prices",
      "type": "css",
      "selector": ".product .price",
      "items": [
        {
          "id": "item-0",
          "text": "$99.99",
          "href": null,
          "html": "<span class='price'>$99.99</span>"
        },
        {
          "id": "item-1",
          "text": "$149.99",
          "href": null,
          "html": "<span class='price'>$149.99</span>"
        }
      ]
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Full API Reference
                    </Button>
                    <Button variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub Repository
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get help with any issues or questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg flex flex-col items-center text-center">
                      <Mail className="h-10 w-10 mb-4 text-primary" />
                      <h3 className="text-lg font-medium mb-2">Email Support</h3>
                      <p className="text-muted-foreground mb-4">
                        For technical issues and general questions
                      </p>
                      <Button variant="outline">
                        support@webscraper.example
                      </Button>
                    </div>
                    
                    <div className="p-6 border rounded-lg flex flex-col items-center text-center">
                      <Github className="h-10 w-10 mb-4 text-primary" />
                      <h3 className="text-lg font-medium mb-2">GitHub Issues</h3>
                      <p className="text-muted-foreground mb-4">
                        Report bugs or request features
                      </p>
                      <Button variant="outline">
                        Open GitHub Issue
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 border rounded-lg text-center">
                    <Coffee className="h-10 w-10 mx-auto mb-4 text-amber-500" />
                    <h3 className="text-lg font-medium mb-2">Support the Project</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      If you find this tool useful, consider supporting its continued development
                    </p>
                    <Button>
                      <Coffee className="h-4 w-4 mr-2" />
                      Buy us a coffee
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;
