export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive?: boolean;
}