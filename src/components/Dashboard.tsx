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
  AlertCircle,
  Activity,
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
  },
];

const maxRevenue = Math.max(...revenueData.map(d => d.value));

export default function Dashboard() {
  const pipelineTotal = pipelineCards.reduce((sum, c) => sum + c.value, 0);
  const closedValue = pipelineCards.filter(c => c.stage === 'fechado').reduce((sum, c) => sum + c.value, 0);
  const inNegotiation = pipelineCards.filter(c => c.stage === 'negociacao').reduce((sum, c) => sum + c.value, 0);
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Bem-vindo de volta! Aqui está o resumo da sua clínica.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${metric.bg}`}>
                <span className={metric.textColor}>{metric.icon}</span>
              </div>
              {metric.change > 0 && (
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  +{metric.change}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{metric.changeLabel}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Faturamento</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm font-semibold">
              <ArrowUpRight size={16} />
              +12.5%
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {(d.value / 1000).toFixed(0)}k
                </span>
                <div className="w-full relative group/bar">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      i === revenueData.length - 1
                        ? 'bg-gradient-to-t from-primary-600 to-primary-400'
                        : 'bg-slate-200 dark:bg-slate-700 group-hover/bar:bg-primary-300 dark:group-hover/bar:bg-primary-500/40'
                    }`}
                    style={{
                      height: `${(d.value / maxRevenue) * 160}px`,
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Professional */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Receita por Profissional</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Janeiro 2024</p>
          <div className="space-y-4">
            {revenueByProfessional.map((prof) => (
              <div key={prof.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{prof.name}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    R$ {(prof.value / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-dental-500 transition-all duration-700"
                    style={{ width: `${prof.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Agenda de Hoje</h3>
            <span className="text-xs bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-full font-semibold">
              {todayAppointments.length} consultas
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {todayAppointments.slice(0, 6).map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <div
                  className="w-1 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: apt.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{apt.patientName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{apt.treatment}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{apt.startTime}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {apt.status === 'confirmed' ? (
                      <CheckCircle2 size={12} className="text-emerald-500" />
                    ) : (
                      <Clock size={12} className="text-amber-500" />
                    )}
                    <span className={`text-[10px] font-medium ${apt.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Últimas Transações</h3>
            <Activity size={18} className="text-slate-400" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 py-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'
                }`}>
                  {tx.type === 'income' ? (
                    <TrendingUp size={14} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tx.description}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{tx.patientName || tx.category}</p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${
                  tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}R$ {tx.value.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Pipeline</h3>
            <Target size={18} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-dental-50 dark:from-primary-500/10 dark:to-dental-500/10">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Valor Total no Pipeline</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">R$ {(pipelineTotal / 1000).toFixed(1)}k</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">R$ {(closedValue / 1000).toFixed(1)}k</p>
                <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 font-medium">Fechados</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">R$ {(inNegotiation / 1000).toFixed(1)}k</p>
                <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 font-medium">Em Negociação</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Leads Ativos</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{pipelineCards.filter(c => c.stage !== 'fechado' && c.stage !== 'perdido').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Ticket Médio</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">R$ {(pipelineTotal / pipelineCards.length / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Taxa Conversão</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-dental-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} />
            <h3 className="font-semibold">🧠 Insights da IA</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm font-medium mb-1">Pacientes em Risco</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-white/70 mt-1">pacientes sem retorno há +90 dias</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm font-medium mb-1">Previsão Receita</p>
              <p className="text-2xl font-bold">R$ 92k</p>
              <p className="text-xs text-white/70 mt-1">estimativa para fevereiro</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm font-medium mb-1">Otimização Agenda</p>
              <p className="text-2xl font-bold">4 gaps</p>
              <p className="text-xs text-white/70 mt-1">horários disponíveis esta semana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
