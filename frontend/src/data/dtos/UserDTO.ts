export interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  location?: string | null;
  specialty?: string | null;
}
