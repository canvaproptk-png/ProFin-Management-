
export type Category = 'Event' | 'Photoshoot' | 'Videography' | 'Commercial' | 'Music Compose' | 'Voice Record';

export interface Project {
  id: string;
  name: string;
  client: string;
  totalAmount: number;
  advancePayment: number;
  dueAmount: number;
  status: 'Pending' | 'Completed';
  createdAt: string;
}

export interface Income {
  id: string;
  client: string;
  category: Category;
  description: string;
  amount: number;
  date: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface UserProfile {
  name: string;
  businessName: string;
  profilePic: string;
  currency: string;
  theme: 'light' | 'dark';
  primaryColor: string;
}

export interface AppState {
  projects: Project[];
  incomes: Income[];
  expenses: Expense[];
  profile: UserProfile;
}

export type Action =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'UPDATE_INCOME'; payload: Income }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> };
