// Currency extraction from package name
// Example: "Visitor Sinema Paketi USD" -> "USD"
export function extractCurrencyFromPackageName(packageName: string): string | null {
  const currencyPatterns = ['USD', 'EUR', 'TL', 'KK'];
  
  for (const currency of currencyPatterns) {
    if (packageName.includes(currency)) {
      return currency;
    }
  }
  
  return null;
}

// Determine currency for a line
// Priority 1: Package name currency
// Priority 2: Payment type
export function determineCurrency(packageName: string, paymentType?: string): string {
  const extractedCurrency = extractCurrencyFromPackageName(packageName);
  
  if (extractedCurrency) {
    return extractedCurrency;
  }
  
  if (paymentType) {
    return paymentType;
  }
  
  return 'TL'; // Default
}

// Calculate line total
export function calculateLineTotal(
  adultQty: number,
  childQty: number,
  adultPrice: number,
  childPrice: number
): number {
  return adultQty * adultPrice + childQty * childPrice;
}

// Currency conversion
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  usdRate: number,
  eurRate: number,
  conversionDirection: 'multiply' | 'divide' = 'divide'
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // If target currency is TL, we're converting TO TL
  // If source is TL, we're converting FROM TL
  
  if (fromCurrency === 'TL') {
    // Converting from TL to another currency
    if (toCurrency === 'USD') {
      return conversionDirection === 'divide' ? amount / usdRate : amount * usdRate;
    }
    if (toCurrency === 'EUR') {
      return conversionDirection === 'divide' ? amount / eurRate : amount * eurRate;
    }
  } else if (toCurrency === 'TL') {
    // Converting to TL from another currency
    if (fromCurrency === 'USD') {
      return conversionDirection === 'multiply' ? amount * usdRate : amount / usdRate;
    }
    if (fromCurrency === 'EUR') {
      return conversionDirection === 'multiply' ? amount * eurRate : amount / eurRate;
    }
  }
  
  return amount;
}

// Build column mapping for output
export interface LineColumnMapping {
  creditCard: number;
  tl: number;
  usd: number;
  eur: number;
}

export function getColumnMapping(currency: string, lineTotal: number): LineColumnMapping {
  return {
    creditCard: currency === 'KK' ? lineTotal : 0,
    tl: currency === 'TL' ? lineTotal : 0,
    usd: currency === 'USD' ? lineTotal : 0,
    eur: currency === 'EUR' ? lineTotal : 0,
  };
}
