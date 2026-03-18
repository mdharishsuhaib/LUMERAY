export interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string; // e.g. "USD", "INR", "EUR" — stored per expense
}
