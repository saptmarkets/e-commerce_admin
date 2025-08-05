import { fuzzyMatch } from '../utils/imageMatcher';

class ImageMatchingService {
  constructor() {
    this.companyKeywords = this.loadCompanyKeywords();
    this.sizePatterns = this.loadSizePatterns();
    this.arabicKeywords = this.loadArabicKeywords();
  }

  async matchImagesWithProducts(images, products, settings) {
    const matches = [];
    
    for (const image of images) {
      const imageKeywords = this.extractKeywords(image.name);
      const bestMatch = this.findBestMatch(imageKeywords, products, settings);
      
      matches.push({
        imageName: image.name,
        imagePath: image.path,
        imagePreview: image.preview,
        productId: bestMatch?.product?._id || bestMatch?.product?.id || null,
        productName: bestMatch?.product?.title || bestMatch?.product?.name || null,
        confidence: bestMatch?.confidence || 0,
        alternatives: bestMatch?.alternatives || [],
        status: this.determineStatus(bestMatch?.confidence, settings.confidenceThreshold)
      });
    }
    
    return { matches };
  }

  extractKeywords(filename) {
    // Enhanced keyword extraction for Arabic and English
    const name = filename.toLowerCase();
    
    return {
      company: this.extractCompany(name),
      product: this.extractProduct(name),
      size: this.extractSize(name),
      arabicKeywords: this.extractArabicKeywords(name)
    };
  }

  findBestMatch(imageKeywords, products, settings) {
    let bestMatch = null;
    let bestScore = 0;
    const alternatives = [];

    for (const product of products) {
      const score = this.calculateMatchScore(imageKeywords, product, settings);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { product, confidence: score };
      }
      
      if (score > settings.confidenceThreshold * 0.5) {
        alternatives.push({ product, confidence: score });
      }
    }

    return {
      ...bestMatch,
      alternatives: alternatives
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map(alt => alt.product.title?.en || alt.product.title?.ar || 'Unknown')
    };
  }

  calculateMatchScore(imageKeywords, product, settings) {
    let totalScore = 0;
    let weightSum = 0;

    // Get product names in both languages
    const productNameEn = product.title?.en || product.name?.en || '';
    const productNameAr = product.title?.ar || product.name?.ar || '';
    const productSku = product.sku || '';
    const productBarcode = product.barcode || '';

    // Company matching (30% weight)
    if (settings.enableEnglishMatching) {
      const companyScore = fuzzyMatch(imageKeywords.company, product.company || '') * 0.3;
      totalScore += companyScore;
      weightSum += 0.3;
    }

    // Product name matching - English (25% weight)
    if (settings.enableEnglishMatching && productNameEn) {
      const productScoreEn = fuzzyMatch(imageKeywords.product, productNameEn) * 0.25;
      totalScore += productScoreEn;
      weightSum += 0.25;
    }

    // Product name matching - Arabic (25% weight)
    if (settings.enableArabicMatching && productNameAr) {
      const productScoreAr = fuzzyMatch(imageKeywords.product, productNameAr) * 0.25;
      totalScore += productScoreAr;
      weightSum += 0.25;
    }

    // Arabic keyword matching (20% weight)
    if (settings.enableArabicMatching && imageKeywords.arabicKeywords.length > 0) {
      const arabicScore = this.calculateArabicScore(imageKeywords.arabicKeywords, product) * 0.2;
      totalScore += arabicScore;
      weightSum += 0.2;
    }

    // SKU/Barcode matching (10% weight)
    const skuScore = fuzzyMatch(imageKeywords.product, productSku) * 0.1;
    const barcodeScore = fuzzyMatch(imageKeywords.product, productBarcode) * 0.1;
    totalScore += Math.max(skuScore, barcodeScore);
    weightSum += 0.1;

    // Normalize score
    return Math.round((totalScore / weightSum) * 100);
  }

  calculateArabicScore(arabicKeywords, product) {
    let maxScore = 0;
    
    // Get product names in both languages
    const productNameEn = product.title?.en || product.name?.en || '';
    const productNameAr = product.title?.ar || product.name?.ar || '';
    const productSku = product.sku || '';
    const productBarcode = product.barcode || '';
    
    for (const keyword of arabicKeywords) {
      const score = Math.max(
        fuzzyMatch(keyword, productNameAr),
        fuzzyMatch(keyword, productNameEn),
        fuzzyMatch(keyword, productSku),
        fuzzyMatch(keyword, productBarcode)
      );
      maxScore = Math.max(maxScore, score);
    }
    
    return maxScore;
  }

  determineStatus(confidence, threshold) {
    if (confidence >= threshold) return 'matched';
    if (confidence >= threshold * 0.7) return 'manual';
    return 'no_match';
  }

  // Keyword extraction methods
  extractCompany(filename) {
    const companyPatterns = [
      /sapt/i,
      /شركة\s*سابت/i,
      /company/i,
      /شركة/i
    ];
    
    for (const pattern of companyPatterns) {
      const match = filename.match(pattern);
      if (match) return match[0];
    }
    
    return '';
  }

  extractProduct(filename) {
    // Remove common extensions and separators
    let cleanName = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    cleanName = cleanName.replace(/[_-]/g, ' ');
    
    // Remove company keywords
    const companyKeywords = ['sapt', 'شركة', 'company', 'شركة سابت'];
    for (const keyword of companyKeywords) {
      cleanName = cleanName.replace(new RegExp(keyword, 'gi'), '');
    }
    
    // Remove size patterns
    const sizePatterns = [
      /(كبير|صغير|متوسط)/i,
      /(large|medium|small)/i,
      /(\d+)\s*(كجم|كيلو|kg|g)/i,
      /(\d+)\s*(لتر|liter|l)/i,
      /(\d+)\s*(مل|ml)/i
    ];
    
    for (const pattern of sizePatterns) {
      cleanName = cleanName.replace(pattern, '');
    }
    
    return cleanName.trim();
  }

  extractSize(filename) {
    const sizePatterns = [
      /(كبير|صغير|متوسط)/i,
      /(large|medium|small)/i,
      /(\d+)\s*(كجم|كيلو|kg|g)/i,
      /(\d+)\s*(لتر|liter|l)/i
    ];
    
    for (const pattern of sizePatterns) {
      const match = filename.match(pattern);
      if (match) return match[0];
    }
    
    return '';
  }

  extractArabicKeywords(filename) {
    const arabicKeywords = [
      'منتج', 'سلعة', 'بضاعة', 'مادة', 'طعام', 'شراب',
      'لحم', 'خضار', 'فاكهة', 'حليب', 'جبن', 'خبز',
      'أرز', 'سكر', 'ملح', 'زيت', 'زبدة', 'عسل'
    ];
    
    const foundKeywords = [];
    for (const keyword of arabicKeywords) {
      if (filename.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    }
    
    return foundKeywords;
  }

  // Load keyword dictionaries
  loadCompanyKeywords() {
    return [
      'sapt', 'شركة سابت', 'sapt markets', 'سابت ماركتس',
      'company', 'شركة', 'corporation', 'مؤسسة'
    ];
  }

  loadSizePatterns() {
    return [
      'كبير', 'صغير', 'متوسط', 'large', 'small', 'medium',
      'كجم', 'كيلو', 'kg', 'g', 'لتر', 'liter', 'l'
    ];
  }

  loadArabicKeywords() {
    return [
      'منتج', 'سلعة', 'بضاعة', 'مادة', 'طعام', 'شراب',
      'لحم', 'خضار', 'فاكهة', 'حليب', 'جبن', 'خبز',
      'أرز', 'سكر', 'ملح', 'زيت', 'زبدة', 'عسل',
      'دجاج', 'لحم بقري', 'سمك', 'بيض', 'زبادي',
      'عصير', 'ماء', 'شاي', 'قهوة', 'حلويات'
    ];
  }
}

export default new ImageMatchingService(); 