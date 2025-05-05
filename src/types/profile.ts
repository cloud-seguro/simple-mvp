import type { UserRole } from "@prisma/client";

export interface Profile {
  id: string;
  userId: string;
  avatarUrl?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  email?: string;
  phoneNumber?: string;
  company?: string;
  company_role?: string;
}
