import { TriangleAlert, CheckCircle, XCircle } from "lucide-react";
import type { RiskLevelDisplay } from "@/types/breach-verification";

export function getRiskLevel(breachCount: number): RiskLevelDisplay {
  if (breachCount >= 3) {
    return {
      level: "Alto",
      color: "destructive",
      icon: XCircle,
    };
  }
  if (breachCount >= 1) {
    return {
      level: "Medio",
      color: "yellow",
      icon: TriangleAlert,
    };
  }
  return {
    level: "Bajo",
    color: "green",
    icon: CheckCircle,
  };
}

export function getPasswordStrengthColor(strength: string): string {
  switch (strength) {
    case "Débil":
      return "destructive";
    case "Media":
      return "yellow";
    case "Fuerte":
      return "green";
    default:
      return "secondary";
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateDomain(domain: string): boolean {
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
}

export function formatBreachDate(dateString: string | Date): string {
  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Fecha desconocida";
    }

    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting breach date:", error, dateString);
    return "Fecha desconocida";
  }
}

export function generatePasswordMask(password: string): string {
  return "•".repeat(password.length);
}
