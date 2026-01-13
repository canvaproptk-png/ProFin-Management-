
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectManagement from './components/ProjectManagement';
import IncomeModule from './components/IncomeModule';
import ExpenseModule from './components/ExpenseModule';
import Settings from './components/Settings';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'income' | 'expenses' | 'settings'>('dashboard');
  const { state } = useAppContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'projects': return <ProjectManagement />;
      case 'income': return <IncomeModule />;
      case 'expenses': return <ExpenseModule />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 transition-colors`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
                {activeTab === 'dashboard' ? 'Overview' : activeTab.replace(/([A-Z])/g, ' $1')}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">Welcome back, {state.profile.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{state.profile.businessName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Professional Plan</p>
              </div>
              <img 
                src={state.profile.profilePic} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
              />
            </div>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
