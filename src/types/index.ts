export interface Transaction {
  _id?: string;
  userId: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: Date;
  tags?: string[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  }
} 