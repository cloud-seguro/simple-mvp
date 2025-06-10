# CIBERSEGURIDAD SIMPLE - APPLICATION SCOPE DOCUMENT

## Overview

**Ciberseguridad Simple** is a comprehensive cybersecurity evaluation and consulting platform designed for startups and fintechs. The platform simplifies cybersecurity assessment, identifies security gaps, and connects organizations with certified cybersecurity specialists.

## Core Mission

"Hacemos lo complejo de la Ciberseguridad Simple" - Making complex cybersecurity simple for organizations lacking time, technical knowledge, or facing high costs for cybersecurity services.

---

## 1. EVALUATIONS SYSTEM

### 1.1 Evaluation Types

#### Initial Evaluation (`INITIAL`)

- **Purpose**: Basic cybersecurity maturity assessment
- **Target**: All users (free access)
- **Questions**: 15 comprehensive questions across 4 categories
- **Categories**:
  - Políticas de Seguridad (Security Policies)
  - Identificación de Activos y Procesos (Asset & Process Identification)
  - SGSI y Controles Básicos (ISMS & Basic Controls)
  - Formación y Cultura de Seguridad (Training & Security Culture)
  - Indicadores, Continuidad e Incidentes (KPIs, Continuity & Incidents)

#### Advanced Evaluation (`ADVANCED`)

- **Purpose**: In-depth cybersecurity assessment
- **Target**: Premium users
- **Access Control**: Currently temporarily disabled premium requirement
- **Enhanced Features**: More detailed analysis and recommendations

### 1.2 Evaluation Flow Architecture

#### User Journey

1. **Landing Page** → Hero section with evaluation CTA
2. **Email Collection** → For guest users (unauthenticated)
3. **Interest Assessment** → Understanding user motivation
4. **Evaluation Questions** → Interactive quiz with scoring
5. **Results Processing** → Score calculation and maturity assessment
6. **Results Display** → Comprehensive cybersecurity report
7. **Specialist Recommendations** → Connect with experts

#### Technical Implementation

- **Frontend**: React components with Framer Motion animations
- **State Management**: React hooks and context providers
- **Data Flow**: Client → API Routes → Prisma → PostgreSQL
- **Authentication**: Supabase Auth with middleware protection

### 1.3 Scoring & Maturity System

#### Scoring Mechanism

- **Scale**: 0-3 points per question
- **Categories**: Individual scores per category
- **Overall Score**: Aggregated total score
- **Maturity Levels**: Calculated based on percentage scores

#### Results Features

- **PDF Export**: Professional evaluation reports
- **Historical Tracking**: For premium users
- **Comparative Analysis**: Multiple evaluation comparison
- **Recommendations**: Tailored improvement suggestions

### 1.4 Database Schema (Evaluations)

```sql
model Evaluation {
  id          String         @id @default(cuid())
  type        EvaluationType // INITIAL | ADVANCED
  title       String
  score       Float?
  profileId   String?
  answers     Json           // Stores all quiz answers
  createdAt   DateTime       @default(now())
  completedAt DateTime?
  metadata    Json?
  accessCode  String?        // For guest access
  guestEmail  String?
  guestFirstName String?
  guestLastName  String?
  guestCompany   String?
  guestPhoneNumber String?
  profile     Profile?       @relation(fields: [profileId], references: [id])
}
```

### 1.5 API Endpoints

- `POST /api/evaluations` - Create new evaluation
- `GET /api/evaluations` - Fetch user evaluations (premium)
- `GET /api/evaluations/[id]` - Get specific evaluation
- `POST /api/evaluations/guest` - Guest evaluation submission
- `POST /api/send-results` - Email evaluation results

---

## 2. CONTRATA SYSTEM (SPECIALIST HIRING)

### 2.1 Core Concept

Premium feature enabling organizations to hire certified cybersecurity specialists for specific security projects and consultations.

### 2.2 Specialist Management

#### Specialist Profile Structure

```sql
model Specialist {
  id               String           @id @default(cuid())
  name             String
  bio              String
  expertiseAreas   ExpertiseArea[]  // Enum of specialization areas
  contactEmail     String
  imageUrl         String?
  hourlyRate       Float?
  linkedinProfileUrl String?
  skills           String[]
  location         String?
  active           Boolean          @default(true)
  createdById      String
  engagements      Engagement[]
  deals            SpecialistDeal[]
}
```

#### Expertise Areas

- `NETWORK_SECURITY`
- `APPLICATION_SECURITY`
- `CLOUD_SECURITY`
- `INCIDENT_RESPONSE`
- `SECURITY_ASSESSMENT`
- `COMPLIANCE`
- `SECURITY_TRAINING`
- `SECURITY_ARCHITECTURE`
- `DATA_PROTECTION`
- `GENERAL`

### 2.3 Service Packages & Pricing

#### Standard Pricing Model

- **Fixed Pricing**: Transparent, standardized rates
- **Service Packages**: Pre-defined cybersecurity services
- **Duration-Based**: Clear timeframes for deliverables

Example pricing structure located in `/src/lib/constants/service-packages.ts`

### 2.4 Engagement System

#### Engagement Lifecycle

```sql
model Engagement {
  id           String           @id @default(cuid())
  title        String
  description  String
  status       EngagementStatus // PENDING | ACCEPTED | IN_PROGRESS | COMPLETED
  budget       Float?
  startDate    DateTime?
  endDate      DateTime?
  servicePackage String?        // Service package identifier
  urgency      String?          // LOW | MEDIUM | HIGH
  profileId    String
  specialistId String
  dealId       String?
  messages     Message[]
  attachments  Attachment[]
  statusHistory StatusChange[]
}
```

#### Status Flow

1. **PENDING** - Initial request submitted
2. **ACCEPTED** - Specialist accepts engagement
3. **REJECTED** - Specialist declines
4. **IN_PROGRESS** - Active project
5. **COMPLETED** - Project finished
6. **CANCELLED** - Cancelled by either party

### 2.5 Communication System

#### Message Thread

- **Real-time messaging** between clients and specialists
- **File attachments** support
- **Status change notifications**
- **Engagement-specific conversations**

#### Features

- Message history tracking
- File upload/download
- Status change logs
- Email notifications

### 2.6 Access Control

#### User Roles

- **FREE**: No access to contrata features
- **PREMIUM**: Full access to hire specialists
- **SUPERADMIN**: Administrative access

#### Route Protection

- Middleware-based authentication
- Role-based access control
- Premium subscription verification

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Frontend Stack

- **Framework**: Next.js 15.1.7 with App Router
- **UI Library**: React 19.0.0 + TailwindCSS 3.4.17
- **Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Animation**: Framer Motion 12.4.7
- **Forms**: react-hook-form + zod validation
- **State**: React Query (TanStack Query 5.66.7)

### 3.2 Backend Stack

- **API**: Next.js API Routes (RESTful)
- **Database**: PostgreSQL with Prisma ORM 6.4.0
- **Authentication**: Supabase Auth
- **Email**: Resend for transactional emails
- **Payments**: Stripe integration
- **File Storage**: Supabase Storage (for attachments)

### 3.3 Database Models Overview

#### Core Models

- **Profile**: User profiles with role-based access
- **Evaluation**: Cybersecurity assessments
- **Specialist**: Expert profiles and qualifications
- **Engagement**: Project connections between users and specialists
- **SpecialistDeal**: Service packages offered by specialists
- **Message**: Communication within engagements

#### Supporting Models

- **BlogPost**: Content management
- **BlogCategory**: Content organization
- **Attachment**: File management
- **StatusChange**: Audit trail for engagements

### 3.4 Security Implementation

#### Authentication & Authorization

- Supabase Auth integration
- JWT-based session management
- Role-based access control (RBAC)
- Route-level protection middleware

#### Security Features

- Client fingerprinting for session security
- CORS protection
- XSS prevention headers
- CSRF protection
- Input validation and sanitization

---

## 4. CURRENT IMPLEMENTATION STATUS

### 4.1 Fully Implemented ✅

#### Evaluations

- ✅ Initial evaluation questionnaire (15 questions)
- ✅ Advanced evaluation questionnaire
- ✅ Score calculation and maturity assessment
- ✅ PDF report generation
- ✅ Email results delivery
- ✅ Guest user evaluation flow
- ✅ Authenticated user evaluation flow
- ✅ Results comparison features
- ✅ Historical evaluation tracking

#### Contrata

- ✅ Specialist directory and profiles
- ✅ Engagement creation and management
- ✅ Message thread system
- ✅ File attachment handling
- ✅ Status change tracking
- ✅ Service package pricing structure
- ✅ Role-based access control
- ✅ Premium user verification

#### Infrastructure

- ✅ Database schema with proper relationships
- ✅ API routes for all core functions
- ✅ Authentication and authorization
- ✅ Email notification system
- ✅ File upload/storage system
- ✅ Payment integration (Stripe)

### 4.2 Key Features

#### User Experience

- **Responsive Design**: Mobile-optimized interface
- **Progressive Enhancement**: Lazy loading for performance
- **Accessibility**: ARIA labels and proper semantic HTML
- **Animation**: Smooth transitions and micro-interactions

#### Business Logic

- **Evaluation Engine**: Sophisticated scoring algorithms
- **Matching System**: Connect users with relevant specialists
- **Service Standardization**: Fixed pricing and service packages
- **Quality Control**: Specialist verification and ratings

---

## 5. INTEGRATION POINTS

### 5.1 External Services

- **Supabase**: Authentication, database, storage
- **Stripe**: Payment processing and subscriptions
- **Resend**: Email delivery service
- **Vercel**: Hosting and deployment

### 5.2 Internal Systems

- **Evaluation Results** → **Specialist Recommendations**
- **User Profiles** → **Engagement History**
- **Service Packages** → **Pricing Display**
- **Message System** → **Email Notifications**

---

## 6. DATA FLOW SUMMARY

### 6.1 Evaluation Flow

```
User Request → Email Collection → Interest Assessment →
Quiz Questions → Answer Processing → Score Calculation →
Results Generation → PDF Export → Specialist Recommendations
```

### 6.2 Contrata Flow

```
Premium User → Specialist Browse → Service Selection →
Engagement Creation → Specialist Notification →
Status Updates → Message Exchange → Project Completion
```

---

## 7. SCALABILITY & PERFORMANCE

### 7.1 Current Optimizations

- Lazy loading for non-critical components
- Database indexing on frequently queried fields
- API response caching where appropriate
- Image optimization and CDN usage

### 7.2 Architecture Benefits

- Serverless deployment with automatic scaling
- Database connection pooling
- Component-based architecture for reusability
- Type-safe development with TypeScript

---

This document provides a comprehensive overview of the **Evaluations** and **Contrata** systems within the Ciberseguridad Simple platform, covering architecture, implementation status, and technical details for both features.
