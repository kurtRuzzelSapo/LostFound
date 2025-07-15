export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  phone_number: string | null;
  whatsapp: string | null;
  preferred_contact_method: "email" | "phone" | "whatsapp";
  contact_visibility: "public" | "private" | "friends_only";
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileData {
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  whatsapp?: string;
  preferred_contact_method?: "email" | "phone" | "whatsapp";
  contact_visibility?: "public" | "private" | "friends_only";
}
