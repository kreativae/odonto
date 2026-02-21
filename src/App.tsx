import { useState, useEffect } from 'react';
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
import { Search, Bell, LogOut } from 'lucide-react';
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />

      <main className="flex-1 min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle[currentPage]}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">{authUser.clinicName} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 w-60 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Notifications */}
              <button
                onClick={() => setCurrentPage('notifications')}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell size={20} className="text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar with dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-dental-500 flex items-center justify-center text-white text-xs font-bold">
                    {authUser.avatar}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">{authUser.name}</p>
                    <p className="text-[10px] text-slate-400">{authUser.role}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in">
                      {/* User info */}
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-dental-500 flex items-center justify-center text-white text-sm font-bold">
                            {authUser.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{authUser.name}</p>
                            <p className="text-xs text-slate-400">{authUser.email}</p>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-medium">
                              {authUser.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <button
                          onClick={() => { setCurrentPage('settings'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          ⚙️ Configurações
                        </button>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          👤 Meu Perfil
                        </button>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          🏥 {authUser.clinicName}
                        </button>
                      </div>

                      <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                        >
                          <LogOut size={16} /> Sair da conta
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
        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
