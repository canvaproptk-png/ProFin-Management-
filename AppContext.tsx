import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Action } from './types';

const STORAGE_KEY = 'profin_app_state';

const initialState: AppState = {
  projects: [
    { id: '1', name: 'Summer Wedding', client: 'Alice Johnson', totalAmount: 5000, advancePayment: 2000, dueAmount: 3000, status: 'Pending', createdAt: new Date().toISOString() },
    { id: '2', name: 'Brand Shoot', client: 'Nike', totalAmount: 12000, advancePayment: 6000, dueAmount: 6000, status: 'Completed', createdAt: new Date().toISOString() }
  ],
  incomes: [
    { id: '1', client: 'Alice Johnson', category: 'Event', description: 'Initial deposit', amount: 2000, date: new Date().toISOString() },
    { id: '2', client: 'Nike', category: 'Commercial', description: 'Advance payment', amount: 6000, date: new Date().toISOString() }
  ],
  expenses: [
    { id: '1', description: 'Lens Rental', amount: 450, date: new Date().toISOString() },
    { id: '2', description: 'Studio Booking', amount: 800, date: new Date().toISOString() }
  ],
  profile: {
    name: 'Alex Creative',
    businessName: 'Lumina Studios',
    profilePic: 'https://picsum.photos/seed/alex/200/200',
    currency: 'USD',
    theme: 'light',
    primaryColor: 'indigo'
  }
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    case 'ADD_INCOME':
      return { ...state, incomes: [...state.incomes, action.payload] };
    case 'UPDATE_INCOME':
      return { ...state, incomes: state.incomes.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INCOME':
      return { ...state, incomes: state.incomes.filter(i => i.id !== action.payload) };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return { ...state, expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage if available
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initial;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    // Sync theme with document
    if (state.profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.profile.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};