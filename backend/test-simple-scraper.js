const puppeteer = require('puppeteer');

class SimpleTestScraper {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false, // Set to false for testing
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  // Generate better search variations
  generateSearchVariations(productName) {
    const variations = [];
    
    // Original name
    variations.push(productName);
    
    // Try just the main product name (remove brand and size)
    let mainProduct = productName.toLowerCase();
    
    // Remove common brands
    const brands = ['capilano', 'nestle', 'coca', 'pepsi', 'dove', 'pantene'];
    brands.forEach(brand => {
      mainProduct = mainProduct.replace(brand, '').trim();
    });
    
    // Remove size/weight patterns
    mainProduct = mainProduct.replace(/\d+\s*(g|ml|l|kg)/gi, '').trim();
    mainProduct = mainProduct.replace(/\d+\s*جم/g, '').trim();
    
    if (mainProduct && mainProduct !== productName.toLowerCase()) {
      variations.push(mainProduct);
    }
    
    // Try just the first word (usually the brand or main product)
    const firstWord = productName.split(' ')[0];
    if (firstWord && firstWord.length > 2) {
      variations.push(firstWord);
    }
    
    // Try common product keywords
    const keywords = ['honey', 'drink', 'coffee', 'tea', 'milk', 'water', 'juice'];
    keywords.forEach(keyword => {
      if (productName.toLowerCase().includes(keyword)) {
        variations.push(keyword);
      }
    });
    
    return [...new Set(variations)]; // Remove duplicates
  }

  async testCarrefourKSA(productName) {
    try {
      console.log(`\n🔍 Testing Carrefour KSA for: "${productName}"`);
      
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      // Set a more realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Navigate to Carrefour KSA
      await page.goto('https://www.carrefourksa.com/mafsau/en', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      console.log('✅ Page loaded successfully');
      
      // Wait a bit for the page to fully load
      await page.waitForTimeout(5000);
      
      // Try to find search elements
      const searchElements = await page.evaluate(() => {
        const elements = [];
        const selectors = [
          'input[placeholder*="Search"]',
          'input[name="q"]',
          '.search-input',
          'input[type="search"]',
          '[data-testid*="search"]',
          'input[placeholder*="search" i]'
        ];
        
        selectors.forEach(selector => {
          const element = document.querySelector(selector);
          if (element) {
            elements.push({
              selector,
              placeholder: element.placeholder,
              type: element.type,
              id: element.id,
              className: element.className
            });
          }
        });
        
        return elements;
      });
      
      console.log('Found search elements:', searchElements);
      
      if (searchElements.length === 0) {
        console.log('❌ No search elements found');
        await page.close();
        return [];
      }
      
      const searchVariations = this.generateSearchVariations(productName);
      console.log('Search variations:', searchVariations);
      
      let bestResults = [];
      
      for (const searchTerm of searchVariations) {
        try {
          console.log(`Trying search term: "${searchTerm}"`);
          
          // Use the first found search element
          const searchSelector = searchElements[0].selector;
          
          // Clear and type
          await page.click(searchSelector);
          await page.keyboard.down('Control');
          await page.keyboard.press('A');
          await page.keyboard.up('Control');
          await page.keyboard.press('Backspace');
          await page.type(searchSelector, searchTerm);
          await page.keyboard.press('Enter');
          
          // Wait for results
          await page.waitForTimeout(5000);
          
          // Extract images
          const images = await page.evaluate(() => {
            const productImages = [];
            const imgElements = document.querySelectorAll('img');
            
            imgElements.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon')) {
                productImages.push({
                  url: src,
                  alt: img.alt || '',
                  title: img.title || img.alt || ''
                });
              }
            });
            
            return productImages.slice(0, 10);
          });
          
          console.log(`Found ${images.length} images for "${searchTerm}"`);
          
          if (images.length > bestResults.length) {
            bestResults = images;
          }
          
          // Wait before next search
          await page.waitForTimeout(3000);
          
        } catch (error) {
          console.log(`Error with search term "${searchTerm}":`, error.message);
        }
      }
      
      await page.close();
      return bestResults;
      
    } catch (error) {
      console.error('Error testing Carrefour KSA:', error.message);
      return [];
    }
  }

  async testPandaSA(productName) {
    try {
      console.log(`\n🔍 Testing Panda.sa for: "${productName}"`);
      
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      await page.goto('https://panda.sa/', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      console.log('✅ Page loaded successfully');
      
      await page.waitForTimeout(5000);
      
      // Try to find search elements
      const searchElements = await page.evaluate(() => {
        const elements = [];
        const selectors = [
          'input[type="search"]',
          'input[name="q"]',
          '.search-input',
          'input[placeholder*="search" i]',
          '[data-testid*="search"]'
        ];
        
        selectors.forEach(selector => {
          const element = document.querySelector(selector);
          if (element) {
            elements.push({
              selector,
              placeholder: element.placeholder,
              type: element.type,
              id: element.id,
              className: element.className
            });
          }
        });
        
        return elements;
      });
      
      console.log('Found search elements:', searchElements);
      
      if (searchElements.length === 0) {
        console.log('❌ No search elements found');
        await page.close();
        return [];
      }
      
      const searchVariations = this.generateSearchVariations(productName);
      console.log('Search variations:', searchVariations);
      
      let bestResults = [];
      
      for (const searchTerm of searchVariations) {
        try {
          console.log(`Trying search term: "${searchTerm}"`);
          
          const searchSelector = searchElements[0].selector;
          
          await page.click(searchSelector);
          await page.keyboard.down('Control');
          await page.keyboard.press('A');
          await page.keyboard.up('Control');
          await page.keyboard.press('Backspace');
          await page.type(searchSelector, searchTerm);
          await page.keyboard.press('Enter');
          
          await page.waitForTimeout(5000);
          
          const images = await page.evaluate(() => {
            const productImages = [];
            const imgElements = document.querySelectorAll('img');
            
            imgElements.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon')) {
                productImages.push({
                  url: src,
                  alt: img.alt || '',
                  title: img.title || img.alt || ''
                });
              }
            });
            
            return productImages.slice(0, 10);
          });
          
          console.log(`Found ${images.length} images for "${searchTerm}"`);
          
          if (images.length > bestResults.length) {
            bestResults = images;
          }
          
          await page.waitForTimeout(3000);
          
        } catch (error) {
          console.log(`Error with search term "${searchTerm}":`, error.message);
        }
      }
      
      await page.close();
      return bestResults;
      
    } catch (error) {
      console.error('Error testing Panda.sa:', error.message);
      return [];
    }
  }

  async runTests() {
    const testProducts = [
      'Capilano Honey 400g Twist & Squeeze',
      'NESTLE CAPPUCCINO DRINK 225 ML'
    ];
    
    for (const product of testProducts) {
      console.log(`\n🧪 Testing product: "${product}"`);
      
      const carrefourResults = await this.testCarrefourKSA(product);
      const pandaResults = await this.testPandaSA(product);
      
      console.log(`\n📊 Results for "${product}":`);
      console.log(`Carrefour KSA: ${carrefourResults.length} images`);
      console.log(`Panda.sa: ${pandaResults.length} images`);
      
      if (carrefourResults.length > 0) {
        console.log('Carrefour sample image:', carrefourResults[0].url);
      }
      if (pandaResults.length > 0) {
        console.log('Panda sample image:', pandaResults[0].url);
      }
    }
    
    await this.closeBrowser();
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Run the test
const testScraper = new SimpleTestScraper();
testScraper.runTests().catch(console.error); 