// localStorage-based data management for offline-first operation

export interface Package {
  id: string;
  name: string;
  createdAt: string;
}

export interface PackagePrice {
  id: string;
  packageId: string;
  currency: string;
  adultPrice: number;
  childPrice: number;
  createdAt: string;
}

export interface ReportLine {
  id: string;
  packageId: string;
  adultQty: number;
  childQty: number;
  adultPrice: number;
  childPrice: number;
  lineTotal: number;
  currency: string;
  createdAt: string;
}

export interface DailyReport {
  id: string;
  date: string;
  lines: ReportLine[];
  totals: {
    [currency: string]: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Packages Management
export const packageStorage = {
  getAll: (): Package[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('packages');
    return data ? JSON.parse(data) : [];
  },

  add: (name: string): Package => {
    const packages = packageStorage.getAll();
    const newPackage: Package = {
      id: 'pkg_' + Date.now() + Math.random(),
      name,
      createdAt: new Date().toISOString(),
    };
    packages.push(newPackage);
    localStorage.setItem('packages', JSON.stringify(packages));
    return newPackage;
  },

  delete: (id: string): void => {
    const packages = packageStorage.getAll();
    const filtered = packages.filter(p => p.id !== id);
    localStorage.setItem('packages', JSON.stringify(filtered));
    
    // Also delete associated prices
    const prices = priceStorage.getAll();
    const filteredPrices = prices.filter(p => p.packageId !== id);
    localStorage.setItem('packagePrices', JSON.stringify(filteredPrices));
  },

  getById: (id: string): Package | null => {
    const packages = packageStorage.getAll();
    return packages.find(p => p.id === id) || null;
  },
};

// Package Prices Management
export const priceStorage = {
  getAll: (): PackagePrice[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('packagePrices');
    return data ? JSON.parse(data) : [];
  },

  getByPackageAndCurrency: (packageId: string, currency: string): PackagePrice | null => {
    const prices = priceStorage.getAll();
    return prices.find(p => p.packageId === packageId && p.currency === currency) || null;
  },

  getByPackage: (packageId: string): PackagePrice[] => {
    const prices = priceStorage.getAll();
    return prices.filter(p => p.packageId === packageId);
  },

  add: (packageId: string, currency: string, adultPrice: number, childPrice: number): PackagePrice => {
    const prices = priceStorage.getAll();
    
    // Check if exists and update instead
    const existing = prices.find(p => p.packageId === packageId && p.currency === currency);
    if (existing) {
      existing.adultPrice = adultPrice;
      existing.childPrice = childPrice;
      localStorage.setItem('packagePrices', JSON.stringify(prices));
      return existing;
    }

    const newPrice: PackagePrice = {
      id: 'price_' + Date.now() + Math.random(),
      packageId,
      currency,
      adultPrice,
      childPrice,
      createdAt: new Date().toISOString(),
    };
    prices.push(newPrice);
    localStorage.setItem('packagePrices', JSON.stringify(prices));
    return newPrice;
  },

  delete: (id: string): void => {
    const prices = priceStorage.getAll();
    const filtered = prices.filter(p => p.id !== id);
    localStorage.setItem('packagePrices', JSON.stringify(filtered));
  },
};

// Daily Reports Management
export const reportStorage = {
  getAll: (): DailyReport[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('dailyReports');
    return data ? JSON.parse(data) : [];
  },

  create: (date: string): DailyReport => {
    const reports = reportStorage.getAll();
    const newReport: DailyReport = {
      id: 'report_' + Date.now() + Math.random(),
      date,
      lines: [],
      totals: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reports.push(newReport);
    localStorage.setItem('dailyReports', JSON.stringify(reports));
    return newReport;
  },

  getById: (id: string): DailyReport | null => {
    const reports = reportStorage.getAll();
    return reports.find(r => r.id === id) || null;
  },

  delete: (id: string): void => {
    const reports = reportStorage.getAll();
    const filtered = reports.filter(r => r.id !== id);
    localStorage.setItem('dailyReports', JSON.stringify(filtered));
  },

  addLine: (reportId: string, line: Omit<ReportLine, 'id' | 'createdAt'>): DailyReport | null => {
    const reports = reportStorage.getAll();
    const report = reports.find(r => r.id === reportId);
    
    if (!report) return null;

    const newLine: ReportLine = {
      ...line,
      id: 'line_' + Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
    };

    report.lines.push(newLine);
    reportStorage.updateTotals(report);
    
    localStorage.setItem('dailyReports', JSON.stringify(reports));
    return report;
  },

  deleteLine: (reportId: string, lineId: string): DailyReport | null => {
    const reports = reportStorage.getAll();
    const report = reports.find(r => r.id === reportId);
    
    if (!report) return null;

    report.lines = report.lines.filter(l => l.id !== lineId);
    reportStorage.updateTotals(report);
    
    localStorage.setItem('dailyReports', JSON.stringify(reports));
    return report;
  },

  updateTotals: (report: DailyReport): void => {
    report.totals = {};
    
    for (const line of report.lines) {
      if (!report.totals[line.currency]) {
        report.totals[line.currency] = 0;
      }
      report.totals[line.currency] += line.lineTotal;
    }
  },
};

// Initialize mock data if storage is empty
export const initializeMockData = (): void => {
  if (typeof window === 'undefined') return;

  // Check if already initialized
  const packages = packageStorage.getAll();
  if (packages.length > 0) return;

  // Create sample packages
  const pkg1 = packageStorage.add('Visitor Sinema Paketi USD');
  const pkg2 = packageStorage.add('Visitor Sinema Paketi TL');
  const pkg3 = packageStorage.add('Combo Paketi KK');
  const pkg4 = packageStorage.add('Daytime Paketi EUR');

  // Add prices for packages
  priceStorage.add(pkg1.id, 'USD', 50, 30);
  priceStorage.add(pkg2.id, 'TL', 1500, 900);
  priceStorage.add(pkg3.id, 'KK', 100, 60);
  priceStorage.add(pkg4.id, 'EUR', 45, 27);

  // Create a sample report with line items
  const today = new Date().toISOString().split('T')[0];
  const report = reportStorage.create(today);

  // Add sample line items
  reportStorage.addLine(report.id, {
    packageId: pkg1.id,
    adultQty: 2,
    childQty: 1,
    adultPrice: 50,
    childPrice: 30,
    lineTotal: 2 * 50 + 1 * 30,
    currency: 'USD',
  });

  reportStorage.addLine(report.id, {
    packageId: pkg2.id,
    adultQty: 3,
    childQty: 0,
    adultPrice: 1500,
    childPrice: 900,
    lineTotal: 3 * 1500,
    currency: 'TL',
  });

  reportStorage.addLine(report.id, {
    packageId: pkg3.id,
    adultQty: 1,
    childQty: 2,
    adultPrice: 100,
    childPrice: 60,
    lineTotal: 1 * 100 + 2 * 60,
    currency: 'KK',
  });
};

// Cleanup old data (optional)
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('packages');
  localStorage.removeItem('packagePrices');
  localStorage.removeItem('dailyReports');
};
