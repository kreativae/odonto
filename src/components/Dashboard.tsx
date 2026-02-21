import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Target,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Activity,
  Sparkles,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { patients, appointments, pipelineCards, revenueData, revenueByProfessional, transactions } from '../mockData';

const todayStr = new Date().toISOString().split('T')[0];
const todayAppointments = appointments.filter(a => a.date === todayStr);

const metrics = [
  {
    title: 'Faturamento Mensal',
    value: 'R$ 87.450',
    change: 12.5,
    changeLabel: 'vs mês anterior',
    icon: <DollarSign size={22} />,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    ringColor: 'ring-emerald-100 dark:ring-emerald-900/30',
  },
  {
    title: 'Pacientes Ativos',
    value: patients.filter(p => p.status === 'active').length.toString(),
    change: 8.3,
    changeLabel: 'novos este mês',
    icon: <Users size={22} />,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    ringColor: 'ring-blue-100 dark:ring-blue-900/30',
  },
  {
    title: 'Consultas Hoje',
    value: todayAppointments.length.toString(),
    change: 0,
    changeLabel: `${todayAppointments.filter(a => a.status === 'confirmed').length} confirmadas`,
    icon: <Calendar size={22} />,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    textColor: 'text-violet-600 dark:text-violet-400',
    ringColor: 'ring-violet-100 dark:ring-violet-900/30',
  },
  {
    title: 'Taxa de Conversão',
    value: '68%',
    change: 5.2,
    changeLabel: 'vs mês anterior',
    icon: <Target size={22} />,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
    ringColor: 'ring-amber-100 dark:ring-amber-900/30',
  },
];

const maxRevenue = Math.max(...revenueData.map(d => d.value));

export default function Dashboard() {
  const pipelineTotal = pipelineCards.reduce((sum, c) => sum + c.value, 0);
  const closedValue = pipelineCards.filter(c => c.stage === 'fechado').reduce((sum, c) => sum + c.value, 0);
  const inNegotiation = pipelineCards.filter(c => c.stage === 'negociacao').reduce((sum, c) => sum + c.value, 0);
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
          Bem-vindo de volta! Aqui está o resumo da sua clínica.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, i) => (
          <div
            key={metric.title}
            className={`glass-card rounded-2xl p-4 sm:p-5 card-hover group animate-pop-in stagger-${i + 1}`}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-2.5 rounded-xl ${metric.bg} ring-1 ${metric.ringColor} group-hover:scale-110 transition-transform duration-300`}>
                <span className={metric.textColor}>{metric.icon}</span>
              </div>
              {metric.change > 0 && (
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] sm:text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 sm:py-1 rounded-full">
                  <TrendingUp size={11} />
                  +{metric.change}%
                </div>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white stat-value animate-count-up">
              {metric.value}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
              {metric.changeLabel}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6 animate-pop-in stagger-5">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Faturamento</h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={14} />
              +12.5%
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-36 sm:h-48">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 chart-bar">
                <span className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold tabular-nums">
                  {(d.value / 1000).toFixed(0)}k
                </span>
                <div className="w-full relative group/bar">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 cursor-pointer ${
                      i === revenueData.length - 1
                        ? 'bg-gradient-to-t from-primary-600 via-primary-500 to-primary-400 shadow-lg shadow-primary-500/20'
                        : 'bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 group-hover/bar:from-primary-300 group-hover/bar:to-primary-200 dark:group-hover/bar:from-primary-600 dark:group-hover/bar:to-primary-500'
                    }`}
                    style={{ height: `${(d.value / maxRevenue) * 140}px` }}
                  />
                </div>
                <span className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-500 font-semibold">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Professional */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 animate-pop-in stagger-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-0.5 text-sm sm:text-base">Receita por Profissional</h3>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mb-4 sm:mb-6">Janeiro 2024</p>
          <div className="space-y-4">
            {revenueByProfessional.map((prof, i) => (
              <div key={prof.name} className={`animate-slide-in stagger-${i + 1}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">{prof.name}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    R$ {(prof.value / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-dental-500 progress-bar-animated"
                    style={{ width: `${prof.percentage}%`, animationDelay: `${i * 0.15 + 0.3}s` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Today's Appointments */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 animate-pop-in stagger-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Agenda de Hoje</h3>
            <span className="text-[10px] sm:text-xs bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-full font-bold">
              {todayAppointments.length} consultas
            </span>
          </div>
          <div className="space-y-2.5 max-h-72 sm:max-h-80 overflow-y-auto">
            {todayAppointments.slice(0, 6).map((apt, i) => (
              <div
                key={apt.id}
                className={`flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group btn-press animate-slide-in stagger-${i + 1}`}
              >
                <div
                  className="w-1 h-10 rounded-full shrink-0 transition-all duration-300 group-hover:h-12"
                  style={{ backgroundColor: apt.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{apt.patientName}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 truncate">{apt.treatment}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">{apt.startTime}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {apt.status === 'confirmed' ? (
                      <CheckCircle2 size={11} className="text-emerald-500" />
                    ) : (
                      <Clock size={11} className="text-amber-500" />
                    )}
                    <span className={`text-[9px] sm:text-[10px] font-bold ${apt.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 animate-pop-in stagger-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Últimas Transações</h3>
            <Activity size={18} className="text-slate-300 dark:text-slate-600" />
          </div>
          <div className="space-y-2 max-h-72 sm:max-h-80 overflow-y-auto">
            {recentTransactions.map((tx, i) => (
              <div key={tx.id} className={`flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 cursor-pointer animate-slide-in stagger-${i + 1}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'
                }`}>
                  {tx.type === 'income' ? (
                    <TrendingUp size={15} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={15} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{tx.description}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">{tx.patientName || tx.category}</p>
                </div>
                <span className={`text-xs sm:text-sm font-bold shrink-0 tabular-nums ${
                  tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}R$ {tx.value.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 animate-pop-in stagger-9 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Pipeline</h3>
            <Target size={18} className="text-slate-300 dark:text-slate-600" />
          </div>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary-50 via-primary-50/50 to-dental-50 dark:from-primary-500/10 dark:via-primary-500/5 dark:to-dental-500/10 border border-primary-100/50 dark:border-primary-800/20">
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Valor Total</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white stat-value animate-count-up">
                R$ {(pipelineTotal / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-800/20">
                <p className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 stat-value">
                  R$ {(closedValue / 1000).toFixed(1)}k
                </p>
                <p className="text-[10px] sm:text-[11px] text-emerald-600/70 dark:text-emerald-400/70 font-semibold">Fechados</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-800/20">
                <p className="text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-400 stat-value">
                  R$ {(inNegotiation / 1000).toFixed(1)}k
                </p>
                <p className="text-[10px] sm:text-[11px] text-amber-600/70 dark:text-amber-400/70 font-semibold">Em Negociação</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Leads Ativos', value: pipelineCards.filter(c => c.stage !== 'fechado' && c.stage !== 'perdido').length, suffix: '' },
                { label: 'Ticket Médio', value: `R$ ${(pipelineTotal / pipelineCards.length / 1000).toFixed(1)}k`, suffix: '' },
                { label: 'Taxa Conversão', value: '68%', suffix: '', highlight: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                  <span className={`text-xs sm:text-sm font-bold ${item.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.value}{item.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="relative rounded-2xl overflow-hidden animate-pop-in stagger-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-dental-600 animate-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Sparkles size={18} className="text-white/90" />
            <h3 className="font-bold text-white text-sm sm:text-base">🧠 Insights da IA</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: <AlertTriangle size={16} />, title: 'Pacientes em Risco', value: '3', desc: 'sem retorno há +90 dias' },
              { icon: <TrendingUp size={16} />, title: 'Previsão Receita', value: 'R$ 92k', desc: 'estimativa para fevereiro' },
              { icon: <Zap size={16} />, title: 'Otimização Agenda', value: '4 gaps', desc: 'horários disponíveis' },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer group btn-press animate-pop-in stagger-${i + 1}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/70 group-hover:text-white transition-colors">{item.icon}</span>
                  <p className="text-xs sm:text-sm font-semibold text-white/90">{item.title}</p>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white stat-value">{item.value}</p>
                <p className="text-[10px] sm:text-xs text-white/50 mt-1 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
