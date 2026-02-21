import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
} from 'lucide-react';
import { transactions, revenueData } from '../mockData';

type TabFilter = 'all' | 'income' | 'expense';

export default function Financial() {
  const [tabFilter, setTabFilter] = useState<TabFilter>('all');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0);
  const profit = totalIncome - totalExpense;
  const overdueAmount = transactions.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.value, 0);

  const filteredTransactions = transactions.filter(t => {
    if (tabFilter === 'all') return true;
    return t.type === tabFilter;
  });

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financeiro</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Controle completo de receitas, despesas e fluxo de caixa
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download size={18} />
            Exportar
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25">
            <DollarSign size={18} />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <Wallet size={20} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
              <ArrowUpRight size={14} />
              +12.5%
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-400 mt-1">Receitas do mês</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10">
              <CreditCard size={20} className="text-red-500" />
            </div>
            <div className="flex items-center gap-1 text-red-500 text-xs font-semibold">
              <ArrowDownRight size={14} />
              -3.2%
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-400 mt-1">Despesas do mês</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <PiggyBank size={20} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
              <TrendingUp size={14} />
              Saudável
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-400 mt-1">Lucro líquido</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <AlertCircle size={20} className="text-amber-500" />
            </div>
            {overdueAmount > 0 && (
              <span className="text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold pulse-soft">
                Atenção
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">R$ {overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-400 mt-1">Inadimplência</p>
        </div>
      </div>

      {/* Chart + DRE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Fluxo de Caixa</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">Evolução mensal</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Receita</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-slate-500">Despesas</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-4 h-52">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {(d.value / 1000).toFixed(0)}k
                </span>
                <div className="w-full flex gap-1">
                  <div
                    className={`flex-1 rounded-lg transition-all duration-500 ${
                      i === revenueData.length - 1
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : 'bg-emerald-200 dark:bg-emerald-500/30'
                    }`}
                    style={{ height: `${(d.value / maxRevenue) * 180}px` }}
                  />
                  <div
                    className={`flex-1 rounded-lg transition-all duration-500 ${
                      i === revenueData.length - 1
                        ? 'bg-gradient-to-t from-red-500 to-red-300'
                        : 'bg-red-200 dark:bg-red-500/30'
                    }`}
                    style={{ height: `${((d.value * 0.35) / maxRevenue) * 180}px` }}
                  />
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DRE Simplificado */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">DRE Simplificado</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Janeiro 2024</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <span className="text-sm text-slate-700 dark:text-slate-300">Receita Bruta</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">R$ 87.450</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
              <span className="text-sm text-slate-700 dark:text-slate-300">(-) Impostos</span>
              <span className="text-sm font-semibold text-red-500">R$ 8.745</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
              <span className="text-sm text-slate-700 dark:text-slate-300">(-) Custos</span>
              <span className="text-sm font-semibold text-red-500">R$ 12.080</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
              <span className="text-sm text-slate-700 dark:text-slate-300">(-) Despesas</span>
              <span className="text-sm font-semibold text-red-500">R$ 18.530</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Lucro Líquido</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">R$ 48.095</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-emerald-500 font-medium">
                <TrendingUp size={12} />
                Margem: 55%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700/50 gap-4">
          <div className="flex items-center gap-2">
            <Receipt size={20} className="text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Transações</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
              {([
                { key: 'all' as TabFilter, label: 'Todas' },
                { key: 'income' as TabFilter, label: 'Receitas' },
                { key: 'expense' as TabFilter, label: 'Despesas' },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTabFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    tabFilter === key
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tipo</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Descrição</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Categoria</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Paciente</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Data</th>
                <th className="text-right p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Valor</th>
                <th className="text-center p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'
                    }`}>
                      {tx.type === 'income' ? (
                        <TrendingUp size={14} className="text-emerald-500" />
                      ) : (
                        <TrendingDown size={14} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.description}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full font-medium">
                      {tx.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {tx.patientName || '—'}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{tx.date}</td>
                  <td className="p-4 text-right">
                    <span className={`text-sm font-bold ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      tx.status === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : tx.status === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                      {tx.status === 'paid' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : 'Vencido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-green-50 dark:bg-green-500/10">
              <DollarSign size={18} className="text-green-500" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">PIX</h4>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">R$ 35.200</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '40%' }} />
            </div>
            <span className="text-xs text-slate-400 font-medium">40%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <CreditCard size={18} className="text-blue-500" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Cartão</h4>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">R$ 30.800</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }} />
            </div>
            <span className="text-xs text-slate-400 font-medium">35%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <Receipt size={18} className="text-amber-500" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Boleto</h4>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">R$ 21.450</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
            </div>
            <span className="text-xs text-slate-400 font-medium">25%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
