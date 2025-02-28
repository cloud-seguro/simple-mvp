import type { UserRole } from "@prisma/client";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  birth_date?: Date;
  created_at: Date;
  updated_at: Date;
} 