import { useState, useCallback } from 'react';
import {
  Sparkles,
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Target,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Heart,
  Shield,
  Eye,
  RefreshCw,
  Lightbulb,
  ChevronRight,
  Star,
  UserMinus,
  CalendarX,
  Wallet,
  Timer,
  Award,
  MessageSquare,
  X,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import {
  patients,
  appointments,
  pipelineCards,
  transactions,
  treatmentTypes,
  revenueData,
  professionals,
  revenueByProfessional,
} from '../mockData';

/* ────────── COMPUTED DATA ────────── */

const todayStr = new Date().toISOString().split('T')[0];
const todayAppts = appointments.filter(a => a.date === todayStr);
const activePatients = patients.filter(p => p.status === 'active');
const inactivePatients = patients.filter(p => p.status === 'inactive');
const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.value, 0);
const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.value, 0);
const overdueTransactions = transactions.filter(t => t.status === 'overdue');
const pipelineTotal = pipelineCards.reduce((s, c) => s + c.value, 0);
const closedCards = pipelineCards.filter(c => c.stage === 'fechado');
const lostCards = pipelineCards.filter(c => c.stage === 'perdido');
const activeLeads = pipelineCards.filter(c => c.stage !== 'fechado' && c.stage !== 'perdido');
const conversionRate = pipelineCards.length > 0 ? Math.round((closedCards.length / pipelineCards.length) * 100) : 0;
const avgTicket = patients.length > 0 ? Math.round(patients.reduce((s, p) => s + p.totalSpent, 0) / patients.length) : 0;
const confirmedToday = todayAppts.filter(a => a.status === 'confirmed').length;
const pendingToday = todayAppts.filter(a => a.status === 'pending').length;
const topTreatment = [...treatmentTypes].sort((a, b) => b.popularity - a.popularity)[0];
const topProfessional = [...revenueByProfessional].sort((a, b) => b.value - a.value)[0];
const lastMonthRevenue = revenueData[revenueData.length - 2]?.value || 0;
const currentRevenue = revenueData[revenueData.length - 1]?.value || 0;
const revenueGrowth = lastMonthRevenue > 0 ? Math.round(((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;
const patientsWithAllergies = patients.filter(p => p.allergies.length > 0);
const avgTreatmentsPerPatient = patients.length > 0 ? (patients.reduce((s, p) => s + p.treatmentsCount, 0) / patients.length).toFixed(1) : '0';
const stalledLeads = pipelineCards.filter(c => c.daysInStage > 10 && c.stage !== 'fechado' && c.stage !== 'perdido');

/* ────────── QUICK QUERIES (AI Simulation) ────────── */

interface QuickQuery {
  id: string;
  icon: React.ReactNode;
  label: string;
  category: 'financeiro' | 'pacientes' | 'agenda' | 'pipeline' | 'operacional';
  color: string;
  bg: string;
}

const quickQueries: QuickQuery[] = [
  { id: 'revenue_forecast', icon: <TrendingUp size={16} />, label: 'Qual a previsão de receita para o próximo mês?', category: 'financeiro', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { id: 'churn_risk', icon: <UserMinus size={16} />, label: 'Quais pacientes têm risco de evasão?', category: 'pacientes', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  { id: 'best_professional', icon: <Award size={16} />, label: 'Qual profissional tem melhor conversão?', category: 'pipeline', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { id: 'optimize_schedule', icon: <Calendar size={16} />, label: 'Como otimizar a agenda desta semana?', category: 'agenda', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { id: 'stalled_leads', icon: <Timer size={16} />, label: 'Quais leads estão parados no funil?', category: 'pipeline', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  { id: 'top_treatments', icon: <Star size={16} />, label: 'Quais tratamentos têm mais demanda?', category: 'operacional', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  { id: 'overdue_payments', icon: <Wallet size={16} />, label: 'Qual o cenário de inadimplência atual?', category: 'financeiro', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  { id: 'patient_ltv', icon: <Heart size={16} />, label: 'Qual o Lifetime Value médio dos pacientes?', category: 'pacientes', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
  { id: 'reactivation', icon: <RefreshCw size={16} />, label: 'Quais pacientes inativos podem ser reativados?', category: 'pacientes', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10' },
  { id: 'cost_analysis', icon: <PieChart size={16} />, label: 'Qual a margem líquida por procedimento?', category: 'financeiro', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  { id: 'no_show_analysis', icon: <CalendarX size={16} />, label: 'Qual o perfil de pacientes que faltam consultas?', category: 'agenda', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { id: 'revenue_per_chair', icon: <BarChart3 size={16} />, label: 'Qual a receita por cadeira/sala?', category: 'operacional', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
];

const generateAIResponse = (queryId: string): { title: string; content: string; metrics?: { label: string; value: string; change?: string; positive?: boolean }[]; recommendations?: string[]; chartData?: { label: string; value: number; color: string }[] } => {
  switch (queryId) {
    case 'revenue_forecast':
      return {
        title: '📊 Previsão de Receita – Próximo Mês',
        content: `Com base na tendência dos últimos 6 meses e no pipeline atual, a receita estimada para o próximo mês é de **R$ 92.300**. Isso representa um crescimento de ${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% em relação ao mês atual (R$ ${(currentRevenue / 1000).toFixed(0)}k). O pipeline tem R$ ${(pipelineTotal / 1000).toFixed(1)}k em negociação, com taxa de conversão de ${conversionRate}%.`,
        metrics: [
          { label: 'Previsão', value: 'R$ 92.300', change: '+5.5%', positive: true },
          { label: 'Pipeline Ativo', value: `R$ ${(activeLeads.reduce((s, c) => s + c.value, 0) / 1000).toFixed(1)}k`, change: `${activeLeads.length} leads`, positive: true },
          { label: 'Recorrência', value: 'R$ 35.400', change: 'Manutenções', positive: true },
          { label: 'Risco', value: 'R$ 8.200', change: 'Inadimplência', positive: false },
        ],
        recommendations: [
          'Converter os 2 leads em negociação pode adicionar R$ 40k',
          'Agendar retornos pendentes pode gerar R$ 12k adicionais',
          'Campanhas de reativação para inativos: potencial de R$ 8k',
        ],
      };

    case 'churn_risk':
      return {
        title: '⚠️ Pacientes com Risco de Evasão',
        content: `Identificamos **${inactivePatients.length + 2}** pacientes com alto risco de evasão. ${inactivePatients.length} já estão inativos e 2 ativos não comparecem há mais de 60 dias. O valor potencial em risco é de R$ ${((inactivePatients.reduce((s, p) => s + p.totalSpent, 0) * 0.3) / 1000).toFixed(1)}k em tratamentos futuros.`,
        metrics: [
          { label: 'Alto Risco', value: `${inactivePatients.length + 2}`, change: 'pacientes', positive: false },
          { label: 'Inativos', value: `${inactivePatients.length}`, change: 'sem retorno', positive: false },
          { label: 'Valor em Risco', value: `R$ ${((inactivePatients.reduce((s, p) => s + p.totalSpent, 0) * 0.3) / 1000).toFixed(1)}k`, positive: false },
          { label: 'Reativação', value: '68%', change: 'taxa esperada', positive: true },
        ],
        recommendations: [
          `Fernanda Costa Souza: última visita há 60+ dias. Enviar WhatsApp com oferta de retorno.`,
          'Criar campanha de reativação com desconto em limpeza para pacientes inativos',
          'Agendar ligações de follow-up para os 3 pacientes em risco',
          'Implementar pesquisa NPS pós-consulta para detectar insatisfação precocemente',
        ],
        chartData: [
          { label: 'Risco Alto', value: inactivePatients.length, color: '#ef4444' },
          { label: 'Risco Médio', value: 2, color: '#f59e0b' },
          { label: 'Risco Baixo', value: 3, color: '#22c55e' },
          { label: 'Estáveis', value: activePatients.length - 5, color: '#6366f1' },
        ],
      };

    case 'best_professional':
      return {
        title: '🏆 Performance dos Profissionais',
        content: `**${topProfessional.name}** lidera em faturamento com R$ ${(topProfessional.value / 1000).toFixed(1)}k (${topProfessional.percentage}% do total). Em conversão de leads, Dr. Rafael Santos tem a maior taxa (78%), seguido pela Dra. Camila Rocha (72%).`,
        metrics: [
          { label: 'Maior Receita', value: topProfessional.name.split(' ').slice(0, 2).join(' '), change: `R$ ${(topProfessional.value / 1000).toFixed(1)}k`, positive: true },
          { label: 'Maior Conversão', value: 'Dr. Rafael', change: '78%', positive: true },
          { label: 'Mais Consultas', value: 'Dra. Camila', change: '48/mês', positive: true },
          { label: 'Melhor NPS', value: 'Dra. Beatriz', change: '9.4/10', positive: true },
        ],
        recommendations: [
          'Dr. Rafael tem alta conversão: direcionar leads de alto valor para ele',
          'Dra. Beatriz tem ótimo NPS: usar como referência para treinamentos',
          'Equilibrar a agenda: Dr. Thiago tem 20% de capacidade ociosa',
        ],
        chartData: revenueByProfessional.map(p => ({
          label: p.name.split(' ').slice(0, 2).join(' '),
          value: p.value,
          color: professionals.find(pr => pr.name === p.name)?.color || '#6366f1',
        })),
      };

    case 'optimize_schedule':
      return {
        title: '📅 Otimização de Agenda',
        content: `A análise da agenda identifica **4 gaps de horário** esta semana que podem ser preenchidos. O horário das 15h-17h nas quartas tem menor ocupação (40%). Os horários de manhã (8h-11h) são os mais procurados (92% de ocupação).`,
        metrics: [
          { label: 'Gaps Detectados', value: '4', change: 'esta semana', positive: false },
          { label: 'Ocupação Média', value: '78%', change: 'ideal: 85%', positive: false },
          { label: 'Horário Pico', value: '8h-11h', change: '92% ocupação', positive: true },
          { label: 'Lista de Espera', value: '6', change: 'pacientes', positive: true },
        ],
        recommendations: [
          'Mover 2 pacientes da lista de espera para os gaps de quarta-feira',
          'Oferecer desconto de 10% para consultas no período das 15h-17h',
          'Bloquear horários não produtivos e concentrar atendimentos pela manhã',
          'Considerar estender o horário de segunda-feira (alta demanda)',
        ],
      };

    case 'stalled_leads':
      return {
        title: '🔴 Leads Parados no Funil',
        content: `**${stalledLeads.length}** leads estão parados há mais de 10 dias. O valor total em risco é de R$ ${(stalledLeads.reduce((s, c) => s + c.value, 0) / 1000).toFixed(1)}k. Os maiores gargalos estão nas etapas de "Orçamento Enviado" e "Negociação".`,
        metrics: [
          { label: 'Leads Parados', value: `${stalledLeads.length}`, change: '>10 dias', positive: false },
          { label: 'Valor em Risco', value: `R$ ${(stalledLeads.reduce((s, c) => s + c.value, 0) / 1000).toFixed(1)}k`, positive: false },
          { label: 'Tempo Médio', value: `${stalledLeads.length > 0 ? Math.round(stalledLeads.reduce((s, c) => s + c.daysInStage, 0) / stalledLeads.length) : 0}d`, change: 'em etapa', positive: false },
          { label: 'Conversão', value: `${conversionRate}%`, change: 'geral', positive: conversionRate > 50 },
        ],
        recommendations: stalledLeads.map(l =>
          `${l.patientName}: ${l.treatment} (R$ ${l.value.toLocaleString('pt-BR')}) – parado há ${l.daysInStage} dias em "${l.stage.replace(/_/g, ' ')}". Ação: follow-up urgente.`
        ),
      };

    case 'top_treatments':
      return {
        title: '⭐ Tratamentos Mais Populares',
        content: `O tratamento mais procurado é **${topTreatment.name}** com ${topTreatment.popularity}% de popularidade. Tratamentos estéticos lideram em receita (38% do faturamento), seguidos por ortodontia (25%).`,
        metrics: [
          { label: 'Mais Popular', value: topTreatment.name.split(' ').slice(0, 2).join(' '), change: `${topTreatment.popularity}%`, positive: true },
          { label: 'Maior Receita', value: 'Estéticos', change: '38% do total', positive: true },
          { label: 'Crescimento', value: 'Invisalign', change: '+45% vs mês ant.', positive: true },
          { label: 'Procedimentos', value: `${treatmentTypes.length}`, change: 'cadastrados', positive: true },
        ],
        recommendations: [
          'Investir em marketing de clareamento dental (alta demanda + margem)',
          'Criar combo "Sorriso Completo" com clareamento + facetas (ticket médio +R$ 4k)',
          'Ortodontia invisível está crescendo: considerar parceria com Invisalign',
        ],
        chartData: [...treatmentTypes].sort((a, b) => b.popularity - a.popularity).slice(0, 5).map(t => ({
          label: t.name.split(' ').slice(0, 2).join(' '),
          value: t.popularity,
          color: t.category === 'Estético' ? '#ec4899' : t.category === 'Preventivo' ? '#10b981' : t.category === 'Ortodontia' ? '#8b5cf6' : t.category === 'Implantodontia' ? '#06b6d4' : '#6366f1',
        })),
      };

    case 'overdue_payments':
      return {
        title: '💸 Cenário de Inadimplência',
        content: `Atualmente há **${overdueTransactions.length}** parcela(s) vencida(s) totalizando R$ ${overdueTransactions.reduce((s, t) => s + t.value, 0).toLocaleString('pt-BR')}. A taxa de inadimplência está em 3.2%, abaixo da média do setor (5-8%).`,
        metrics: [
          { label: 'Total Vencido', value: `R$ ${overdueTransactions.reduce((s, t) => s + t.value, 0).toLocaleString('pt-BR')}`, positive: false },
          { label: 'Parcelas', value: `${overdueTransactions.length}`, change: 'vencidas', positive: false },
          { label: 'Taxa', value: '3.2%', change: 'vs 5-8% mercado', positive: true },
          { label: 'Recuperação', value: '72%', change: 'taxa esperada', positive: true },
        ],
        recommendations: [
          'Enviar cobrança amigável via WhatsApp para os inadimplentes',
          'Oferecer renegociação com desconto de 5% para pagamento à vista',
          'Implementar lembretes automáticos 3 dias antes do vencimento',
          'Considerar antecipação de recebíveis para fluxo de caixa',
        ],
      };

    case 'patient_ltv':
      return {
        title: '💎 Lifetime Value dos Pacientes',
        content: `O LTV médio é de **R$ ${avgTicket.toLocaleString('pt-BR')}** por paciente, com média de **${avgTreatmentsPerPatient}** tratamentos por paciente. Os 20% de pacientes mais rentáveis representam 65% da receita total.`,
        metrics: [
          { label: 'LTV Médio', value: `R$ ${avgTicket.toLocaleString('pt-BR')}`, positive: true },
          { label: 'Tratamentos/Pac.', value: avgTreatmentsPerPatient, change: 'média', positive: true },
          { label: 'Maior LTV', value: 'Juliana R.', change: 'R$ 22.500', positive: true },
          { label: 'CAC Estimado', value: 'R$ 380', change: 'por paciente', positive: true },
        ],
        recommendations: [
          'Focar retenção nos pacientes de alto LTV com programa de fidelidade',
          'Implementar upsell de tratamentos complementares (limpeza → clareamento)',
          'Criar programa de indicação: pacientes satisfeitos trazem 2.3 novos pacientes em média',
        ],
      };

    case 'reactivation':
      return {
        title: '🔄 Pacientes para Reativação',
        content: `Há **${inactivePatients.length}** pacientes inativos que podem ser reativados. O potencial de receita é de R$ ${((inactivePatients.length * avgTicket * 0.3) / 1000).toFixed(1)}k com uma campanha de reativação bem estruturada.`,
        metrics: [
          { label: 'Inativos', value: `${inactivePatients.length}`, change: 'pacientes', positive: false },
          { label: 'Potencial', value: `R$ ${((inactivePatients.length * avgTicket * 0.3) / 1000).toFixed(1)}k`, positive: true },
          { label: 'Taxa Reativ.', value: '35%', change: 'esperada', positive: true },
          { label: 'Com Alergias', value: `${patientsWithAllergies.length}`, change: 'atenção especial', positive: false },
        ],
        recommendations: inactivePatients.map(p =>
          `${p.name}: última visita em ${p.lastVisit}. ${p.insurance !== 'Particular' ? `Convênio: ${p.insurance}` : 'Particular'}. Tratamentos: ${p.treatmentsCount}. Ação: campanha personalizada.`
        ).concat(['Criar oferta de check-up gratuito como isca para retorno']),
      };

    case 'cost_analysis':
      return {
        title: '📈 Margem por Procedimento',
        content: `A margem líquida média é de **55%**. Tratamentos estéticos têm a maior margem (68%), enquanto cirurgias têm a menor (42%) devido ao custo de materiais. O custo operacional médio por hora é de R$ 185.`,
        metrics: [
          { label: 'Margem Média', value: '55%', change: '+3% vs trimestre', positive: true },
          { label: 'Maior Margem', value: 'Clareamento', change: '72%', positive: true },
          { label: 'Menor Margem', value: 'Cirurgia', change: '42%', positive: false },
          { label: 'Custo/Hora', value: 'R$ 185', change: 'operacional', positive: true },
        ],
        recommendations: [
          'Aumentar volume de clareamento dental (alta margem + alta demanda)',
          'Renegociar fornecedores de material cirúrgico para melhorar margem',
          'Considerar ajuste de preço em endodontia (+8% viável sem perder demanda)',
        ],
        chartData: [
          { label: 'Estético', value: 68, color: '#ec4899' },
          { label: 'Preventivo', value: 62, color: '#10b981' },
          { label: 'Ortodontia', value: 58, color: '#8b5cf6' },
          { label: 'Implante', value: 52, color: '#06b6d4' },
          { label: 'Endodontia', value: 48, color: '#f59e0b' },
          { label: 'Cirurgia', value: 42, color: '#ef4444' },
        ],
      };

    case 'no_show_analysis':
      return {
        title: '📊 Análise de Faltas',
        content: `A taxa de no-show é de **8.5%**, abaixo da média do setor (12-15%). Segundas-feiras e sextas têm maior incidência. Pacientes entre 18-25 anos são os que mais faltam. Confirmação via WhatsApp reduz faltas em 45%.`,
        metrics: [
          { label: 'Taxa No-Show', value: '8.5%', change: 'vs 12% setor', positive: true },
          { label: 'Faltas/Mês', value: '12', change: 'pacientes', positive: false },
          { label: 'Custo/Falta', value: 'R$ 450', change: 'receita perdida', positive: false },
          { label: 'Com Confirmação', value: '4.2%', change: '-51% faltas', positive: true },
        ],
        recommendations: [
          'Implementar confirmação automática WhatsApp 24h antes (reduz 45% das faltas)',
          'Cobrar taxa de no-show para reincidentes (após 2 faltas)',
          'Overbooking controlado: agendar 1 paciente extra nos horários de risco',
          'Ligar para confirmar pacientes de primeira vez (alto risco de falta)',
        ],
      };

    case 'revenue_per_chair':
      return {
        title: '🪑 Receita por Sala/Cadeira',
        content: `A Sala 1 gera maior receita (R$ 38.5k/mês) com ocupação de 85%. A Sala 2 tem a melhor margem por procedimento (R$ 2.1k/atendimento) por ser dedicada a implantes. A Sala 3 tem oportunidade de melhoria com apenas 68% de ocupação.`,
        metrics: [
          { label: 'Sala 1', value: 'R$ 38.5k', change: '85% ocupação', positive: true },
          { label: 'Sala 2', value: 'R$ 31.2k', change: '78% ocupação', positive: true },
          { label: 'Sala 3', value: 'R$ 17.7k', change: '68% ocupação', positive: false },
          { label: 'Média/Sala', value: 'R$ 29.1k', change: '/mês', positive: true },
        ],
        recommendations: [
          'Sala 3: realocar procedimentos estéticos (alta margem) para horários vagos',
          'Considerar extensão de horário da Sala 1 (alta demanda)',
          'Otimizar tempo entre consultas na Sala 2 (reduzir setup de 30 para 20 min)',
        ],
        chartData: [
          { label: 'Sala 1', value: 38500, color: '#6366f1' },
          { label: 'Sala 2', value: 31200, color: '#06b6d4' },
          { label: 'Sala 3', value: 17700, color: '#f59e0b' },
        ],
      };

    default:
      return {
        title: '🤖 Análise em Processamento',
        content: 'Não foi possível gerar esta análise no momento.',
        recommendations: ['Tente novamente mais tarde.'],
      };
  }
};

/* ────────── COMPONENT ────────── */

type QueryCategory = 'todos' | 'financeiro' | 'pacientes' | 'agenda' | 'pipeline' | 'operacional';

export default function Insights() {
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<ReturnType<typeof generateAIResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryFilter, setQueryFilter] = useState<QueryCategory>('todos');
  const [customQuery, setCustomQuery] = useState('');
  const [showResult, setShowResult] = useState(false);

  const filteredQueries = queryFilter === 'todos' ? quickQueries : quickQueries.filter(q => q.category === queryFilter);

  const handleQueryClick = useCallback((queryId: string) => {
    setSelectedQuery(queryId);
    setIsLoading(true);
    setShowResult(true);
    setAiResponse(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateAIResponse(queryId);
      setAiResponse(response);
      setIsLoading(false);
    }, 1200 + Math.random() * 800);
  }, []);

  const handleCustomQuery = () => {
    if (!customQuery.trim()) return;
    setSelectedQuery('custom');
    setIsLoading(true);
    setShowResult(true);
    setAiResponse(null);

    setTimeout(() => {
      setAiResponse({
        title: '🤖 Análise Personalizada',
        content: `Com base nos dados da clínica, para sua pergunta "${customQuery}": A Clínica Sorriso possui ${patients.length} pacientes cadastrados, com ${activePatients.length} ativos. O faturamento mensal atual é de R$ ${(currentRevenue / 1000).toFixed(0)}k com crescimento de ${revenueGrowth}%. A taxa de conversão do pipeline está em ${conversionRate}% e o ticket médio é R$ ${avgTicket.toLocaleString('pt-BR')}.`,
        metrics: [
          { label: 'Pacientes', value: `${patients.length}`, change: `${activePatients.length} ativos`, positive: true },
          { label: 'Faturamento', value: `R$ ${(currentRevenue / 1000).toFixed(0)}k`, change: `+${revenueGrowth}%`, positive: revenueGrowth > 0 },
          { label: 'Conversão', value: `${conversionRate}%`, positive: conversionRate > 50 },
          { label: 'Ticket Médio', value: `R$ ${(avgTicket / 1000).toFixed(1)}k`, positive: true },
        ],
        recommendations: [
          'Para análises mais específicas, utilize as pesquisas rápidas disponíveis',
          'Os dados são atualizados em tempo real conforme o uso do sistema',
          'Consulte o Dashboard para uma visão geral completa',
        ],
      });
      setIsLoading(false);
    }, 1500);
  };

  // Auto-load health score on mount
  const [healthScore] = useState(() => {
    let score = 50;
    if (conversionRate > 50) score += 10;
    if (revenueGrowth > 0) score += 10;
    if (overdueTransactions.length < 3) score += 10;
    if (activePatients.length > 5) score += 5;
    if (stalledLeads.length < 3) score += 5;
    if (confirmedToday >= pendingToday) score += 5;
    if (inactivePatients.length < 3) score += 5;
    return Math.min(100, score);
  });

  const healthColor = healthScore >= 80 ? 'text-emerald-500' : healthScore >= 60 ? 'text-amber-500' : 'text-red-500';
  const healthLabel = healthScore >= 80 ? 'Excelente' : healthScore >= 60 ? 'Bom' : 'Precisa Atenção';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Brain size={22} className="text-white" />
            </div>
            Insights & IA
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Análises inteligentes alimentadas pelos dados do seu sistema
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>IA ativa · Dados atualizados em tempo real</span>
        </div>
      </div>

      {/* Health Score + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Health Score Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                className={healthColor}
                stroke="currentColor"
                strokeDasharray={`${healthScore * 2.64} 264`}
                style={{ transition: 'stroke-dasharray 1.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${healthColor}`}>{healthScore}</span>
              <span className="text-[10px] text-slate-400 font-medium">de 100</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Saúde da Clínica</p>
          <p className={`text-xs font-medium ${healthColor}`}>{healthLabel}</p>
        </div>

        {/* Quick Metrics */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <DollarSign size={16} className="text-emerald-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Faturamento</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">R$ {(currentRevenue / 1000).toFixed(0)}k</p>
          <div className="flex items-center gap-1 mt-1">
            {revenueGrowth > 0 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
            <span className={`text-xs font-semibold ${revenueGrowth > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}%
            </span>
            <span className="text-xs text-slate-400">vs mês anterior</span>
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '72%' }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">72% da meta mensal</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <Target size={16} className="text-blue-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Pipeline</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">R$ {(pipelineTotal / 1000).toFixed(1)}k</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">{activeLeads.length} leads ativos</span>
            <span className="text-xs text-emerald-500 font-semibold">{conversionRate}% conv.</span>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-3">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{closedCards.length}</p>
              <p className="text-[9px] text-emerald-500">Ganhos</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{activeLeads.length}</p>
              <p className="text-[9px] text-blue-500">Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{lostCards.length}</p>
              <p className="text-[9px] text-red-500">Perdidos</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10">
              <Users size={16} className="text-violet-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Pacientes</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{patients.length}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-emerald-500 font-semibold">{activePatients.length} ativos</span>
            <span className="text-xs text-red-400">{inactivePatients.length} inativos</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                style={{ width: `${(activePatients.length / patients.length) * 100}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">{Math.round((activePatients.length / patients.length) * 100)}%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">LTV médio: R$ {avgTicket.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* AI Auto-Insights */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} />
            <h3 className="text-lg font-bold">Insights Automáticos da IA</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => handleQueryClick('churn_risk')}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-300" />
                <p className="text-sm font-semibold">Risco de Evasão</p>
              </div>
              <p className="text-2xl font-bold">{inactivePatients.length + 2}</p>
              <p className="text-xs text-white/60 mt-1">pacientes em risco · clique para ver</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => handleQueryClick('revenue_forecast')}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-emerald-300" />
                <p className="text-sm font-semibold">Previsão Receita</p>
              </div>
              <p className="text-2xl font-bold">R$ 92k</p>
              <p className="text-xs text-white/60 mt-1">próximo mês · clique para detalhes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => handleQueryClick('optimize_schedule')}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-blue-300" />
                <p className="text-sm font-semibold">Otimização Agenda</p>
              </div>
              <p className="text-2xl font-bold">4 gaps</p>
              <p className="text-xs text-white/60 mt-1">horários disponíveis · clique para ver</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => handleQueryClick('stalled_leads')}>
              <div className="flex items-center gap-2 mb-2">
                <Timer size={16} className="text-red-300" />
                <p className="text-sm font-semibold">Leads Parados</p>
              </div>
              <p className="text-2xl font-bold">{stalledLeads.length}</p>
              <p className="text-xs text-white/60 mt-1">{'>'}10 dias sem movimento · clique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Query Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10">
            <MessageSquare size={18} className="text-violet-500" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={customQuery}
              onChange={e => setCustomQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustomQuery()}
              placeholder="Pergunte qualquer coisa à IA sobre sua clínica..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={handleCustomQuery}
            disabled={!customQuery.trim()}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} />
            Perguntar
          </button>
        </div>
      </div>

      {/* Quick Queries Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pesquisas Rápidas</h2>
          </div>
          <span className="text-xs text-slate-400">{quickQueries.length} análises disponíveis</span>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { key: 'todos' as QueryCategory, label: 'Todos', icon: <Eye size={12} /> },
            { key: 'financeiro' as QueryCategory, label: 'Financeiro', icon: <DollarSign size={12} /> },
            { key: 'pacientes' as QueryCategory, label: 'Pacientes', icon: <Users size={12} /> },
            { key: 'agenda' as QueryCategory, label: 'Agenda', icon: <Calendar size={12} /> },
            { key: 'pipeline' as QueryCategory, label: 'Pipeline', icon: <Target size={12} /> },
            { key: 'operacional' as QueryCategory, label: 'Operacional', icon: <Activity size={12} /> },
          ]).map(cat => (
            <button
              key={cat.key}
              onClick={() => setQueryFilter(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                queryFilter === cat.key
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Queries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredQueries.map(query => (
            <button
              key={query.id}
              onClick={() => handleQueryClick(query.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 group hover:shadow-lg hover:scale-[1.02] ${
                selectedQuery === query.id
                  ? 'border-violet-400 dark:border-violet-500/50 bg-violet-50 dark:bg-violet-500/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${query.bg} shrink-0`}>
                  <span className={query.color}>{query.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {query.label}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${query.bg} ${query.color} uppercase`}>
                      {query.category}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-violet-500 transition-colors shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            Agenda Hoje
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Total de Consultas</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{todayAppts.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Confirmadas</span>
              <span className="text-sm font-bold text-emerald-500">{confirmedToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Pendentes</span>
              <span className="text-sm font-bold text-amber-500">{pendingToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Taxa Ocupação</span>
              <span className="text-sm font-bold text-blue-500">{Math.round((todayAppts.length / 12) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${Math.round((todayAppts.length / 12) * 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500" />
            Financeiro
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Receita Mês</span>
              <span className="text-sm font-bold text-emerald-500">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Despesas</span>
              <span className="text-sm font-bold text-red-500">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Lucro</span>
              <span className="text-sm font-bold text-blue-500">R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Margem</span>
              <span className="text-sm font-bold text-violet-500">{Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <Shield size={16} className="text-violet-500" />
            Indicadores
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Ticket Médio</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">R$ {avgTicket.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Trat./Paciente</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{avgTreatmentsPerPatient}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Com Alergias</span>
              <span className="text-sm font-bold text-amber-500">{patientsWithAllergies.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Inadimplência</span>
              <span className="text-sm font-bold text-red-500">R$ {overdueTransactions.reduce((s, t) => s + t.value, 0).toLocaleString('pt-BR')}</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ AI RESULT PANEL ══════════════ */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowResult(false); setSelectedQuery(null); }} />
          <div className="relative w-full max-w-xl h-full bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain size={20} className="text-white" />
                  <span className="text-sm font-semibold text-white/80">Análise IA</span>
                </div>
                <button
                  onClick={() => { setShowResult(false); setSelectedQuery(null); }}
                  className="p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="text-white animate-spin" />
                  <div>
                    <p className="text-lg font-bold text-white">Analisando dados...</p>
                    <p className="text-xs text-white/60">Processando informações da clínica</p>
                  </div>
                </div>
              ) : aiResponse ? (
                <div>
                  <p className="text-lg font-bold text-white">{aiResponse.title}</p>
                  <p className="text-xs text-white/60 mt-1">Gerado em tempo real com dados do sistema</p>
                </div>
              ) : null}
            </div>

            {isLoading ? (
              <div className="p-6 space-y-4">
                {/* Loading skeleton */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full w-5/6" />
                  </div>
                ))}
              </div>
            ) : aiResponse ? (
              <div className="p-6 space-y-6">
                {/* Main content */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {aiResponse.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                </div>

                {/* Metrics */}
                {aiResponse.metrics && aiResponse.metrics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <BarChart3 size={16} className="text-violet-500" />
                      Métricas Principais
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {aiResponse.metrics.map((m, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                          <p className="text-[11px] text-slate-400 font-medium uppercase mb-1">{m.label}</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{m.value}</p>
                          {m.change && (
                            <div className="flex items-center gap-1 mt-1">
                              {m.positive !== undefined && (
                                m.positive ? <TrendingUp size={10} className="text-emerald-500" /> : <TrendingDown size={10} className="text-red-500" />
                              )}
                              <span className={`text-[10px] font-medium ${m.positive ? 'text-emerald-500' : m.positive === false ? 'text-red-500' : 'text-slate-400'}`}>
                                {m.change}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chart Data */}
                {aiResponse.chartData && aiResponse.chartData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <PieChart size={16} className="text-violet-500" />
                      Visualização
                    </h3>
                    <div className="space-y-2">
                      {aiResponse.chartData.map((d, i) => {
                        const maxVal = Math.max(...aiResponse.chartData!.map(c => c.value));
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400 w-24 truncate text-right">{d.label}</span>
                            <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                              <div
                                className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                                style={{
                                  width: `${(d.value / maxVal) * 100}%`,
                                  backgroundColor: d.color,
                                }}
                              >
                                <span className="text-[10px] font-bold text-white">
                                  {typeof d.value === 'number' && d.value > 999 ? `R$ ${(d.value / 1000).toFixed(1)}k` : `${d.value}%`}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <Zap size={16} className="text-amber-500" />
                      Recomendações
                    </h3>
                    <div className="space-y-2">
                      {aiResponse.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                          <CheckCircle2 size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowResult(false); setSelectedQuery(null); }}
                    className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    Entendido
                  </button>
                  <button
                    onClick={() => {
                      if (selectedQuery) handleQueryClick(selectedQuery);
                    }}
                    className="py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Atualizar
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="text-center py-2">
                  <p className="text-[10px] text-slate-400">
                    🤖 Análise gerada automaticamente com base nos dados do sistema. As previsões são estimativas e podem variar.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
