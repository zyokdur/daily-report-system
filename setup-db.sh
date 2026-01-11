#!/bin/bash
# Development Setup Script - Initialize Database with Sample Data

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Daily Report System - Database Setup${NC}"
echo "========================================"

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if psql -U postgres -h localhost -d daily_reports -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL connection successful${NC}"
else
    echo -e "${YELLOW}Starting PostgreSQL via Docker...${NC}"
    docker-compose up -d postgres
    sleep 3
fi

# Run schema
echo -e "${YELLOW}Creating tables...${NC}"
psql -U postgres -h localhost -d daily_reports -f schema.sql

# Add sample data
echo -e "${YELLOW}Adding sample data...${NC}"
psql -U postgres -h localhost -d daily_reports << EOF

-- Insert sample packages
INSERT INTO packages (name) VALUES
  ('Visitor Sinema Paketi USD'),
  ('Visitor Sinema Paketi TL'),
  ('Visitor Sinema Paketi EUR'),
  ('Combo Paketi KK'),
  ('Premium Tur Paketi USD'),
  ('Premium Tur Paketi TL')
ON CONFLICT DO NOTHING;

-- Get package IDs and insert prices
INSERT INTO package_prices (package_id, currency, adult_price, child_price)
SELECT id, 'USD', 50.00, 25.00 FROM packages WHERE name = 'Visitor Sinema Paketi USD'
UNION ALL
SELECT id, 'TL', 1500.00, 750.00 FROM packages WHERE name = 'Visitor Sinema Paketi TL'
UNION ALL
SELECT id, 'EUR', 45.00, 22.50 FROM packages WHERE name = 'Visitor Sinema Paketi EUR'
UNION ALL
SELECT id, 'KK', 0.00, 0.00 FROM packages WHERE name = 'Combo Paketi KK'
UNION ALL
SELECT id, 'USD', 100.00, 50.00 FROM packages WHERE name = 'Premium Tur Paketi USD'
UNION ALL
SELECT id, 'TL', 3000.00, 1500.00 FROM packages WHERE name = 'Premium Tur Paketi TL'
ON CONFLICT DO NOTHING;

-- Insert sample daily report
INSERT INTO daily_reports (report_date, usd_rate, eur_rate)
VALUES ('2025-01-11', 32.5, 35.0)
ON CONFLICT DO NOTHING;

-- Insert sample report lines
INSERT INTO report_lines (report_id, package_price_id, adult_qty, child_qty, line_total, currency)
SELECT 
  dr.id,
  pp.id,
  2,
  1,
  (pp.adult_price * 2) + (pp.child_price * 1),
  pp.currency
FROM daily_reports dr, package_prices pp
WHERE dr.report_date = '2025-01-11' AND pp.currency = 'USD'
LIMIT 1
ON CONFLICT DO NOTHING;

EOF

echo -e "${GREEN}✓ Database setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Start dev server: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Login with: admin / admin"
