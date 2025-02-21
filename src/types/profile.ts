import type { UserRole } from "@prisma/client";

export interface Profile {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  bio: string | null;
  birthDate: Date;
} 