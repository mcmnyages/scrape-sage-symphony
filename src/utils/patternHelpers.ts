
// Pattern types for data extraction
export type PatternType = 'css' | 'xpath' | 'regex' | 'json' | 'auto';

export interface Pattern {
  id: string;
  name: string;
  type: PatternType;
  selector: string;
  description: string;
}

// Sample patterns to get users started
export const samplePatterns: Pattern[] = [
  {
    id: '1',
    name: 'Article Titles',
    type: 'css',
    selector: 'h1, h2.article-title',
    description: 'Extracts main titles and article headings'
  },
  {
    id: '2',
    name: 'Product Prices',
    type: 'css',
    selector: '.price, span[itemprop="price"]',
    description: 'Extracts product prices from e-commerce sites'
  },
  {
    id: '3',
    name: 'Email Addresses',
    type: 'regex',
    selector: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'Finds email addresses on the page'
  },
  {
    id: '4',
    name: 'Links',
    type: 'css',
    selector: 'a[href]',
    description: 'Extracts all links with their text and URLs'
  },
  {
    id: '5',
    name: 'Images',
    type: 'css',
    selector: 'img[src]',
    description: 'Extracts all images with their sources and alt text'
  }
];

// Function to validate pattern by type
export const validatePattern = (pattern: string, type: PatternType): boolean => {
  switch (type) {
    case 'css':
      return pattern.trim().length > 0;
    case 'xpath':
      return pattern.trim().length > 0 && pattern.includes('/');
    case 'regex':
      try {
        new RegExp(pattern);
        return true;
      } catch (e) {
        return false;
      }
    case 'json':
      try {
        // Check if it's a valid JSONPath-like syntax
        return pattern.includes('$') || pattern.includes('.');
      } catch (e) {
        return false;
      }
    case 'auto':
      return true;
    default:
      return false;
  }
};

// Format pattern description based on type
export const formatPatternDescription = (type: PatternType): string => {
  switch (type) {
    case 'css':
      return 'CSS selectors like "div.class" or "#id"';
    case 'xpath':
      return 'XPath expressions like "//div[@class=\'name\']"';
    case 'regex':
      return 'Regular expressions like "[a-z0-9]+"';
    case 'json':
      return 'JSON path like "$.items[*].name"';
    case 'auto':
      return 'Automatic detection based on content';
    default:
      return '';
  }
};
