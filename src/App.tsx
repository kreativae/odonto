import { useState, useEffect, useCallback } from 'react';
import type { Page } from './types';
import LoginPage from './components/LoginPage';
import type { AuthUser } from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Pipeline from './components/Pipeline';
import Financial from './components/Financial';
import Treatments from './components/Treatments';
import Insights from './components/Insights';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import { Search, Bell, LogOut, Settings as SettingsIcon, User, Building2, ChevronDown } from 'lucide-react';
import { notifications } from './mockData';

const pageTitle: Record<Page, string> = {
  dashboard: 'Dashboard',
  patients: 'Pacientes',
  appointments: 'Agenda',
  pipeline: 'Pipeline',
  financial: 'Financeiro',
  treatments: 'Tratamentos',
  insights: 'Insights & IA',
  notifications: 'Notificações',
  settings: 'Configurações',
};

const pageEmoji: Record<Page, string> = {
  dashboard: '📊',
  patients: '👥',
  appointments: '📅',
  pipeline: '📈',
  financial: '💰',
  treatments: '🦷',
  insights: '🧠',
  notifications: '🔔',
  settings: '⚙️',
};

export function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('odonto-auth-user');
      if (saved) {
        try { return JSON.parse(saved); } catch { return null; }
      }
    }
    return null;
  });

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('odonto-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('odonto-dark-mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('odonto-auth-user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('odonto-auth-user');
    }
  }, [authUser]);

  const toggleDark = () => setDarkMode(prev => !prev);

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAuthUser(null);
    setShowUserMenu(false);
  };

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setPageKey(prev => prev + 1);
  }, []);

  // If not authenticated, show login page
  if (!authUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'patients': return <Patients />;
      case 'appointments': return <Appointments />;
      case 'pipeline': return <Pipeline />;
      case 'financial': return <Financial />;
      case 'treatments': return <Treatments />;
      case 'insights': return <Insights />;
      case 'notifications': return <Notifications />;
      case 'settings': return <Settings darkMode={darkMode} onToggleDark={toggleDark} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-primary-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />

      <main className="flex-1 min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="lg:hidden w-10" />
              <div className="animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-lg hidden sm:inline">{pageEmoji[currentPage]}</span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {pageTitle[currentPage]}
                  </h2>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:block mt-0.5">
                  {authUser.clinicName} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <div className={`hidden md:block relative transition-all duration-400 ${searchFocused ? 'w-72' : 'w-56'}`}>
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar pacientes, consultas..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 input-glow outline-none transition-all duration-300"
                />
              </div>

              {/* Mobile Search */}
              <button className="md:hidden p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all btn-press">
                <Search size={19} className="text-slate-500 dark:text-slate-400" />
              </button>

              {/* Notifications */}
              <button
                onClick={() => handleNavigate('notifications')}
                className="relative p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all btn-press group"
              >
                <Bell size={19} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-red-300 animate-pulse-ring">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar with dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-1.5 pr-2 sm:pr-3 py-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all btn-press group"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-dental-500 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-md shadow-primary-400/20 group-hover:shadow-lg group-hover:shadow-primary-400/30 transition-all">
                    {authUser.avatar}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[90px]">{authUser.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{authUser.role}</p>
                  </div>
                  <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl shadow-2xl z-50 overflow-hidden animate-pop-in border border-slate-200/80 dark:border-slate-700/60">
                      {/* User info */}
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-primary-50/50 to-dental-50/50 dark:from-primary-500/5 dark:to-dental-500/5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-dental-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-400/20">
                            {authUser.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{authUser.name}</p>
                            <p className="text-xs text-slate-400 truncate">{authUser.email}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold">
                              {authUser.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        {[
                          { icon: <SettingsIcon size={15} />, label: 'Configurações', action: () => { handleNavigate('settings'); setShowUserMenu(false); } },
                          { icon: <User size={15} />, label: 'Meu Perfil', action: () => setShowUserMenu(false) },
                          { icon: <Building2 size={15} />, label: authUser.clinicName, action: () => setShowUserMenu(false) },
                        ].map((item, i) => (
                          <button
                            key={i}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all font-medium btn-press"
                          >
                            <span className="text-slate-400">{item.icon}</span>
                            {item.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-1.5 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold btn-press"
                        >
                          <LogOut size={15} /> Sair da conta
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-3 sm:p-4 lg:p-8" key={pageKey}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
