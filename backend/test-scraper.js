const puppeteer = require('puppeteer');

class TestScraper {
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

  // Generate search variations for better results
  generateSearchVariations(productName) {
    const variations = [];
    
    // Original name
    variations.push(productName);
    
    // Remove common words and try shorter versions
    const words = productName.split(' ');
    if (words.length > 2) {
      // Try first 2 words
      variations.push(words.slice(0, 2).join(' '));
      // Try first word
      variations.push(words[0]);
    }
    
    // Try without brand names (common brands)
    const brands = ['capilano', 'nestle', 'coca', 'pepsi', 'dove', 'pantene'];
    let nameWithoutBrand = productName.toLowerCase();
    brands.forEach(brand => {
      nameWithoutBrand = nameWithoutBrand.replace(brand, '').trim();
    });
    if (nameWithoutBrand && nameWithoutBrand !== productName.toLowerCase()) {
      variations.push(nameWithoutBrand);
    }
    
    // Try with common product keywords
    const keywords = ['honey', 'drink', 'coffee', 'tea', 'milk', 'water', 'juice', 'food'];
    keywords.forEach(keyword => {
      if (productName.toLowerCase().includes(keyword)) {
        variations.push(keyword);
      }
    });
    
    // Try with size/weight keywords
    const sizeKeywords = ['400g', '500g', '1kg', '225ml', '1l', '500ml'];
    sizeKeywords.forEach(size => {
      if (productName.toLowerCase().includes(size)) {
        variations.push(size);
      }
    });
    
    return [...new Set(variations)]; // Remove duplicates
  }

  async testCarrefourKSA(productName) {
    try {
      console.log(`\n🔍 Testing Carrefour KSA for: "${productName}"`);
      
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto('https://www.carrefourksa.com/mafsau/en', { waitUntil: 'networkidle2' });
      
      // Wait for search to load
      await page.waitForSelector('input[placeholder*="Search"], input[name="q"], .search-input', { timeout: 10000 });
      
      const searchVariations = this.generateSearchVariations(productName);
      console.log('Search variations:', searchVariations);
      
      let bestResults = [];
      
      for (const searchTerm of searchVariations) {
        try {
          console.log(`Trying search term: "${searchTerm}"`);
          
          // Find search input
          const searchSelectors = [
            'input[placeholder*="Search"]',
            'input[name="q"]',
            '.search-input',
            'input[type="search"]'
          ];
          
          let searchBox = null;
          for (const selector of searchSelectors) {
            searchBox = await page.$(selector);
            if (searchBox) break;
          }
          
          if (!searchBox) {
            console.log('Search box not found, skipping...');
            continue;
          }
          
          // Clear and search
          await searchBox.click();
          await page.keyboard.down('Control');
          await page.keyboard.press('A');
          await page.keyboard.up('Control');
          await page.keyboard.press('Backspace');
          await page.type(selector, searchTerm);
          await page.keyboard.press('Enter');
          
          // Wait for results
          await page.waitForTimeout(3000);
          
          // Extract images
          const images = await page.evaluate(() => {
            const productImages = [];
            const imgElements = document.querySelectorAll('img');
            
            imgElements.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (src && (src.includes('product') || src.includes('item') || src.includes('image'))) {
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
          await page.waitForTimeout(2000);
          
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
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto('https://panda.sa/', { waitUntil: 'networkidle2' });
      
      // Wait for search to load
      await page.waitForSelector('input[type="search"], input[name="q"], .search-input', { timeout: 10000 });
      
      const searchVariations = this.generateSearchVariations(productName);
      console.log('Search variations:', searchVariations);
      
      let bestResults = [];
      
      for (const searchTerm of searchVariations) {
        try {
          console.log(`Trying search term: "${searchTerm}"`);
          
          // Find search input
          const searchSelectors = [
            'input[type="search"]',
            'input[name="q"]',
            '.search-input',
            'input[placeholder*="search" i]'
          ];
          
          let searchBox = null;
          for (const selector of searchSelectors) {
            searchBox = await page.$(selector);
            if (searchBox) break;
          }
          
          if (!searchBox) {
            console.log('Search box not found, skipping...');
            continue;
          }
          
          // Clear and search
          await searchBox.click();
          await page.keyboard.down('Control');
          await page.keyboard.press('A');
          await page.keyboard.up('Control');
          await page.keyboard.press('Backspace');
          await page.type(selector, searchTerm);
          await page.keyboard.press('Enter');
          
          // Wait for results
          await page.waitForTimeout(3000);
          
          // Extract images
          const images = await page.evaluate(() => {
            const productImages = [];
            const imgElements = document.querySelectorAll('img');
            
            imgElements.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (src && (src.includes('product') || src.includes('item') || src.includes('image'))) {
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
          await page.waitForTimeout(2000);
          
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

  async testLulu(productName) {
    try {
      console.log(`\n🔍 Testing Lulu for: "${productName}"`);
      
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto('https://www.luluhypermarket.com/en-ae', { waitUntil: 'networkidle2' });
      
      // Wait for search to load
      await page.waitForSelector('input[type="search"], input[name="q"], .search-input', { timeout: 10000 });
      
      const searchVariations = this.generateSearchVariations(productName);
      console.log('Search variations:', searchVariations);
      
      let bestResults = [];
      
      for (const searchTerm of searchVariations) {
        try {
          console.log(`Trying search term: "${searchTerm}"`);
          
          // Find search input
          const searchSelectors = [
            'input[type="search"]',
            'input[name="q"]',
            '.search-input',
            'input[placeholder*="search" i]'
          ];
          
          let searchBox = null;
          for (const selector of searchSelectors) {
            searchBox = await page.$(selector);
            if (searchBox) break;
          }
          
          if (!searchBox) {
            console.log('Search box not found, skipping...');
            continue;
          }
          
          // Clear and search
          await searchBox.click();
          await page.keyboard.down('Control');
          await page.keyboard.press('A');
          await page.keyboard.up('Control');
          await page.keyboard.press('Backspace');
          await page.type(selector, searchTerm);
          await page.keyboard.press('Enter');
          
          // Wait for results
          await page.waitForTimeout(3000);
          
          // Extract images
          const images = await page.evaluate(() => {
            const productImages = [];
            const imgElements = document.querySelectorAll('img');
            
            imgElements.forEach(img => {
              const src = img.src || img.getAttribute('data-src');
              if (src && (src.includes('product') || src.includes('item') || src.includes('image'))) {
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
          await page.waitForTimeout(2000);
          
        } catch (error) {
          console.log(`Error with search term "${searchTerm}":`, error.message);
        }
      }
      
      await page.close();
      return bestResults;
      
    } catch (error) {
      console.error('Error testing Lulu:', error.message);
      return [];
    }
  }

  async runTests() {
    const testProducts = [
      'Capilano Honey 400g Twist & Squeeze',
      'NESTLE CAPPUCCINO DRINK 225 ML',
      'كابيلانو عسل 500 جم عبوة مقلوبة قابلة للضغط'
    ];
    
    for (const product of testProducts) {
      console.log(`\n🧪 Testing product: "${product}"`);
      
      const carrefourResults = await this.testCarrefourKSA(product);
      const pandaResults = await this.testPandaSA(product);
      const luluResults = await this.testLulu(product);
      
      console.log(`\n📊 Results for "${product}":`);
      console.log(`Carrefour KSA: ${carrefourResults.length} images`);
      console.log(`Panda.sa: ${pandaResults.length} images`);
      console.log(`Lulu: ${luluResults.length} images`);
      
      if (carrefourResults.length > 0) {
        console.log('Carrefour sample image:', carrefourResults[0].url);
      }
      if (pandaResults.length > 0) {
        console.log('Panda sample image:', pandaResults[0].url);
      }
      if (luluResults.length > 0) {
        console.log('Lulu sample image:', luluResults[0].url);
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
const testScraper = new TestScraper();
testScraper.runTests().catch(console.error); 