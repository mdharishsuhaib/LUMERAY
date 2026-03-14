export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Expense {
  id: number;
  user_id?: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}
