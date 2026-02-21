import {
  Building2,
  Users,
  Shield,
  Bell,
  Database,
  Globe,
  Palette,
  Lock,
  Mail,
  Smartphone,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

const settingsGroups = [
  {
    title: 'Clínica',
    items: [
      { icon: <Building2 size={18} />, label: 'Dados da Clínica', desc: 'Nome, endereço, CNPJ e contato', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
      { icon: <Users size={18} />, label: 'Equipe e Profissionais', desc: 'Gerenciar dentistas e funcionários', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
      { icon: <Globe size={18} />, label: 'Unidades', desc: 'Multi-clínica e filiais', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10' },
    ],
  },
  {
    title: 'Acesso e Segurança',
    items: [
      { icon: <Shield size={18} />, label: 'Permissões (RBAC)', desc: 'Controle de acesso granular por perfil', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
      { icon: <Lock size={18} />, label: 'Segurança e LGPD', desc: 'Criptografia, logs e conformidade', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
      { icon: <Database size={18} />, label: 'Backup e Dados', desc: 'Backup automático e exportação', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
    ],
  },
  {
    title: 'Integrações',
    items: [
      { icon: <Smartphone size={18} />, label: 'WhatsApp API', desc: 'Confirmações e lembretes automáticos', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
      { icon: <Mail size={18} />, label: 'Email e SMS', desc: 'Configurar provedores de email e SMS', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
      { icon: <Bell size={18} />, label: 'Automações', desc: 'Workflows e campanhas automáticas', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    ],
  },
];

export default function Settings({ darkMode, onToggleDark }: SettingsProps) {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gerencie sua clínica, equipe, permissões e integrações
        </p>
      </div>

      {/* Theme Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <Palette size={18} className="text-violet-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Aparência</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Alternar entre modo claro e escuro</p>
            </div>
          </div>
          <button
            onClick={onToggleDark}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              darkMode ? 'bg-primary-600' : 'bg-slate-300'
            }`}
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
              darkMode ? 'left-7' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Clinic Info Card */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-dental-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl">
            🦷
          </div>
          <div>
            <h2 className="text-xl font-bold">Clínica Sorriso</h2>
            <p className="text-sm text-white/70">CNPJ: 12.345.678/0001-90</p>
            <p className="text-sm text-white/70">Rua das Flores, 123 – São Paulo, SP</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-lg font-bold">4</p>
            <p className="text-xs text-white/70">Profissionais</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-lg font-bold">3</p>
            <p className="text-xs text-white/70">Salas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-lg font-bold">342</p>
            <p className="text-xs text-white/70">Pacientes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-lg font-bold">Pro</p>
            <p className="text-xs text-white/70">Plano</p>
          </div>
        </div>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group) => (
        <div key={group.title}>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            {group.title}
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 divide-y divide-slate-100 dark:divide-slate-700/50">
            {group.items.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl group"
              >
                <div className={`p-2.5 rounded-xl ${item.bg} shrink-0`}>
                  <span className={item.color}>{item.icon}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* RBAC Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Perfis de Acesso (RBAC)</h3>
        <div className="space-y-3">
          {[
            { role: '👑 Admin da Clínica', perms: 'Acesso total', users: 1, color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' },
            { role: '🦷 Dentista', perms: 'Pacientes, Agenda, Prontuário', users: 4, color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' },
            { role: '💼 Secretária', perms: 'Agenda, Pacientes (leitura), Pipeline', users: 2, color: 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400' },
            { role: '💰 Financeiro', perms: 'Financeiro, Relatórios', users: 1, color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
            { role: '📊 Gestor', perms: 'Dashboard, Pipeline, Relatórios', users: 1, color: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400' },
            { role: '👀 Visualizador', perms: 'Somente leitura', users: 0, color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' },
          ].map((r) => (
            <div key={r.role} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${r.color} min-w-[170px]`}>
                {r.role}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">{r.perms}</span>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={12} />
                <span>{r.users}</span>
              </div>
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
