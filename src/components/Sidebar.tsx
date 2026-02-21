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
  Menu,
  X,
  LogOut,
  Sparkles,
} from 'lucide-react';
import type { Page } from '../types';
import { notifications } from '../mockData';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode; emoji?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'patients', label: 'Pacientes', icon: <Users size={20} /> },
  { id: 'appointments', label: 'Agenda', icon: <Calendar size={20} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <Columns3 size={20} /> },
  { id: 'financial', label: 'Financeiro', icon: <DollarSign size={20} /> },
  { id: 'treatments', label: 'Tratamentos', icon: <Stethoscope size={20} /> },
  { id: 'insights', label: 'Insights & IA', icon: <Brain size={20} />, emoji: '✨' },
  { id: 'notifications', label: 'Notificações', icon: <Bell size={20} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
];

export default function Sidebar({ currentPage, onNavigate, darkMode, onToggleDark }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const sidebarContent = (isMobile = false) => (
    <div className={`flex flex-col h-full ${collapsed && !isMobile ? 'w-[76px]' : 'w-[260px]'} transition-all duration-400 ease-out`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-dental-500 text-white font-bold text-lg shrink-0 shadow-lg shadow-primary-500/20 animate-gradient">
          <span className="text-lg">🦷</span>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
        </div>
        {(collapsed && !isMobile) ? null : (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="font-extrabold text-[15px] text-slate-900 dark:text-white leading-tight tracking-tight">
              Odonto Pro
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium flex items-center gap-1">
              <Sparkles size={9} /> CRM Inteligente
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = currentPage === item.id;
          const isHovered = hoveredItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold relative group btn-press
                ${isActive
                  ? 'active bg-gradient-to-r from-primary-50 to-primary-50/50 dark:from-primary-500/10 dark:to-primary-500/5 text-primary-600 dark:text-primary-400 shadow-sm shadow-primary-100 dark:shadow-none'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              style={{ animationDelay: `${index * 0.03}s` }}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <span className={`shrink-0 transition-all duration-300 ${isActive ? 'text-primary-500 dark:text-primary-400 scale-110' : isHovered ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              {(collapsed && !isMobile) ? null : (
                <span className="animate-fade-in truncate">{item.label}</span>
              )}
              {item.emoji && !(collapsed && !isMobile) && (
                <span className="ml-auto text-[10px] animate-float-soft">{item.emoji}</span>
              )}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className={`${collapsed && !isMobile ? 'absolute -top-0.5 -right-0.5' : 'ml-auto'} bg-red-500 text-white text-[9px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm shadow-red-300 dark:shadow-red-900 animate-pulse-ring`}>
                  {unreadCount}
                </span>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 p-2.5 space-y-1">
        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-300 btn-press"
          title={collapsed && !isMobile ? (darkMode ? 'Modo Claro' : 'Modo Escuro') : undefined}
        >
          <span className="shrink-0 transition-transform duration-500" style={{ transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
          </span>
          {(collapsed && !isMobile) ? null : (
            <span className="animate-fade-in">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          )}
        </button>

        {/* Collapse button - desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-300 btn-press"
          >
            <span className="shrink-0 transition-transform duration-400" style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <ChevronLeft size={20} />
            </span>
            {!collapsed && <span className="animate-fade-in">Recolher</span>}
          </button>
        )}

        {/* User Card */}
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-100 dark:border-slate-800 transition-all duration-300 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-dental-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-primary-300/30 dark:shadow-primary-900/30">
            AC
          </div>
          {(collapsed && !isMobile) ? null : (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate">Admin Clínica</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 truncate font-medium">Clínica Sorriso</p>
            </div>
          )}
          {(collapsed && !isMobile) ? null : (
            <button className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 shrink-0 hover:rotate-12">
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-2xl glass shadow-lg text-slate-600 dark:text-slate-300 btn-press hover:scale-105 transition-transform duration-200"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="overlay-backdrop absolute inset-0" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-[260px] bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-left">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all z-10"
            >
              <X size={18} />
            </button>
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-100 dark:border-slate-800/80 transition-all duration-400 z-20">
        {sidebarContent(false)}
      </aside>
    </>
  );
}
