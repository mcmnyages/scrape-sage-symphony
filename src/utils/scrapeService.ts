
// Type definitions
export interface ScrapeRequest {
  url: string;
  patterns: {
    type: string;
    selector: string;
    name: string;
  }[];
  options?: {
    delay?: number;
    excludeElements?: string[];
    includeHtml?: boolean;
    includeText?: boolean;
    followLinks?: boolean;
    maxDepth?: number;
  };
}

export interface ScrapeResult {
  id: string;
  timestamp: number;
  url: string;
  data: any[];
  status: 'success' | 'error';
  message?: string;
}

// Mock implementation for client-side preview
// In a real implementation, this would make API calls to a backend
export const scrapeWebsite = async (request: ScrapeRequest): Promise<ScrapeResult> => {
  console.log('Scrape request:', request);
  
  try {
    // This would be replaced with actual API call in production
    // For now, we'll simulate a response based on the patterns
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // Generate mock results based on pattern types
    const mockData = request.patterns.map(pattern => {
      let items: any[] = [];
      
      // Generate different mock data based on pattern type
      switch (pattern.type) {
        case 'css':
          items = generateMockCssResults(pattern.selector, 3);
          break;
        case 'xpath':
          items = generateMockXPathResults(pattern.selector, 3);
          break;
        case 'regex':
          items = generateMockRegexResults(pattern.selector, 3);
          break;
        case 'json':
          items = generateMockJsonResults(pattern.selector, 3);
          break;
        case 'auto':
          items = generateMockAutoResults(request.url, 3);
          break;
      }
      
      return {
        pattern: pattern.name,
        type: pattern.type,
        selector: pattern.selector,
        items
      };
    });
    
    // In real implementation, save to local storage or database
    const result: ScrapeResult = {
      id: generateId(),
      timestamp: Date.now(),
      url: request.url,
      data: mockData,
      status: 'success'
    };
    
    // Save to history in localStorage
    saveToHistory(result);
    
    return result;
  } catch (error) {
    console.error('Scrape error:', error);
    return {
      id: generateId(),
      timestamp: Date.now(),
      url: request.url,
      data: [],
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// History management
export const getHistory = (): ScrapeResult[] => {
  try {
    const history = localStorage.getItem('scrape_history');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error('Error loading scrape history:', e);
    return [];
  }
};

export const saveToHistory = (result: ScrapeResult): void => {
  try {
    const history = getHistory();
    const updatedHistory = [result, ...history].slice(0, 20); // Keep only last 20 items
    localStorage.setItem('scrape_history', JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Error saving to history:', e);
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem('scrape_history');
};

// Helper functions for generating mock data
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

const generateMockCssResults = (selector: string, count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i+1}`,
    element: selector.split(' ').pop() || 'div',
    text: `Content for ${selector} - Item ${i+1}`,
    attributes: {
      class: `sample-class-${i+1}`,
      id: `sample-id-${i+1}`
    }
  }));
};

const generateMockXPathResults = (selector: string, count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `node-${i+1}`,
    nodeName: selector.includes('@') ? 'attribute' : 'element',
    text: `XPath result ${i+1} for ${selector}`,
    path: `/html/body/div[${i+1}]`
  }));
};

const generateMockRegexResults = (pattern: string, count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `match-${i+1}`,
    text: `Match ${i+1} for pattern ${pattern}`,
    position: { start: i * 100, end: i * 100 + 50 }
  }));
};

const generateMockJsonResults = (path: string, count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `json-${i+1}`,
    path: `${path}[${i}]`,
    value: { name: `Item ${i+1}`, id: i+1, active: Math.random() > 0.5 }
  }));
};

const generateMockAutoResults = (url: string, count: number): any[] => {
  // Generate different types of results based on URL pattern
  if (url.includes('product') || url.includes('shop')) {
    return Array.from({ length: count }, (_, i) => ({
      id: `product-${i+1}`,
      name: `Product ${i+1}`,
      price: `$${(19.99 + i * 10).toFixed(2)}`,
      rating: (Math.random() * 5).toFixed(1)
    }));
  } else if (url.includes('article') || url.includes('blog')) {
    return Array.from({ length: count }, (_, i) => ({
      id: `article-${i+1}`,
      title: `Article ${i+1}`,
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      excerpt: `This is a sample excerpt for article ${i+1}...`
    }));
  } else {
    return Array.from({ length: count }, (_, i) => ({
      id: `item-${i+1}`,
      type: 'Auto-detected content',
      content: `Content item ${i+1} from ${url}`
    }));
  }
};
