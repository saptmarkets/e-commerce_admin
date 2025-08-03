// Simple fuzzy matching implementation
export function fuzzyMatch(str1, str2) {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  // Check if one string contains the other
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.9;
  }
  
  // Calculate similarity using Levenshtein distance
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  
  return Math.max(0, 1 - (distance / maxLength));
}

// Levenshtein distance implementation
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Arabic text normalization
export function normalizeArabicText(text) {
  if (!text) return '';
  
  return text
    .replace(/[أإآ]/g, 'ا')  // Normalize alef
    .replace(/[ىي]/g, 'ي')   // Normalize yaa
    .replace(/[ةه]/g, 'ه')   // Normalize haa
    .replace(/[ؤئ]/g, 'و')   // Normalize waw
    .replace(/\s+/g, ' ')    // Normalize spaces
    .trim();
}

// Enhanced matching for Arabic text
export function arabicFuzzyMatch(str1, str2) {
  if (!str1 || !str2) return 0;
  
  const normalized1 = normalizeArabicText(str1);
  const normalized2 = normalizeArabicText(str2);
  
  // Try exact match first
  if (normalized1 === normalized2) return 1;
  
  // Try partial matches
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return 0.9;
  }
  
  // Use regular fuzzy matching
  return fuzzyMatch(normalized1, normalized2);
}

// Multi-language fuzzy matching
export function multiLanguageFuzzyMatch(str1, str2) {
  if (!str1 || !str2) return 0;
  
  // Check if text contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(str1) || /[\u0600-\u06FF]/.test(str2);
  
  if (hasArabic) {
    return arabicFuzzyMatch(str1, str2);
  } else {
    return fuzzyMatch(str1, str2);
  }
}

// Extract keywords from filename
export function extractKeywords(filename) {
  const name = filename.toLowerCase();
  
  return {
    company: extractCompany(name),
    product: extractProduct(name),
    size: extractSize(name),
    arabicKeywords: extractArabicKeywords(name)
  };
}

function extractCompany(filename) {
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

function extractProduct(filename) {
  // Remove common extensions and separators
  let cleanName = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
  cleanName = cleanName.replace(/[_-]/g, ' ');
  
  // Remove company keywords
  const companyKeywords = ['sapt', 'شركة', 'company', 'شركة سابت'];
  for (const keyword of companyKeywords) {
    cleanName = cleanName.replace(new RegExp(keyword, 'gi'), '');
  }
  
  return cleanName.trim();
}

function extractSize(filename) {
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

function extractArabicKeywords(filename) {
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