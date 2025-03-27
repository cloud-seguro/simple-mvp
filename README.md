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
