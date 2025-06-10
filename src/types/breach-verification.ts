import type {
  BreachSearchType,
  BreachRequestStatus,
  RiskLevel,
  BreachSeverity,
  PasswordStrength,
} from "@prisma/client";

export interface BreachResult {
  id: string;
  requestId: string;
  sourceId?: string;
  breachName: string;
  breachDate: Date;
  affectedEmails: string[];
  affectedDomains: string[];
  dataTypes: string[];
  severity: BreachSeverity;
  description?: string;
  verificationDate: Date;
  isVerified: boolean;
  metadata?: any;
}

export interface PasswordAnalysis {
  id: string;
  requestId: string;
  passwordHash: string;
  strength: PasswordStrength;
  occurrences: number;
  recommendation: string;
  crackTime?: string;
  patterns: string[];
  entropy?: number;
  createdAt: Date;
}

export interface RiskLevelDisplay {
  level: "Alto" | "Medio" | "Bajo";
  color: "destructive" | "yellow" | "green";
  icon: any; // Lucide icon component
}

export interface BreachSearchRequest {
  id: string;
  type: BreachSearchType;
  searchValue: string;
  profileId: string;
  status: BreachRequestStatus;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  totalBreaches?: number;
  riskLevel?: RiskLevel;
}

export interface BreachSearchResponse {
  requestId: string;
  breachCount: number;
  riskLevel: RiskLevel;
  results: BreachResult[];
  passwordAnalysis: PasswordAnalysis[];
}

export interface SearchHistory {
  id: string;
  requestId: string;
  profileId: string;
  searchType: BreachSearchType;
  searchValue: string;
  breachCount: number;
  riskLevel: RiskLevel;
  timestamp: Date;
}

// Legacy types for backward compatibility with existing components
export interface LegacyBreachResult {
  email: string;
  breachCount: number;
  firstBreach: string;
  lastBreach: string;
  passwordsFound: number;
}

export interface LegacyPasswordAnalysis {
  password: string;
  occurrences: number;
  strength: "Débil" | "Media" | "Fuerte";
  recommendation: string;
}

export interface LegacySearchHistory {
  id: string;
  searchType: "email" | "domain";
  searchValue: string;
  timestamp: Date;
  breachCount: number;
  riskLevel: "Alto" | "Medio" | "Bajo";
}
