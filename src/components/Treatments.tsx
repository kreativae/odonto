import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Stethoscope,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Edit3,
  Tag,
  X,
  Trash2,
  Copy,
  ChevronRight,
  Users,
  Calendar,
  BarChart3,
  Zap,
  Heart,
  Shield,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Hash,
  Sparkles,
} from 'lucide-react';
import { treatmentTypes as initialTreatments, patients } from '../mockData';
import type { TreatmentType } from '../types';

const categories = [
  'Todos',
  'Preventivo',
  'Restaurador',
  'Endodontia',
  'Cirurgia',
  'Implantodontia',
  'Estético',
  'Ortodontia',
  'Prótese',
];

const categoryIcons: Record<string, string> = {
  Preventivo: '🛡️',
  Restaurador: '🔧',
  Endodontia: '🦷',
  Cirurgia: '🔪',
  Implantodontia: '🔩',
  Estético: '✨',
  Ortodontia: '😁',
  Prótese: '🦿',
};

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  Preventivo: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30', gradient: 'from-emerald-500 to-teal-600' },
  Restaurador: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30', gradient: 'from-blue-500 to-indigo-600' },
  Endodontia: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/30', gradient: 'from-amber-500 to-orange-600' },
  Cirurgia: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-500/30', gradient: 'from-red-500 to-rose-600' },
  Implantodontia: { bg: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/30', gradient: 'from-cyan-500 to-blue-600' },
  Estético: { bg: 'bg-pink-50 dark:bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-500/30', gradient: 'from-pink-500 to-rose-600' },
  Ortodontia: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/30', gradient: 'from-violet-500 to-purple-600' },
  Prótese: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30', gradient: 'from-orange-500 to-amber-600' },
};

// Simulated extra data for quick view
const treatmentStats: Record<string, { performed: number; avgRating: number; returnRate: number; lastPerformed: string; complications: number; avgSessions: number }> = {
  tr1: { performed: 342, avgRating: 4.9, returnRate: 95, lastPerformed: '2024-01-15', complications: 0, avgSessions: 1 },
  tr2: { performed: 287, avgRating: 4.7, returnRate: 88, lastPerformed: '2024-01-14', complications: 2, avgSessions: 1 },
  tr3: { performed: 156, avgRating: 4.5, returnRate: 72, lastPerformed: '2024-01-13', complications: 5, avgSessions: 3 },
  tr4: { performed: 98, avgRating: 4.3, returnRate: 65, lastPerformed: '2024-01-12', complications: 3, avgSessions: 1 },
  tr5: { performed: 67, avgRating: 4.2, returnRate: 58, lastPerformed: '2024-01-11', complications: 4, avgSessions: 1 },
  tr6: { performed: 134, avgRating: 4.8, returnRate: 92, lastPerformed: '2024-01-10', complications: 1, avgSessions: 4 },
  tr7: { performed: 245, avgRating: 4.9, returnRate: 90, lastPerformed: '2024-01-09', complications: 0, avgSessions: 2 },
  tr8: { performed: 178, avgRating: 4.8, returnRate: 85, lastPerformed: '2024-01-08', complications: 1, avgSessions: 3 },
  tr9: { performed: 89, avgRating: 4.6, returnRate: 80, lastPerformed: '2024-01-07', complications: 2, avgSessions: 24 },
  tr10: { performed: 45, avgRating: 4.7, returnRate: 78, lastPerformed: '2024-01-06', complications: 0, avgSessions: 18 },
  tr11: { performed: 56, avgRating: 4.4, returnRate: 70, lastPerformed: '2024-01-05', complications: 3, avgSessions: 5 },
  tr12: { performed: 112, avgRating: 4.6, returnRate: 82, lastPerformed: '2024-01-04', complications: 2, avgSessions: 3 },
};

const procedureSteps: Record<string, string[]> = {
  tr1: ['Avaliação inicial', 'Raspagem supragengival', 'Raspagem subgengival', 'Polimento', 'Aplicação de flúor'],
  tr2: ['Anestesia local', 'Remoção de cárie', 'Preparo cavitário', 'Aplicação de adesivo', 'Inserção de resina', 'Fotopolimerização', 'Acabamento e polimento'],
  tr3: ['Raio-X periapical', 'Anestesia', 'Abertura coronária', 'Instrumentação', 'Irrigação', 'Curativo de demora', 'Obturação do canal', 'Restauração provisória'],
  tr4: ['Raio-X', 'Anestesia', 'Sindesmotomia', 'Luxação', 'Avulsão', 'Curetagem alveolar', 'Hemostasia', 'Orientações pós-operatórias'],
  tr5: ['Raio-X panorâmica', 'Anestesia troncular', 'Incisão', 'Osteotomia', 'Luxação e avulsão', 'Curetagem', 'Sutura', 'Prescrição medicamentosa'],
  tr6: ['Planejamento 3D', 'Anestesia', 'Incisão e retalho', 'Perfuração óssea guiada', 'Instalação do implante', 'Sutura', 'Cicatrização (3-6 meses)', 'Moldagem', 'Instalação da coroa'],
  tr7: ['Profilaxia prévia', 'Moldagem para moldeira', 'Aplicação do gel clareador', 'Ativação com LED/laser', '3 sessões de 15 min', 'Dessensibilização', 'Orientações de manutenção'],
  tr8: ['Planejamento digital (DSD)', 'Mock-up', 'Preparo dental', 'Moldagem', 'Provisórios', 'Prova da cerâmica', 'Cimentação adesiva', 'Ajuste oclusal'],
  tr9: ['Documentação ortodôntica', 'Moldagem', 'Planejamento do caso', 'Colagem de braquetes', 'Inserção de arco', 'Ativações mensais', 'Contenção final'],
  tr10: ['Escaneamento 3D', 'Planejamento digital', 'Confecção dos alinhadores', 'Colagem de attachments', 'Troca quinzenal', 'Refinamento', 'Contenção'],
  tr11: ['Moldagem anatômica', 'Moldagem funcional', 'Plano de cera', 'Prova dos dentes', 'Acrilização', 'Instalação', 'Ajustes'],
  tr12: ['Preparo do dente', 'Moldagem', 'Provisório', 'Prova da infraestrutura', 'Prova da cerâmica', 'Cimentação', 'Ajuste oclusal'],
};

const relatedPatients: Record<string, string[]> = {
  tr1: ['Maria Silva Santos', 'João Pedro Oliveira', 'Roberto Almeida Neto'],
  tr2: ['Ana Carolina Ferreira', 'Lucas Barbosa Dias'],
  tr3: ['Ana Carolina Ferreira', 'Roberto Almeida Neto'],
  tr4: ['Lucas Barbosa Dias'],
  tr5: ['Lucas Barbosa Dias'],
  tr6: ['Carlos Eduardo Lima'],
  tr7: ['Patricia Mendes Rocha'],
  tr8: ['Marcos Vinícius Gomes'],
  tr9: ['João Pedro Oliveira'],
  tr10: [],
  tr11: ['Juliana Ribeiro Santos'],
  tr12: ['Juliana Ribeiro Santos'],
};

export default function Treatments() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [treatments, setTreatments] = useState<TreatmentType[]>([...initialTreatments]);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TreatmentType | null>(null);

  // Simulator state
  const [simValue, setSimValue] = useState(8500);
  const [simParcelas, setSimParcelas] = useState(6);

  const filtered = useMemo(() =>
    treatments.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
      return matchSearch && matchCategory;
    }), [treatments, search, selectedCategory]);

  const avgPrice = treatments.reduce((sum, t) => sum + t.price, 0) / treatments.length;
  const totalPerformed = Object.values(treatmentStats).reduce((s, ts) => s + ts.performed, 0);

  // Edit Modal
  const openEditModal = (treatment: TreatmentType | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (treatment) {
      setEditingTreatment({ ...treatment });
    } else {
      setEditingTreatment({
        id: `tr${Date.now()}`,
        name: '',
        category: 'Preventivo',
        price: 0,
        duration: 30,
        description: '',
        popularity: 50,
      });
    }
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editingTreatment || !editingTreatment.name.trim()) return;
    const exists = treatments.find((t) => t.id === editingTreatment.id);
    if (exists) {
      setTreatments(treatments.map((t) => (t.id === editingTreatment.id ? editingTreatment : t)));
      if (selectedTreatment?.id === editingTreatment.id) {
        setSelectedTreatment(editingTreatment);
      }
    } else {
      setTreatments([...treatments, editingTreatment]);
    }
    setShowEditModal(false);
    setEditingTreatment(null);
  };

  const deleteTreatment = (id: string) => {
    setTreatments(treatments.filter((t) => t.id !== id));
    if (selectedTreatment?.id === id) setSelectedTreatment(null);
    setShowEditModal(false);
    setEditingTreatment(null);
  };

  const getCatColor = (cat: string) => categoryColors[cat] || categoryColors['Preventivo'];

  const stats = selectedTreatment ? treatmentStats[selectedTreatment.id] || { performed: 0, avgRating: 0, returnRate: 0, lastPerformed: '-', complications: 0, avgSessions: 1 } : null;
  const steps = selectedTreatment ? procedureSteps[selectedTreatment.id] || [] : [];
  const related = selectedTreatment ? relatedPatients[selectedTreatment.id] || [] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tratamentos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gerencie procedimentos, tabela de preços e planos de tratamento
          </p>
        </div>
        <button
          onClick={() => openEditModal(null)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25"
        >
          <Plus size={18} />
          Novo Procedimento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-500/10">
              <Stethoscope size={18} className="text-primary-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Procedimentos Cadastrados</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{treatments.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <DollarSign size={18} className="text-emerald-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Ticket Médio</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ {avgPrice.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <TrendingUp size={18} className="text-violet-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Total Realizados</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalPerformed.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar procedimento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat !== 'Todos' && <span className="mr-1">{categoryIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Treatments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((treatment) => {
          const catColor = getCatColor(treatment.category);
          const tStats = treatmentStats[treatment.id];
          return (
            <div
              key={treatment.id}
              onClick={() => setSelectedTreatment(treatment)}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all duration-300 group cursor-pointer ${
                selectedTreatment?.id === treatment.id
                  ? `${catColor.border} shadow-lg ring-2 ring-primary-500/30`
                  : 'border-slate-200 dark:border-slate-700/50 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[treatment.category] || '🦷'}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${catColor.bg} ${catColor.text}`}>
                    {treatment.category}
                  </span>
                </div>
                <button
                  onClick={(e) => openEditModal(treatment, e)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                >
                  <Edit3 size={14} className="text-slate-400" />
                </button>
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {treatment.name}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 line-clamp-2">{treatment.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <DollarSign size={14} />
                    <span className="text-sm font-bold">R$ {treatment.price.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{treatment.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tStats && (
                    <span className="text-[10px] text-slate-400 font-medium">{tStats.performed}x</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-500 font-medium">{treatment.popularity}%</span>
                  </div>
                </div>
              </div>

              {/* Popularity Bar */}
              <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${catColor.gradient} transition-all duration-700`}
                  style={{ width: `${treatment.popularity}%` }}
                />
              </div>

              {/* Quick View Indicator */}
              <div className="mt-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-primary-500 font-medium flex items-center gap-1">
                  Clique para detalhes <ChevronRight size={10} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Stethoscope size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Nenhum procedimento encontrado</p>
        </div>
      )}

      {/* Simulation Section */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-dental-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-lg font-bold mb-2">💰 Simulador de Parcelamento</h3>
          <p className="text-sm text-white/70 mb-4">Simule o parcelamento de tratamentos para seus pacientes</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/70 mb-1">Valor Total</label>
              <input
                type="number"
                value={simValue}
                onChange={(e) => setSimValue(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:ring-2 focus:ring-white/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Parcelas</label>
              <select
                value={simParcelas}
                onChange={(e) => setSimParcelas(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-white/50 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                  <option key={n} value={n} className="text-slate-900">
                    {n}x
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Valor da Parcela</label>
              <div className="px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-bold">
                R$ {(simValue / simParcelas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================== QUICK VIEW PANEL =================== */}
      {selectedTreatment && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setSelectedTreatment(null)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto animate-slide-in-right border-l border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className={`bg-gradient-to-r ${getCatColor(selectedTreatment.category).gradient} p-6 relative`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{categoryIcons[selectedTreatment.category] || '🦷'}</span>
                  <button
                    onClick={() => setSelectedTreatment(null)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{selectedTreatment.name}</h2>
                <p className="text-sm text-white/70">{selectedTreatment.description}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Tag size={12} className="text-white" />
                  <span className="text-xs font-semibold text-white">{selectedTreatment.category}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Price & Duration Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center">
                  <DollarSign size={20} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    R$ {selectedTreatment.price.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-[10px] text-emerald-500 font-medium mt-1">VALOR DO PROCEDIMENTO</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 text-center">
                  <Clock size={20} className="text-blue-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                    {selectedTreatment.duration} min
                  </p>
                  <p className="text-[10px] text-blue-500 font-medium mt-1">DURAÇÃO ESTIMADA</p>
                </div>
              </div>

              {/* Stats Grid */}
              {stats && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <BarChart3 size={16} className="text-primary-500" />
                    Estatísticas
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.performed}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Realizados</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.avgRating}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Avaliação</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.returnRate}%</p>
                      <p className="text-[10px] text-slate-400 font-medium">Retorno</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.avgSessions}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Sessões</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <p className={`text-lg font-bold ${stats.complications === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {stats.complications}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Complicações</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-primary-500">{selectedTreatment.popularity}%</p>
                      <p className="text-[10px] text-slate-400 font-medium">Popularidade</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Popularity Gauge */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary-500" />
                  Popularidade
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Demanda</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedTreatment.popularity}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getCatColor(selectedTreatment.category).gradient} transition-all duration-1000`}
                      style={{ width: `${selectedTreatment.popularity}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>Baixa</span>
                    <span>Moderada</span>
                    <span>Alta</span>
                  </div>
                </div>
              </div>

              {/* Pricing Tiers */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-500" />
                  Simulação de Parcelamento
                </h3>
                <div className="space-y-2">
                  {[1, 3, 6, 10, 12].map((parcelas) => (
                    <div
                      key={parcelas}
                      className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Hash size={12} className="text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{parcelas}x</span>
                        {parcelas === 1 && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
                            À vista
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        R$ {(selectedTreatment.price / parcelas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-[10px] text-slate-400 font-normal">/mês</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedure Steps */}
              {steps.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-violet-500" />
                    Etapas do Procedimento
                  </h3>
                  <div className="space-y-0">
                    {steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        {/* Line */}
                        {i < steps.length - 1 && (
                          <div className="absolute left-[13px] top-[26px] w-[2px] h-[calc(100%)] bg-slate-200 dark:bg-slate-700" />
                        )}
                        {/* Dot */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold ${
                          i === 0 ? 'bg-primary-500 text-white' : i === steps.length - 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="py-1.5 pb-4">
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Patients */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-cyan-500" />
                    Pacientes com este Tratamento ({related.length})
                  </h3>
                  <div className="space-y-2">
                    {related.map((name, i) => {
                      const patient = patients.find((p) => p.name === name);
                      return (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{name}</p>
                            {patient && (
                              <p className="text-[10px] text-slate-400">{patient.insurance} • {patient.phone}</p>
                            )}
                          </div>
                          <ChevronRight size={14} className="text-slate-300" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Insight */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 rounded-xl p-4 border border-violet-100 dark:border-violet-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-violet-500" />
                  <span className="text-xs font-bold text-violet-700 dark:text-violet-400">INSIGHT IA</span>
                </div>
                <p className="text-xs text-violet-600 dark:text-violet-300 leading-relaxed">
                  {selectedTreatment.popularity >= 80
                    ? `${selectedTreatment.name} tem alta demanda (${selectedTreatment.popularity}%). Considere expandir a capacidade de atendimento e criar pacotes promocionais para fidelização.`
                    : selectedTreatment.popularity >= 60
                    ? `${selectedTreatment.name} tem demanda moderada. Campanhas de marketing direcionadas podem aumentar a conversão em 20-30%.`
                    : `${selectedTreatment.name} tem baixa procura. Avalie reposicionar o preço ou criar combos com procedimentos populares para aumentar a demanda.`}
                </p>
              </div>

              {/* Key Indicators */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Award size={16} className="text-amber-500" />
                  Indicadores
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                    <Heart size={14} className="text-pink-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">Satisfação do paciente</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {stats ? `${stats.avgRating}/5.0` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                    <Shield size={14} className="text-emerald-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">Segurança</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {stats && stats.complications === 0 ? (
                        <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={12} /> Excelente</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-500"><AlertTriangle size={12} /> Atenção</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                    <Zap size={14} className="text-amber-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">Receita estimada/mês</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      R$ {stats ? ((stats.performed / 12) * selectedTreatment.price).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '0'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                    <Calendar size={14} className="text-blue-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">Último realizado</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {stats?.lastPerformed ? new Date(stats.lastPerformed + 'T12:00:00').toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => openEditModal(selectedTreatment)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary-600/25 hover:scale-[1.02]"
                >
                  <Edit3 size={16} />
                  Editar Serviço
                </button>
                <button
                  onClick={() => {
                    const text = `${selectedTreatment.name}\nCategoria: ${selectedTreatment.category}\nValor: R$ ${selectedTreatment.price.toLocaleString('pt-BR')}\nDuração: ${selectedTreatment.duration} min`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700 hover:scale-[1.02]"
                >
                  <Copy size={16} />
                  Copiar Info
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteTreatment(selectedTreatment.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
              >
                <Trash2 size={14} />
                Excluir Procedimento
              </button>
            </div>
          </div>
        </>
      )}

      {/* =================== EDIT MODAL =================== */}
      {showEditModal && editingTreatment && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => { setShowEditModal(false); setEditingTreatment(null); }}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 animate-fade-in">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${getCatColor(editingTreatment.category).gradient}`}>
                    <Stethoscope size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {treatments.find((t) => t.id === editingTreatment.id) ? 'Editar Procedimento' : 'Novo Procedimento'}
                    </h2>
                    <p className="text-xs text-slate-400">Preencha os dados do procedimento</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowEditModal(false); setEditingTreatment(null); }}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Nome do Procedimento *
                  </label>
                  <input
                    type="text"
                    value={editingTreatment.name}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, name: e.target.value })}
                    placeholder="Ex: Limpeza e Profilaxia"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Categoria
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.filter((c) => c !== 'Todos').map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setEditingTreatment({ ...editingTreatment, category: cat })}
                        className={`px-2 py-2 rounded-xl text-[10px] font-semibold text-center transition-all ${
                          editingTreatment.category === cat
                            ? `${getCatColor(cat).bg} ${getCatColor(cat).text} ring-2 ring-primary-500/30 scale-105`
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="block text-lg mb-0.5">{categoryIcons[cat]}</span>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Descrição
                  </label>
                  <textarea
                    value={editingTreatment.description}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, description: e.target.value })}
                    placeholder="Descrição do procedimento..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                      Valor (R$)
                    </label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={editingTreatment.price}
                        onChange={(e) => setEditingTreatment({ ...editingTreatment, price: Number(e.target.value) })}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                      Duração (min)
                    </label>
                    <div className="relative">
                      <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={editingTreatment.duration}
                        onChange={(e) => setEditingTreatment({ ...editingTreatment, duration: Number(e.target.value) })}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Popularity Slider */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Popularidade: {editingTreatment.popularity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingTreatment.popularity}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, popularity: Number(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-primary-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Preview Card */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Pré-visualização
                  </label>
                  <div className={`rounded-xl p-4 border ${getCatColor(editingTreatment.category).border} ${getCatColor(editingTreatment.category).bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{categoryIcons[editingTreatment.category] || '🦷'}</span>
                      <span className={`text-[10px] font-bold uppercase ${getCatColor(editingTreatment.category).text}`}>
                        {editingTreatment.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      {editingTreatment.name || 'Nome do procedimento'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {editingTreatment.description || 'Descrição do procedimento'}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        R$ {editingTreatment.price.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-slate-400">{editingTreatment.duration} min</span>
                      <span className="text-slate-400">Pop: {editingTreatment.popularity}%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/50 dark:bg-slate-600/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getCatColor(editingTreatment.category).gradient} transition-all duration-300`}
                        style={{ width: `${editingTreatment.popularity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={saveEdit}
                  disabled={!editingTreatment.name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary-600/25 hover:scale-[1.02] disabled:hover:scale-100 disabled:shadow-none"
                >
                  <CheckCircle2 size={16} />
                  {treatments.find((t) => t.id === editingTreatment.id) ? 'Salvar Alterações' : 'Criar Procedimento'}
                </button>
                {treatments.find((t) => t.id === editingTreatment.id) && (
                  <button
                    onClick={() => deleteTreatment(editingTreatment.id)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => { setShowEditModal(false); setEditingTreatment(null); }}
                  className="px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
