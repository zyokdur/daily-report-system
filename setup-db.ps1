# Daily Report System - Database Setup Script for Windows PowerShell

Write-Host "Daily Report System - Database Setup" -ForegroundColor Blue
Write-Host "====================================" -ForegroundColor Blue
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "PostgreSQL client (psql) not found in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL or add it to PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow

try {
    $output = psql -U postgres -h localhost -d daily_reports -c "SELECT 1" 2>&1
    Write-Host "✓ PostgreSQL connection successful" -ForegroundColor Green
} catch {
    Write-Host "Starting PostgreSQL via Docker..." -ForegroundColor Yellow
    docker-compose up -d postgres
    Start-Sleep -Seconds 3
}

# Run schema
Write-Host "Creating tables..." -ForegroundColor Yellow
$schemaContent = Get-Content schema.sql -Raw
$schemaContent | psql -U postgres -h localhost -d daily_reports

# Add sample data
Write-Host "Adding sample data..." -ForegroundColor Yellow

$sampleData = @"
-- Insert sample packages
INSERT INTO packages (name) VALUES
  ('Visitor Sinema Paketi USD'),
  ('Visitor Sinema Paketi TL'),
  ('Visitor Sinema Paketi EUR'),
  ('Combo Paketi KK'),
  ('Premium Tur Paketi USD'),
  ('Premium Tur Paketi TL')
ON CONFLICT (name) DO NOTHING;

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
ON CONFLICT (package_id, currency) DO NOTHING;

"@

$sampleData | psql -U postgres -h localhost -d daily_reports

Write-Host "✓ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Blue
Write-Host "1. Start dev server: npm run dev"
Write-Host "2. Open http://localhost:3000"
Write-Host "3. Login with: admin / admin"
