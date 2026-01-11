# Proje Yapı Belgesi

## Tam Dosya Ağacı

```
daily-report-system/
│
├── src/                                   # TypeScript kaynakları
│   └── app/                              # Next.js App Router
│       ├── api/                          # API Route Handlers
│       │   ├── auth/
│       │   │   └── login/
│       │   │       └── route.ts          # POST /api/auth/login
│       │   ├── packages/
│       │   │   ├── route.ts              # GET/POST /api/packages
│       │   │   └── [id]/
│       │   │       └── route.ts          # PUT/DELETE /api/packages/[id]
│       │   ├── package-prices/
│       │   │   ├── route.ts              # GET/POST /api/package-prices
│       │   │   └── [id]/
│       │   │       └── route.ts          # PUT/DELETE /api/package-prices/[id]
│       │   └── daily-reports/
│       │       ├── route.ts              # GET/POST /api/daily-reports
│       │       └── [id]/
│       │           ├── route.ts          # GET/PUT/DELETE /api/daily-reports/[id]
│       │           ├── lines/
│       │           │   ├── route.ts      # GET/POST /api/daily-reports/[id]/lines
│       │           │   └── [lineId]/
│       │           │       └── route.ts  # PUT/DELETE /api/daily-reports/[id]/lines/[lineId]
│       │           └── export-excel/
│       │               └── route.ts      # POST /api/daily-reports/[id]/export-excel
│       │
│       ├── dashboard/
│       │   └── page.tsx                 # Main dashboard (/dashboard)
│       │
│       ├── packages/
│       │   └── page.tsx                 # Package management (/packages)
│       │
│       ├── prices/
│       │   └── page.tsx                 # Price management (/prices)
│       │
│       ├── reports/
│       │   ├── page.tsx                 # Reports list (/reports)
│       │   └── [id]/
│       │       └── page.tsx             # Report detail & edit (/reports/[id])
│       │
│       ├── page.tsx                     # Login page (/)
│       ├── layout.tsx                   # Root layout
│       └── globals.css                  # Global styles
│
├── lib/                                  # Utility libraries
│   ├── db.ts                            # PostgreSQL pool connection
│   └── calculations.ts                  # Business logic for calculations
│
├── public/                              # Static assets
│   ├── favicon.ico
│   └── (other static files)
│
├── node_modules/                        # Dependencies (auto-generated)
│
├── .next/                               # Build output (auto-generated)
│
├── .github/
│   └── copilot-instructions.md         # GitHub Copilot instructions
│
├── .env.local                           # Environment variables (local)
├── .env.example                         # Environment template
├── .gitignore                           # Git ignore rules
│
├── package.json                         # NPM dependencies and scripts
├── package-lock.json                    # Dependency lock file
│
├── tsconfig.json                        # TypeScript configuration
├── next.config.ts                       # Next.js configuration
├── tailwind.config.ts                   # Tailwind CSS configuration
├── postcss.config.mjs                   # PostCSS configuration
├── eslint.config.mjs                    # ESLint configuration
│
├── Dockerfile                           # Docker image for production
├── docker-compose.yml                   # Docker Compose for full stack
│
├── schema.sql                           # PostgreSQL database schema
├── setup-db.sh                          # Database setup (Bash)
├── setup-db.ps1                         # Database setup (PowerShell)
│
├── README.md                            # Main documentation
├── INSTALLATION.md                      # Installation guide
├── EXCEL_MAPPING.md                     # Excel template mapping docs
├── PROJECT_STRUCTURE.md                 # This file
│
└── (config files like .prettierrc, .eslintignore, etc.)
```

## Dosya Açıklamaları

### API Routes (src/app/api/)

#### Authentication
- **route.ts** - Simple demo login endpoint (admin/admin)

#### Packages Management
- **GET** - Fetch all packages
- **POST** - Create new package
- **PUT** - Update package
- **DELETE** - Delete package

#### Package Prices
- **GET** - Fetch all prices with currency details
- **POST** - Create price for package-currency combination
- **PUT** - Update price
- **DELETE** - Delete price

#### Daily Reports
- **GET** - List all reports with dates and exchange rates
- **POST** - Create new daily report
- **PUT** - Update USD/EUR rates
- **DELETE** - Delete report (cascades to report lines)

#### Report Lines
- **GET** - Fetch all lines for a specific report
- **POST** - Add line item to report
- **PUT** - Update line (qty, totals, currency)
- **DELETE** - Remove line from report

#### Excel Export
- **POST** - Generate and download Excel file for the report

### Frontend Pages

#### page.tsx (/)
Login page with basic authentication form.

#### dashboard/page.tsx (/dashboard)
Main dashboard with navigation cards:
- Daily Reports
- Packages
- Package Prices

#### packages/page.tsx (/packages)
Package management interface:
- List all packages
- Create new package
- Delete package

#### prices/page.tsx (/prices)
Package pricing interface:
- List prices by package and currency
- Create new price
- Update/Delete prices

#### reports/page.tsx (/reports)
Daily reports list:
- View all reports
- Create new report
- Delete report

#### reports/[id]/page.tsx (/reports/[id])
Report detail and editing:
- Add/remove line items
- Manage quantities
- Automatic calculations
- Display daily totals by currency
- Excel export button

### Backend Libraries

#### lib/db.ts
PostgreSQL connection pool configuration using `pg` package.

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
```

#### lib/calculations.ts
Business logic utilities:
- `extractCurrencyFromPackageName()` - Parse currency from package name
- `determineCurrency()` - Decide currency based on priority
- `calculateLineTotal()` - Calculate line total (adult_qty × adult_price + child_qty × child_price)
- `convertCurrency()` - Handle currency conversion
- `getColumnMapping()` - Determine which Excel column to fill

### Configuration Files

#### package.json
NPM dependencies and scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

#### tsconfig.json
TypeScript compiler options with:
- Path aliases (@/*)
- Strict mode enabled
- ES2020 target

#### tailwind.config.ts
Tailwind CSS configuration pointing to content files.

#### next.config.ts
Next.js configuration with TypeScript support.

#### postcss.config.mjs
PostCSS plugins (Tailwind, Autoprefixer).

### Database & Deployment

#### schema.sql
SQL schema with four main tables:
- `packages` - Package definitions
- `package_prices` - Pricing by currency
- `daily_reports` - Report headers with exchange rates
- `report_lines` - Individual line items

#### docker-compose.yml
Full stack deployment:
- PostgreSQL service
- Next.js application service
- Volume mounts for development

#### Dockerfile
Production Docker image:
- Node 20 Alpine
- Build Next.js
- Run `npm start`

### Documentation

#### README.md
Complete project overview, features, API endpoints, deployment instructions.

#### INSTALLATION.md
Step-by-step installation guide for different operating systems.

#### EXCEL_MAPPING.md
Detailed Excel template structure and mapping documentation.

#### PROJECT_STRUCTURE.md
This file - explains the entire project structure.

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/api` | REST API endpoint handlers |
| `src/app/[page]/` | Frontend page components |
| `src/lib/` | Shared utilities and business logic |
| `public/` | Static files (images, fonts, etc.) |
| `node_modules/` | NPM packages (auto-managed) |
| `.next/` | Next.js build output (auto-generated) |

## Environment Variables

Stored in `.env.local`:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Build Process

1. **Development**: `npm run dev` starts hot-reload server
2. **Production**: `npm run build` creates `.next/` folder, `npm start` runs server
3. **Docker**: Multistage build, production-optimized image

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL 16
- **Excel**: ExcelJS 4
- **Auth**: Demo (JWT-ready)

---

**Last Updated:** January 11, 2026
