import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Columns3,
  DollarSign,
  Stethoscope,
  Brain,
  Bell,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import type { Page } from '../types';
import { notifications } from '../mockData';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'patients', label: 'Pacientes', icon: <Users size={20} /> },
  { id: 'appointments', label: 'Agenda', icon: <Calendar size={20} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <Columns3 size={20} /> },
  { id: 'financial', label: 'Financeiro', icon: <DollarSign size={20} /> },
  { id: 'treatments', label: 'Tratamentos', icon: <Stethoscope size={20} /> },
  { id: 'insights', label: 'Insights & IA', icon: <Brain size={20} /> },
  { id: 'notifications', label: 'Notificações', icon: <Bell size={20} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
];

export default function Sidebar({ currentPage, onNavigate, darkMode, onToggleDark }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const sidebarContent = (
    <div className={`flex flex-col h-full ${collapsed ? 'w-[72px]' : 'w-64'} transition-all duration-300`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-dental-500 text-white font-bold text-lg shrink-0">
          🦷
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-base text-slate-900 dark:text-white leading-tight">Odonto Pro</h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">CRM Inteligente</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`shrink-0 ${isActive ? 'text-primary-500 dark:text-primary-400' : ''}`}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
                  {unreadCount}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-200 dark:border-slate-700/50 p-3 space-y-2">
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? (darkMode ? 'Modo Claro' : 'Modo Escuro') : undefined}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
        </button>

        {/* Collapse button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Recolher</span>}
        </button>

        {/* User */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-dental-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AC
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Admin Clínica</p>
              <p className="text-[11px] text-slate-400 truncate">Clínica Sorriso</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64 bg-white dark:bg-slate-900 shadow-2xl animate-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 shadow-sm">
        {sidebarContent}
      </aside>
    </>
  );
}
