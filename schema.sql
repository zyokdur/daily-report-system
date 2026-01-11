-- Create tables for the Daily Report System

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Package Prices table
CREATE TABLE IF NOT EXISTS package_prices (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL, -- TL, USD, EUR, KK
  adult_price DECIMAL(10, 2) NOT NULL,
  child_price DECIMAL(10, 2) NOT NULL,
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Reports table
CREATE TABLE IF NOT EXISTS daily_reports (
  id SERIAL PRIMARY KEY,
  report_date DATE NOT NULL,
  usd_rate DECIMAL(10, 4) DEFAULT 1.0,
  eur_rate DECIMAL(10, 4) DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Lines table
CREATE TABLE IF NOT EXISTS report_lines (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  package_price_id INTEGER NOT NULL REFERENCES package_prices(id),
  adult_qty INTEGER NOT NULL,
  child_qty INTEGER NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL, -- TL, USD, EUR, KK
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_package_prices_package_id ON package_prices(package_id);
CREATE INDEX IF NOT EXISTS idx_report_lines_report_id ON report_lines(report_id);
CREATE INDEX IF NOT EXISTS idx_report_lines_package_price_id ON report_lines(package_price_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(report_date);

-- Sample data (optional, comment out if not needed)
INSERT INTO packages (name) VALUES ('Visitor Sinema Paketi USD') ON CONFLICT DO NOTHING;
INSERT INTO packages (name) VALUES ('Visitor Sinema Paketi TL') ON CONFLICT DO NOTHING;
INSERT INTO packages (name) VALUES ('Visitor Sinema Paketi EUR') ON CONFLICT DO NOTHING;
INSERT INTO packages (name) VALUES ('Combo Paketi KK') ON CONFLICT DO NOTHING;
