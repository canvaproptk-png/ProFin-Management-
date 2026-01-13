
import React from 'react';
import { useAppContext } from '../AppContext';
import { User, Shield, Palette, Globe, Bell, Moon, Sun } from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleProfileUpdate = (key: string, value: any) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { [key]: value } });
  };

  const toggleTheme = () => {
    handleProfileUpdate('theme', state.profile.theme === 'light' ? 'dark' : 'light');
  };

  const currencies = [
    { code: 'USD', label: 'USD ($)' },
    { code: 'BDT', label: 'BDT (৳)' },
    { code: 'INR', label: 'INR (₹)' },
    { code: 'EUR', label: 'EUR (€)' },
    { code: 'GBP', label: 'GBP (£)' },
    { code: 'JPY', label: 'JPY (¥)' },
    { code: 'CAD', label: 'CAD ($)' },
    { code: 'AUD', label: 'AUD ($)' },
    { code: 'SGD', label: 'SGD ($)' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="relative inline-block mb-4">
            <img 
              src={state.profile.profilePic} 
              alt="Avatar" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-xl"
            />
            <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
              <User size={18} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{state.profile.name}</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">{state.profile.businessName}</p>
          <div className="mt-6 flex justify-center space-x-2">
             <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold uppercase">Pro Account</span>
          </div>
        </div>

        <nav className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
           {[
             { icon: User, label: 'Public Profile' },
             { icon: Shield, label: 'Security' },
             { icon: Palette, label: 'Appearance' },
             { icon: Globe, label: 'Language & Region' },
             { icon: Bell, label: 'Notifications' },
           ].map((item, idx) => (
             <button key={idx} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${idx === 2 ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
               <item.icon size={20} />
               <span className="font-medium">{item.label}</span>
             </button>
           ))}
        </nav>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Profile Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={state.profile.name}
                onChange={(e) => handleProfileUpdate('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={state.profile.businessName}
                onChange={(e) => handleProfileUpdate('businessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preferred Currency</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={state.profile.currency}
                onChange={(e) => handleProfileUpdate('currency', e.target.value)}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>{curr.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Visual Customization</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Dark Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark visual interfaces</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200 ${state.profile.theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${state.profile.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                   {state.profile.theme === 'dark' ? <Moon size={14} className="text-indigo-600" /> : <Sun size={14} className="text-amber-500" />}
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Primary Theme Color</p>
              <div className="flex space-x-4">
                {['indigo', 'emerald', 'rose', 'amber', 'violet'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleProfileUpdate('primaryColor', color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      state.profile.primaryColor === color ? 'ring-4 ring-offset-2 ring-indigo-500 ring-offset-white dark:ring-offset-slate-800' : ''
                    }`}
                    style={{ backgroundColor: color === 'indigo' ? '#6366f1' : color === 'emerald' ? '#10b981' : color === 'rose' ? '#f43f5e' : color === 'amber' ? '#f59e0b' : '#8b5cf6' }}
                  >
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
           <button className="px-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Discard</button>
           <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-colors">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
