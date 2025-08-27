export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  created_at: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
}