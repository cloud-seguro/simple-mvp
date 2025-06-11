# Boring Next.js Template

A modern Next.js template with Supabase authentication, profiles, and file uploads.

## 🚀 Features

- ⚡️ Next.js 14 with App Router
- 🔋 Prisma ORM with PostgreSQL
- 🔑 Authentication with Supabase Auth
- 🎨 Tailwind CSS + shadcn/ui
- 📁 File uploads with Supabase Storage
- 🔄 Type-safe database queries
- 🎭 Dark mode with next-themes
- 🛠 Complete TypeScript support

## 📦 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

## 🛠 Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/boring-next.git
cd boring-next
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env.local
```

4. Create a Supabase project:

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project credentials from Settings > API
   - Create a storage bucket named "avatars" in Storage

5. Configure your `.env.local`:

```env
# Supabase Project Settings
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database URLs
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:5432/postgres"

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=avatars
```

6. Initialize Prisma:

```bash
pnpm prisma generate
pnpm prisma db push
```

## 🚀 Development

Start the development server:

```bash
pnpm dev
```

Your app will be available at `http://localhost:3000`

## 🏗 Project Structure

```
├── app/                   # Next.js App Router
│   ├── api/              # API routes
│   ├── auth/             # Auth routes
│   └── (dashboard)/      # Protected routes
├── components/           # React components
│   ├── ui/              # UI components
│   └── settings/        # Settings components
├── lib/                  # Utility functions
├── providers/           # React context providers
└── public/              # Static assets
```

## 📝 Database Management

### Push schema changes

```bash
pnpm prisma db push
```

### Reset database

```bash
pnpm prisma db reset
```

### Open Prisma Studio

```bash
pnpm prisma studio
```

## 🔧 Common Issues & Solutions

### Image Loading Issues

Add your Supabase storage domain to `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["your-project-ref.supabase.co"],
  },
};
```

### Database Connection Issues

- Verify your DATABASE_URL in .env.local
- Ensure you're using the correct Supabase connection strings
- Check if your IP is allowed in Supabase dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Credentials

### Supabase

- Project name: POSITIVE-Next-Template
- DB Password: e9zKY_Km5HbkiiF
- Anon Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Zmd2ZmhwbWljd3B0dXBqeWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNjY4NDksImV4cCI6MjA1NTY0Mjg0OX0.OiccFqJXdAM6tPIvULA3EaZxtCOsuwhiMugjyGzXNFk
- Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Zmd2ZmhwbWljd3B0dXBqeWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDA2Njg0OSwiZXhwIjoyMDU1NjQyODQ5fQ.jOx413xoAvBdez9ofCGU8DEIunRI2SU9SXWJsm_IY2Q
- Project URL: https://swfgvfhpmicwptupjyko.supabase.co

- PRISMA URLs:

  # Connect to Supabase via connection pooling with Supavisor.

  DATABASE_URL="postgresql://postgres.swfgvfhpmicwptupjyko:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

  # Direct connection to the database. Used for migrations.

  DIRECT_URL="postgresql://postgres.swfgvfhpmicwptupjyko:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# SIMPLE - Cybersecurity Maturity Assessment

SIMPLE es una aplicación de evaluación de madurez en ciberseguridad que permite a los usuarios evaluar su nivel de seguridad y recibir recomendaciones personalizadas.

## Características principales

- Evaluaciones de ciberseguridad (inicial y avanzada)
- Cálculo de nivel de madurez basado en estándares
- Recomendaciones personalizadas
- Asignación de especialistas según resultados
- Panel de administración

## Desarrollo

### Requisitos

- Node.js (v18 o superior)
- PostgreSQL
- Supabase (para autenticación)

### Instalación

1. Clona el repositorio
2. Instala dependencias:
   ```
   npm install
   ```
3. Copia el archivo `.env.example` a `.env.local` y configura las variables de entorno
4. Ejecuta las migraciones de la base de datos:
   ```
   npx prisma migrate dev
   ```
5. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

### Poblar la base de datos con especialistas

Para probar la funcionalidad de reserva de especialistas, puedes poblar la base de datos con especialistas de ejemplo:

```bash
npm run db:seed
```

Este comando creará:

- Un usuario SuperAdmin necesario para la creación de especialistas
- 7 especialistas con diferentes áreas de expertise y niveles de madurez

## Características de reserva de especialistas

El sistema ahora incluye funcionalidades para conectar a los usuarios con especialistas en ciberseguridad:

1. **Call to Action en resultados**: Los usuarios verán un banner atractivo en la sección de "Resumen General" que les invita a agendar una consulta con especialistas.

2. **Recomendaciones personalizadas**: El sistema recomienda especialistas específicos basados en:

   - El nivel de madurez del usuario (1-5)
   - Las categorías de ciberseguridad con menor puntuación

3. **Página de agenda**: Los usuarios pueden ver detalles completos de los especialistas recomendados y programar una consulta inicial gratuita.

## Licencia

Propiedad de BORING.

# Simple MVP Project

A full-stack Next.js application with authentication, breach verification, and evaluation systems.

## Features

- User authentication with Supabase
- Profile management
- Breach verification system with detailed analysis
- Evaluation system
- Dashboard with analytics

## Breach Verification System

### Overview

The breach verification system allows users to search for data breaches affecting emails or domains. It provides comprehensive analysis including:

- Real-time breach detection using external APIs
- Password strength analysis
- Risk level assessment
- Detailed reporting and export capabilities

### New Features Added

#### Detailed Analysis View

- **Route**: `/breach-verification/[requestId]`
- **Purpose**: Shows comprehensive breach analysis for a specific search request
- **Features**:
  - Full breach details with affected data types
  - Password analysis with strength ratings
  - Risk assessment with visual indicators
  - Export capabilities (PDF/CSV)
  - Security-focused hash display options

#### Enhanced Search History

- **View Details Button**: Navigate to detailed analysis from search history
- **Improved UI**: Better visualization of risk levels and breach counts
- **Quick Actions**: Repeat searches or view full analysis

### API Endpoints

#### Main Breach Verification

- `POST /api/breach-verification` - Perform new breach search
- `GET /api/breach-verification` - Get search history

#### Detailed Analysis

- `GET /api/breach-verification/[requestId]` - Get detailed breach analysis

### Components

#### Core Components

- `BreachVerificationPage` - Main search interface
- `DetailedAnalysisPage` - Comprehensive analysis view
- `SearchHistoryTable` - Enhanced history with navigation
- `BreachResultsTable` - Breach data display
- `PasswordAnalysisTable` - Password analysis with hash visibility toggle

#### Navigation Flow

1. User performs breach search on main page
2. Results are displayed with summary
3. Search is saved to history
4. User can click "View Details" in history to see full analysis
5. Detailed page shows comprehensive breakdown with export options

### Security Features

- Password hashes are stored securely (not plain text)
- Optional hash visibility with security warnings
- Risk level calculations based on multiple factors
- Rate limiting and caching for external API calls

### Technical Implementation

- Uses Dehashed API for breach data
- Simple password strength analysis (OpenAI integration available)
- Prisma ORM for database operations
- React Query for state management
- Next.js App Router for routing

## Environment Variables

```env
# Database
DATABASE_URL="your_database_url"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Breach Verification APIs
DEHASHED_API_KEY="your_dehashed_api_key"
OPENAI_API_KEY="your_openai_api_key" # Optional
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma db push`
5. Start development server: `npm run dev`

## Database Schema

The application uses Prisma with PostgreSQL and includes models for:

- User profiles and authentication
- Breach search requests and results
- Password analysis and security assessments
- Search history and data sources

## Contributing

Please ensure all new features include proper TypeScript types, error handling, and are tested with the existing UI components and patterns.
