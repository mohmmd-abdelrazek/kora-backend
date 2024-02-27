export interface AppUser {
  id: number;
  name: string;
  email: string;
  password: string; // Note: In real applications, ensure this is hashed
  created_at?: Date;
  updated_at?: Date;
  email_verified?: boolean;
  last_login?: Date;
  status?: "active" | "inactive" | "suspended";
  role?: "user" | "admin" | "moderator";
  password_reset_token?: string | null;
  password_reset_expires?: Date | null;
  profile_picture_url?: string | null;
}
