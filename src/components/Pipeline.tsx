import { useState, useCallback, type DragEvent } from 'react';
import {
  Phone,
  DollarSign,
  Clock,
  User,
  TrendingUp,
  Plus,
  MoreVertical,
  GripVertical,
  X,
  Edit3,
  Trash2,
  Send,
  Copy,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Mail,
  Stethoscope,
  Target,
  Timer,
  BarChart3,
  CheckCircle2,
  XCircle,
  Save,
  History,
  Sparkles,
} from 'lucide-react';
import { pipelineCards as initialCards, pipelineStages, professionals } from '../mockData';
import type { PipelineCard } from '../types';

/* ── helpers ── */

const stageIndex = (stageId: string) => pipelineStages.findIndex(s => s.id === stageId);
const stageColor = (stageId: string) => pipelineStages.find(s => s.id === stageId)?.color || '#94a3b8';
const stageName = (stageId: string) => pipelineStages.find(s => s.id === stageId)?.name || stageId;

const fakeTimeline = (card: PipelineCard) => {
  const idx = stageIndex(card.stage);
  const entries = [];
  for (let i = 0; i <= idx && i < pipelineStages.length; i++) {
    const stage = pipelineStages[i];
    const daysAgo = (idx - i) * 3 + (i === idx ? card.daysInStage : 0);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    entries.push({
      stage: stage.name,
      stageId: stage.id,
      color: stage.color,
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      isCurrent: i === idx,
    });
  }
  return entries;
};

export default function Pipeline() {
  const [cards, setCards] = useState<PipelineCard[]>(initialCards);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // quick view
  const [quickViewCard, setQuickViewCard] = useState<PipelineCard | null>(null);
  // edit modal
  const [editCard, setEditCard] = useState<PipelineCard | null>(null);

  /* ── drag handlers ── */

  const handleDragStart = (e: DragEvent<HTMLDivElement>, cardId: string) => {
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cardId);
    const el = e.currentTarget;
    setTimeout(() => el.classList.add('opacity-30', 'scale-95'), 0);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-30', 'scale-95');
    setDraggedCard(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, stageId: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const cardId = e.dataTransfer.getData('text/plain') || draggedCard;
    if (cardId) {
      moveCardToStage(cardId, stageId);
    }
    setDraggedCard(null);
  };

  /* ── card operations ── */

  const moveCardToStage = useCallback((cardId: string, stageId: string) => {
    setCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, stage: stageId, daysInStage: 0 } : c)
    );
    // update quick view if open
    setQuickViewCard(prev => {
      if (prev && prev.id === cardId) {
        return { ...prev, stage: stageId, daysInStage: 0 };
      }
      return prev;
    });
  }, []);

  const moveCardForward = useCallback((cardId: string) => {
    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card) return prev;
      const idx = stageIndex(card.stage);
      if (idx < pipelineStages.length - 1) {
        const nextStage = pipelineStages[idx + 1].id;
        const updated = prev.map(c => c.id === cardId ? { ...c, stage: nextStage, daysInStage: 0 } : c);
        setQuickViewCard(qv => qv && qv.id === cardId ? { ...qv, stage: nextStage, daysInStage: 0 } : qv);
        return updated;
      }
      return prev;
    });
  }, []);

  const moveCardBackward = useCallback((cardId: string) => {
    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card) return prev;
      const idx = stageIndex(card.stage);
      if (idx > 0) {
        const prevStage = pipelineStages[idx - 1].id;
        const updated = prev.map(c => c.id === cardId ? { ...c, stage: prevStage, daysInStage: 0 } : c);
        setQuickViewCard(qv => qv && qv.id === cardId ? { ...qv, stage: prevStage, daysInStage: 0 } : qv);
        return updated;
      }
      return prev;
    });
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    setQuickViewCard(prev => prev && prev.id === cardId ? null : prev);
    setEditCard(prev => prev && prev.id === cardId ? null : prev);
  }, []);

  const handleSaveEdit = () => {
    if (!editCard) return;
    setCards(prev => prev.map(c => c.id === editCard.id ? editCard : c));
    setQuickViewCard(prev => prev && prev.id === editCard.id ? editCard : prev);
    setEditCard(null);
  };

  const handleQuickView = (card: PipelineCard) => {
    setQuickViewCard(card);
  };

  const handleOpenEdit = (card: PipelineCard) => {
    setEditCard({ ...card });
    setQuickViewCard(null);
  };

  /* ── computed ── */

  const getStageCards = (stageId: string) => cards.filter(c => c.stage === stageId);
  const getStageValue = (stageId: string) =>
    getStageCards(stageId).reduce((sum, c) => sum + c.value, 0);

  const totalPipeline = cards.reduce((sum, c) => sum + c.value, 0);
  const totalClosed = cards.filter(c => c.stage === 'fechado').reduce((sum, c) => sum + c.value, 0);
  const conversionRate = cards.length > 0 ? Math.round((cards.filter(c => c.stage === 'fechado').length / cards.length) * 100) : 0;
  const avgTicket = cards.length > 0 ? Math.round(totalPipeline / cards.length) : 0;

  /* ────────── RENDER ────────── */

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pipeline Comercial</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gerencie seus leads e oportunidades de tratamento
          </p>
        </div>
        <button
          onClick={() => setEditCard({
            id: `new-${Date.now()}`,
            patientName: '',
            treatment: '',
            value: 0,
            stage: 'lead_novo',
            professionalName: professionals[0].name,
            createdAt: new Date().toISOString().split('T')[0],
            phone: '',
            daysInStage: 0,
          })}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25"
        >
          <Plus size={18} />
          Novo Lead
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-500/10">
              <DollarSign size={16} className="text-primary-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Total Pipeline</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">R$ {(totalPipeline / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Fechados</span>
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">R$ {(totalClosed / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <User size={16} className="text-blue-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Ticket Médio</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">R$ {(avgTicket / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <TrendingUp size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Conversão</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{conversionRate}%</p>
        </div>
      </div>

      {/* Kanban hint */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <GripVertical size={14} />
        <span>Arraste os cards entre as etapas ou clique para ver detalhes</span>
      </div>

      {/* ══════════════ KANBAN BOARD ══════════════ */}
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex gap-4 min-w-max">
          {pipelineStages.map((stage) => {
            const stageCards = getStageCards(stage.id);
            const stageValue = getStageValue(stage.id);
            const isDragOver = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`w-72 shrink-0 rounded-2xl transition-all duration-200 ${
                  isDragOver
                    ? 'bg-primary-50 dark:bg-primary-500/5 ring-2 ring-primary-400 ring-dashed'
                    : 'bg-slate-50 dark:bg-slate-800/50'
                }`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Stage Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{stage.name}</h3>
                      <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-medium">
                        {stageCards.length}
                      </span>
                    </div>
                    <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <MoreVertical size={14} className="text-slate-400" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    R$ {stageValue.toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[100px]">
                  {isDragOver && stageCards.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed border-primary-400/50 flex items-center justify-center">
                      <span className="text-xs text-primary-400 font-medium">Soltar aqui</span>
                    </div>
                  )}

                  {stageCards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleQuickView(card)}
                      className={`kanban-card bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-500/30 transition-all duration-200 group cursor-pointer ${
                        draggedCard === card.id ? 'opacity-30 scale-95' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical size={14} className="text-slate-300 dark:text-slate-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {card.patientName}
                          </p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); handleOpenEdit(card); }}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        >
                          <Edit3 size={12} className="text-slate-400" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 ml-6">{card.treatment}</p>

                      <div className="flex items-center justify-between ml-6">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          R$ {card.value.toLocaleString('pt-BR')}
                        </span>
                        <div className="flex items-center gap-2">
                          {card.daysInStage > 0 && (
                            <span className={`flex items-center gap-1 text-[10px] ${card.daysInStage > 10 ? 'text-red-400' : card.daysInStage > 5 ? 'text-amber-400' : 'text-slate-400'}`}>
                              <Clock size={10} />
                              {card.daysInStage}d
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 ml-6">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <User size={11} />
                          <span className="truncate">{card.professionalName.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); }}
                          className="flex items-center gap-1 text-[11px] text-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <Phone size={11} />
                          <span>Contato</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageCards.length === 0 && !isDragOver && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-600">
                      <p className="text-xs">Nenhum lead</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════ QUICK VIEW PANEL ══════════════ */}
      {quickViewCard && (() => {
        const currentStageIdx = stageIndex(quickViewCard.stage);
        const currentStage = pipelineStages[currentStageIdx];
        const canMoveForward = currentStageIdx < pipelineStages.length - 1;
        const canMoveBackward = currentStageIdx > 0;
        const nextStage = canMoveForward ? pipelineStages[currentStageIdx + 1] : null;
        const prevStage = canMoveBackward ? pipelineStages[currentStageIdx - 1] : null;
        const timeline = fakeTimeline(quickViewCard);
        const isWon = quickViewCard.stage === 'fechado';
        const isLost = quickViewCard.stage === 'perdido';

        // funnel progress
        const activeStages = pipelineStages.filter(s => s.id !== 'perdido');
        const progressIdx = activeStages.findIndex(s => s.id === quickViewCard.stage);
        const progressPct = isLost ? 0 : isWon ? 100 : Math.round(((progressIdx + 1) / activeStages.length) * 100);

        return (
          <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setQuickViewCard(null)} />
            <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
              {/* Header band */}
              <div className="relative h-32 flex items-end p-5" style={{ backgroundColor: currentStage?.color || '#6366f1' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={() => setQuickViewCard(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="relative text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={14} className="opacity-80" />
                    <p className="text-xs font-medium opacity-80">Pipeline – Quick View</p>
                  </div>
                  <h2 className="text-xl font-bold">{quickViewCard.patientName}</h2>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Stage Badge + Value */}
                <div className="flex items-center justify-between">
                  <div
                    className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-xl"
                    style={{
                      backgroundColor: (currentStage?.color || '#6366f1') + '18',
                      color: currentStage?.color || '#6366f1',
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStage?.color }} />
                    {currentStage?.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(quickViewCard)}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Editar"
                    >
                      <Edit3 size={16} className="text-slate-500" />
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`${quickViewCard.patientName} - ${quickViewCard.treatment} - R$ ${quickViewCard.value.toLocaleString('pt-BR')}`); }}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Copiar informações"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                    <button
                      onClick={() => deleteCard(quickViewCard.id)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Excluir lead"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Valor destaque */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200/50 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600/70 dark:text-emerald-400/70 mb-1">
                    <DollarSign size={14} />
                    <span className="text-[11px] font-semibold uppercase">Valor Estimado</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    R$ {quickViewCard.value.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-emerald-600/60 dark:text-emerald-400/60 mt-1">
                    Parcelado: 6x de R$ {(quickViewCard.value / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Stethoscope size={14} />
                      <span className="text-[11px] font-medium uppercase">Tratamento</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{quickViewCard.treatment}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <User size={14} />
                      <span className="text-[11px] font-medium uppercase">Profissional</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{quickViewCard.professionalName}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Phone size={14} />
                      <span className="text-[11px] font-medium uppercase">Telefone</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{quickViewCard.phone}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <CalendarDays size={14} />
                      <span className="text-[11px] font-medium uppercase">Criado em</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {new Date(quickViewCard.createdAt + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Time in Stage */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <div className={`p-2 rounded-lg ${quickViewCard.daysInStage > 10 ? 'bg-red-50 dark:bg-red-500/10' : quickViewCard.daysInStage > 5 ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-slate-50 dark:bg-slate-700/30'}`}>
                    <Timer size={16} className={quickViewCard.daysInStage > 10 ? 'text-red-500' : quickViewCard.daysInStage > 5 ? 'text-amber-500' : 'text-slate-400'} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {quickViewCard.daysInStage > 0 ? `${quickViewCard.daysInStage} dias` : 'Recém movido'}
                    </p>
                    <p className="text-xs text-slate-400">nesta etapa</p>
                  </div>
                  {quickViewCard.daysInStage > 10 && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full pulse-soft">
                      ⚠ Atenção
                    </span>
                  )}
                </div>

                {/* Funnel Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Progresso no Funil</span>
                    </div>
                    <span className="text-xs font-bold text-primary-500">{progressPct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isLost ? 'bg-red-500' : isWon ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary-500 to-dental-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  {/* Stage dots */}
                  <div className="flex items-center justify-between mt-2 px-1">
                    {activeStages.map((s, i) => {
                      const isCompleted = !isLost && (isWon || i <= progressIdx);
                      const isCurrent = s.id === quickViewCard.stage;
                      return (
                        <div key={s.id} className="flex flex-col items-center gap-1" title={s.name}>
                          <div
                            className={`w-3 h-3 rounded-full border-2 transition-all ${
                              isCurrent
                                ? 'scale-125 border-primary-500 bg-primary-500'
                                : isCompleted
                                ? 'border-emerald-400 bg-emerald-400'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                            }`}
                            style={isCurrent ? { borderColor: s.color, backgroundColor: s.color } : undefined}
                          />
                          <span className={`text-[9px] font-medium ${isCurrent ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                            {s.name.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <History size={14} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Histórico de Etapas</span>
                  </div>
                  <div className="relative pl-6 space-y-0">
                    {/* vertical line */}
                    <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-slate-200 dark:bg-slate-700" />
                    {timeline.map((entry, i) => (
                      <div key={i} className="relative flex items-center gap-3 py-2">
                        <div
                          className={`absolute left-[-15px] w-3 h-3 rounded-full border-2 ${
                            entry.isCurrent ? 'scale-125' : ''
                          }`}
                          style={{
                            borderColor: entry.color,
                            backgroundColor: entry.isCurrent ? entry.color : 'white',
                          }}
                        />
                        <div className="flex items-center justify-between flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${entry.isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                              {entry.stage}
                            </span>
                            {entry.isCurrent && (
                              <span className="text-[9px] font-bold bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded-full">
                                ATUAL
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{entry.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stage Navigation */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Mover Etapa</p>

                  {/* Forward/Backward buttons */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => canMoveBackward && moveCardBackward(quickViewCard.id)}
                      disabled={!canMoveBackward}
                      className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        canMoveBackward
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <ArrowLeft size={14} />
                      {prevStage ? prevStage.name.split(' ')[0] : 'Início'}
                    </button>
                    <button
                      onClick={() => canMoveForward && moveCardForward(quickViewCard.id)}
                      disabled={!canMoveForward}
                      className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        canMoveForward
                          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {nextStage ? nextStage.name.split(' ')[0] : 'Fim'}
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* All stages grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {pipelineStages.map((s) => {
                      const isActive = quickViewCard.stage === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => !isActive && moveCardToStage(quickViewCard.id, s.id)}
                          className={`flex items-center gap-1.5 p-2 rounded-lg text-[11px] font-medium transition-all ${
                            isActive
                              ? 'ring-2 ring-offset-1 dark:ring-offset-slate-800'
                              : 'bg-slate-50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          style={
                            isActive
                              ? {
                                  backgroundColor: s.color + '18',
                                  color: s.color,
                                  borderColor: s.color,
                                  // @ts-expect-error ring color
                                  '--tw-ring-color': s.color,
                                }
                              : undefined
                          }
                        >
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="truncate">{s.name.replace(' ✓', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Win/Lose */}
                {!isWon && !isLost && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveCardToStage(quickViewCard.id, 'fechado')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors text-sm font-semibold"
                    >
                      <CheckCircle2 size={16} />
                      Marcar como Ganho
                    </button>
                    <button
                      onClick={() => moveCardToStage(quickViewCard.id, 'perdido')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm font-semibold"
                    >
                      <XCircle size={16} />
                      Marcar como Perdido
                    </button>
                  </div>
                )}

                {isWon && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center">
                    <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Negócio Fechado! 🎉</p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                      Valor: R$ {quickViewCard.value.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}

                {isLost && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-center">
                    <XCircle size={24} className="mx-auto text-red-500 mb-2" />
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">Lead Perdido</p>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                      Considere reativar no futuro
                    </p>
                  </div>
                )}

                {/* AI Suggestion */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-primary-50 dark:from-violet-500/10 dark:to-primary-500/10 border border-violet-200/50 dark:border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-violet-500" />
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">Sugestão da IA</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {quickViewCard.daysInStage > 10
                      ? `Lead parado há ${quickViewCard.daysInStage} dias. Recomendação: enviar mensagem de follow-up com condição especial de pagamento.`
                      : quickViewCard.stage === 'orcamento_enviado'
                      ? 'Orçamento enviado. Recomendação: agendar follow-up em 48h para esclarecer dúvidas e facilitar a decisão.'
                      : quickViewCard.stage === 'negociacao'
                      ? 'Em negociação. Ofereça parcelamento estendido ou bônus (ex: limpeza cortesia) para acelerar o fechamento.'
                      : 'Lead em progresso normal. Mantenha o acompanhamento e avance para a próxima etapa quando possível.'
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleOpenEdit(quickViewCard)}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    Editar Lead
                  </button>
                  <button className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                    <Send size={16} />
                    WhatsApp
                  </button>
                </div>

                {/* Secondary actions */}
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Phone size={16} className="text-slate-500" />
                    <span className="text-[10px] font-medium text-slate-500">Ligar</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Mail size={16} className="text-slate-500" />
                    <span className="text-[10px] font-medium text-slate-500">Email</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MessageSquare size={16} className="text-slate-500" />
                    <span className="text-[10px] font-medium text-slate-500">Nota</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════ EDIT MODAL ══════════════ */}
      {editCard && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditCard(null)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-500/10">
                  <Target size={20} className="text-primary-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editCard.id.startsWith('new-') ? 'Novo Lead' : 'Editar Lead'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editCard.id.startsWith('new-') ? 'Adicionar ao pipeline' : `ID: ${editCard.id}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditCard(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Paciente</label>
                <input
                  type="text"
                  value={editCard.patientName}
                  onChange={e => setEditCard({ ...editCard, patientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Nome completo"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
                <input
                  type="text"
                  value={editCard.phone}
                  onChange={e => setEditCard({ ...editCard, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* Treatment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tratamento</label>
                <input
                  type="text"
                  value={editCard.treatment}
                  onChange={e => setEditCard({ ...editCard, treatment: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Tipo de tratamento"
                />
              </div>

              {/* Value & Professional */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    value={editCard.value}
                    onChange={e => setEditCard({ ...editCard, value: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profissional</label>
                  <select
                    value={editCard.professionalName}
                    onChange={e => setEditCard({ ...editCard, professionalName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {professionals.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Etapa</label>
                <select
                  value={editCard.stage}
                  onChange={e => setEditCard({ ...editCard, stage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: stageColor(editCard.stage) }} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {editCard.patientName || 'Nome não preenchido'}
                    </p>
                    <p className="text-xs text-slate-500">{editCard.treatment || 'Sem tratamento'}</p>
                    <p className="text-xs text-emerald-500 font-bold">
                      R$ {editCard.value.toLocaleString('pt-BR')} · {stageName(editCard.stage)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                {!editCard.id.startsWith('new-') && (
                  <button
                    onClick={() => deleteCard(editCard.id)}
                    className="px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => setEditCard(null)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (editCard.id.startsWith('new-')) {
                      const newCard: PipelineCard = {
                        ...editCard,
                        id: `p${Date.now()}`,
                      };
                      setCards(prev => [...prev, newCard]);
                    } else {
                      handleSaveEdit();
                    }
                    setEditCard(null);
                  }}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-primary-600/25"
                >
                  <Save size={16} />
                  {editCard.id.startsWith('new-') ? 'Criar Lead' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
