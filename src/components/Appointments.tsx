import { useState, useMemo, useCallback, useRef, type DragEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  X,
  User,
  Phone,
  MapPin,
  Stethoscope,
  Edit3,
  Trash2,
  GripVertical,
  Save,
  CalendarDays,
  MessageSquare,
  Eye,
  Copy,
  Send,
} from 'lucide-react';
import { appointments as initialAppointments, professionals, patients } from '../mockData';
import type { Appointment } from '../types';

/* ───────── constants ───────── */

const timeSlots = [
  '07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30','18:00',
];

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  confirmed:  { label: 'Confirmado', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-400', icon: <CheckCircle2 size={14} /> },
  pending:    { label: 'Pendente',   color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-400',   icon: <Clock size={14} /> },
  cancelled:  { label: 'Cancelado',  color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-500/10',       border: 'border-red-400',     icon: <XCircle size={14} /> },
  completed:  { label: 'Concluído',  color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-500/10',     border: 'border-blue-400',    icon: <CheckCircle2 size={14} /> },
  missed:     { label: 'Faltou',     color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-500/10',       border: 'border-red-400',     icon: <AlertCircle size={14} /> },
};

type ViewMode = 'week' | 'day' | 'list';

/* ───────── week helper ───────── */

const getWeekDates = (base: Date) => {
  const s = new Date(base);
  const day = s.getDay();
  s.setDate(s.getDate() - day + (day === 0 ? -6 : 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(s);
    d.setDate(s.getDate() + i);
    return d;
  });
};

const fmt = (d: Date) => d.toISOString().split('T')[0];
const todayISO = fmt(new Date());
const daysShort = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const calcDurationSlots = (start: string, end: string) => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(1, Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 30));
};

const addMinutes = (time: string, mins: number) => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/* ───────── component ───────── */

export default function Appointments() {
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(initialAppointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedProfessional, setSelectedProfessional] = useState('all');

  // quick view
  const [quickViewApt, setQuickViewApt] = useState<Appointment | null>(null);
  // edit modal
  const [editApt, setEditApt] = useState<Appointment | null>(null);
  // drag
  const [draggedAptId, setDraggedAptId] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const filteredAppointments = useMemo(() =>
    appointmentsList.filter(a => selectedProfessional === 'all' || a.professionalId === selectedProfessional),
    [appointmentsList, selectedProfessional]
  );

  const navigateWeek = (d: number) => {
    const n = new Date(currentDate);
    n.setDate(n.getDate() + d * 7);
    setCurrentDate(n);
  };

  const navigateDay = (d: number) => {
    const n = new Date(currentDate);
    n.setDate(n.getDate() + d);
    setCurrentDate(n);
  };

  const todayAppts = filteredAppointments.filter(a => a.date === todayISO);

  /* ── drag handlers ── */

  const onDragStart = useCallback((e: DragEvent<HTMLDivElement>, aptId: string) => {
    setDraggedAptId(aptId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', aptId);
    const el = e.currentTarget;
    setTimeout(() => el.classList.add('opacity-30', 'scale-95'), 0);
  }, []);

  const onDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-30', 'scale-95');
    setDraggedAptId(null);
    setDragOverCell(null);
    dragCounter.current = 0;
  }, []);

  const onCellDragEnter = useCallback((e: DragEvent<HTMLDivElement>, cellKey: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverCell(cellKey);
  }, []);

  const onCellDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onCellDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setDragOverCell(null);
      dragCounter.current = 0;
    }
  }, []);

  const onCellDrop = useCallback((e: DragEvent<HTMLDivElement>, dateStr: string, time: string) => {
    e.preventDefault();
    setDragOverCell(null);
    dragCounter.current = 0;
    const aptId = e.dataTransfer.getData('text/plain');
    if (!aptId) return;

    setAppointmentsList(prev => prev.map(a => {
      if (a.id !== aptId) return a;
      const duration = calcDurationSlots(a.startTime, a.endTime) * 30;
      return { ...a, date: dateStr, startTime: time, endTime: addMinutes(time, duration) };
    }));
    setDraggedAptId(null);

    // update quick view if open
    if (quickViewApt?.id === aptId) {
      setAppointmentsList(prev => {
        const updated = prev.find(a => a.id === aptId);
        if (updated) setQuickViewApt(updated);
        return prev;
      });
    }
  }, [quickViewApt]);

  /* ── helpers ── */

  const getAptsForSlot = (dateStr: string, time: string) =>
    filteredAppointments.filter(a => a.date === dateStr && a.startTime === time);

  const handleQuickView = (apt: Appointment) => {
    setQuickViewApt(apt);
  };

  const handleOpenEdit = (apt: Appointment) => {
    setEditApt({ ...apt });
    setQuickViewApt(null);
  };

  const handleSaveEdit = () => {
    if (!editApt) return;
    setAppointmentsList(prev => prev.map(a => a.id === editApt.id ? editApt : a));
    setEditApt(null);
  };

  const handleDeleteApt = (id: string) => {
    setAppointmentsList(prev => prev.filter(a => a.id !== id));
    setQuickViewApt(null);
    setEditApt(null);
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    setAppointmentsList(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (quickViewApt?.id === id) setQuickViewApt(prev => prev ? { ...prev, status } : null);
  };

  const curMonth = monthNames[weekDates[3].getMonth()];
  const curYear = weekDates[3].getFullYear();
  const dayViewDate = fmt(currentDate);

  /* ── appointment card (reused in week & day) ── */

  const AppointmentCard = ({ apt, compact = false }: { apt: Appointment; compact?: boolean }) => {
    const sc = statusConfig[apt.status];
    const slots = calcDurationSlots(apt.startTime, apt.endTime);
    return (
      <div
        draggable
        onDragStart={e => onDragStart(e, apt.id)}
        onDragEnd={onDragEnd}
        onClick={e => { e.stopPropagation(); handleQuickView(apt); }}
        className={`group/card rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-lg hover:scale-[1.02] border-l-[3px] select-none ${
          draggedAptId === apt.id ? 'opacity-30 scale-95' : ''
        } ${compact ? 'p-1.5 text-[10px]' : 'p-2 text-xs'}`}
        style={{
          backgroundColor: apt.color + '18',
          borderLeftColor: apt.color,
          minHeight: compact ? `${slots * 24}px` : `${slots * 28}px`,
        }}
      >
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center gap-1 min-w-0">
            <GripVertical size={compact ? 10 : 12} className="text-slate-400 dark:text-slate-500 shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <p className="font-semibold text-slate-900 dark:text-white truncate leading-tight">
              {compact ? apt.patientName.split(' ')[0] : apt.patientName.split(' ').slice(0, 2).join(' ')}
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); handleOpenEdit(apt); }}
            className="opacity-0 group-hover/card:opacity-100 p-0.5 rounded hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all shrink-0"
          >
            <Edit3 size={compact ? 10 : 12} className="text-slate-500" />
          </button>
        </div>
        {!compact && <p className="text-slate-500 dark:text-slate-400 truncate mt-0.5">{apt.treatment}</p>}
        <div className="flex items-center gap-1 mt-0.5">
          <span className={`${sc.color}`}>{compact ? null : sc.icon}</span>
          <span className={`${sc.color} font-medium`}>{compact ? apt.startTime : `${apt.startTime}-${apt.endTime}`}</span>
        </div>
      </div>
    );
  };

  /* ────────── RENDER ────────── */

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agenda</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {todayAppts.length} consultas hoje · {todayAppts.filter(a => a.status === 'confirmed').length} confirmadas · {todayAppts.filter(a => a.status === 'pending').length} pendentes
          </p>
        </div>
        <button
          onClick={() => setEditApt({
            id: `new-${Date.now()}`,
            patientId: '',
            patientName: '',
            professionalId: professionals[0].id,
            professionalName: professionals[0].name,
            date: todayISO,
            startTime: '09:00',
            endTime: '10:00',
            status: 'pending',
            treatment: '',
            room: 'Sala 1',
            color: professionals[0].color,
          })}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25"
        >
          <Plus size={18} />
          Nova Consulta
        </button>
      </div>

      {/* ── Controls ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => viewMode === 'day' ? navigateDay(-1) : navigateWeek(-1)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white min-w-[200px] text-center">
              {viewMode === 'day'
                ? currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
                : `${curMonth} ${curYear}`
              }
            </h2>
            <button onClick={() => viewMode === 'day' ? navigateDay(1) : navigateWeek(1)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
            >
              Hoje
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                value={selectedProfessional}
                onChange={e => setSelectedProfessional(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos profissionais</option>
                {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
              {(['day','week','list'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    viewMode === mode
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Lista'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
          {professionals.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{p.name}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
            <GripVertical size={12} />
            <span>Arraste para reagendar</span>
          </div>
        </div>
      </div>

      {/* ══════════════ WEEK VIEW ══════════════ */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-10 bg-white dark:bg-slate-800">
            <div className="p-3" />
            {weekDates.map(d => {
              const iso = fmt(d);
              const isToday = iso === todayISO;
              return (
                <div key={iso} className={`p-3 text-center border-l border-slate-100 dark:border-slate-700/30 ${isToday ? 'bg-primary-50 dark:bg-primary-500/5' : ''}`}>
                  <p className={`text-xs font-medium ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>{daysShort[d.getDay()]}</p>
                  <p className={`text-lg font-bold mt-0.5 ${isToday ? 'text-white bg-primary-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto' : 'text-slate-900 dark:text-white'}`}>
                    {d.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="max-h-[620px] overflow-y-auto">
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-slate-50 dark:border-slate-700/20 min-h-[52px]">
                <div className="p-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium text-right pr-3 pt-1">{time}</div>
                {weekDates.map(d => {
                  const iso = fmt(d);
                  const isToday = iso === todayISO;
                  const cellKey = `${iso}-${time}`;
                  const appts = getAptsForSlot(iso, time);
                  const isDragOver = dragOverCell === cellKey && draggedAptId !== null;

                  return (
                    <div
                      key={cellKey}
                      className={`border-l border-slate-50 dark:border-slate-700/20 p-0.5 transition-colors duration-150 ${
                        isToday ? 'bg-primary-50/20 dark:bg-primary-500/3' : ''
                      } ${isDragOver ? 'bg-primary-100/80 dark:bg-primary-500/15 ring-2 ring-primary-400/50 ring-inset' : ''}`}
                      onDragEnter={e => onCellDragEnter(e, cellKey)}
                      onDragOver={onCellDragOver}
                      onDragLeave={onCellDragLeave}
                      onDrop={e => onCellDrop(e, iso, time)}
                    >
                      {isDragOver && appts.length === 0 && (
                        <div className="h-full min-h-[40px] rounded-lg border-2 border-dashed border-primary-400/50 flex items-center justify-center">
                          <span className="text-[10px] text-primary-400 font-medium">Soltar aqui</span>
                        </div>
                      )}
                      {appts.map(apt => (
                        <AppointmentCard key={apt.id} apt={apt} compact />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ DAY VIEW ══════════════ */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div className="max-h-[620px] overflow-y-auto">
            {timeSlots.map(time => {
              const appts = getAptsForSlot(dayViewDate, time);
              const cellKey = `day-${dayViewDate}-${time}`;
              const isDragOver = dragOverCell === cellKey && draggedAptId !== null;

              return (
                <div
                  key={time}
                  className="flex border-b border-slate-50 dark:border-slate-700/20 min-h-[64px]"
                >
                  <div className="w-20 p-3 text-sm text-slate-400 dark:text-slate-500 font-medium text-right shrink-0">{time}</div>
                  <div
                    className={`flex-1 p-1 border-l border-slate-100 dark:border-slate-700/30 transition-colors duration-150 ${
                      isDragOver ? 'bg-primary-100/80 dark:bg-primary-500/15 ring-2 ring-primary-400/50 ring-inset' : ''
                    }`}
                    onDragEnter={e => onCellDragEnter(e, cellKey)}
                    onDragOver={onCellDragOver}
                    onDragLeave={onCellDragLeave}
                    onDrop={e => onCellDrop(e, dayViewDate, time)}
                  >
                    {isDragOver && appts.length === 0 && (
                      <div className="h-full min-h-[48px] rounded-lg border-2 border-dashed border-primary-400/50 flex items-center justify-center">
                        <span className="text-xs text-primary-400 font-medium">Soltar aqui</span>
                      </div>
                    )}
                    {appts.map(apt => {
                      const sc = statusConfig[apt.status];
                      return (
                        <div
                          key={apt.id}
                          draggable
                          onDragStart={e => onDragStart(e, apt.id)}
                          onDragEnd={onDragEnd}
                          onClick={() => handleQuickView(apt)}
                          className={`group/card flex items-center gap-3 p-3 rounded-xl mb-1 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 ${
                            draggedAptId === apt.id ? 'opacity-30 scale-95' : ''
                          }`}
                          style={{ backgroundColor: apt.color + '15', borderLeft: `3px solid ${apt.color}` }}
                        >
                          <GripVertical size={16} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{apt.patientName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{apt.treatment} · {apt.professionalName}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{apt.startTime} - {apt.endTime} · {apt.room}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${sc.bg} ${sc.color}`}>
                              {sc.icon}
                              {sc.label}
                            </span>
                            <button
                              onClick={e => { e.stopPropagation(); handleOpenEdit(apt); }}
                              className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-700/60 opacity-0 group-hover/card:opacity-100 transition-all"
                            >
                              <Edit3 size={14} className="text-slate-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════ LIST VIEW ══════════════ */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Horário</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Paciente</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tratamento</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Profissional</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Sala</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="text-center p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments
                  .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                  .map(apt => {
                    const sc = statusConfig[apt.status];
                    return (
                      <tr
                        key={apt.id}
                        className="border-b border-slate-50 dark:border-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                        onClick={() => handleQuickView(apt)}
                      >
                        <td className="p-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{apt.startTime} - {apt.endTime}</p>
                          <p className="text-xs text-slate-400">{apt.date}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: apt.color }}>
                              {apt.patientName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{apt.patientName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{apt.treatment}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: apt.color }} />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{apt.professionalName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{apt.room}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>
                            {sc.icon}
                            {sc.label}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={e => { e.stopPropagation(); handleQuickView(apt); }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Quick View"
                            >
                              <Eye size={14} className="text-slate-400" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleOpenEdit(apt); }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Editar"
                            >
                              <Edit3 size={14} className="text-slate-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ QUICK VIEW PANEL ══════════════ */}
      {quickViewApt && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setQuickViewApt(null)} />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Header band with color */}
            <div className="relative h-28 flex items-end p-5" style={{ backgroundColor: quickViewApt.color }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <button
                onClick={() => setQuickViewApt(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="relative text-white">
                <p className="text-xs font-medium opacity-80">Quick View</p>
                <h2 className="text-xl font-bold">{quickViewApt.patientName}</h2>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Status & Actions Row */}
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl ${statusConfig[quickViewApt.status].bg} ${statusConfig[quickViewApt.status].color}`}>
                  {statusConfig[quickViewApt.status].icon}
                  {statusConfig[quickViewApt.status].label}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(quickViewApt)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Editar"
                  >
                    <Edit3 size={16} className="text-slate-500" />
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`${quickViewApt.patientName} - ${quickViewApt.date} ${quickViewApt.startTime}`); }}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Copiar"
                  >
                    <Copy size={16} className="text-slate-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteApt(quickViewApt.id)}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <CalendarDays size={14} />
                    <span className="text-[11px] font-medium uppercase">Data</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {new Date(quickViewApt.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Clock size={14} />
                    <span className="text-[11px] font-medium uppercase">Horário</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {quickViewApt.startTime} – {quickViewApt.endTime}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <User size={14} />
                    <span className="text-[11px] font-medium uppercase">Profissional</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{quickViewApt.professionalName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <MapPin size={14} />
                    <span className="text-[11px] font-medium uppercase">Sala</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{quickViewApt.room}</p>
                </div>
              </div>

              {/* Treatment */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Stethoscope size={14} />
                  <span className="text-[11px] font-medium uppercase">Tratamento</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{quickViewApt.treatment}</p>
              </div>

              {/* Patient Info */}
              {(() => {
                const pat = patients.find(p => p.id === quickViewApt.patientId);
                if (!pat) return null;
                return (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-dental-500 flex items-center justify-center text-white font-bold text-sm">
                        {pat.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{pat.name}</p>
                        <p className="text-xs text-slate-400">{pat.insurance}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone size={14} className="text-slate-400" />
                      <span>{pat.phone}</span>
                    </div>
                    {pat.allergies.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle size={14} />
                        <span>Alergias: {pat.allergies.join(', ')}</span>
                      </div>
                    )}
                    {pat.notes && (
                      <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <MessageSquare size={14} className="mt-0.5 shrink-0 text-slate-400" />
                        <span>{pat.notes}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Quick Status Change */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Alterar Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['confirmed','pending','cancelled','completed','missed'] as Appointment['status'][]).map(s => {
                    const sc = statusConfig[s];
                    const isActive = quickViewApt.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(quickViewApt.id, s)}
                        className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? `${sc.bg} ${sc.color} ring-2 ring-offset-1 dark:ring-offset-slate-800 ${sc.border}`
                            : 'bg-slate-50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {sc.icon}
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleOpenEdit(quickViewApt)}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Editar Consulta
                </button>
                <button className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                  <Send size={16} />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ EDIT MODAL ══════════════ */}
      {editApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditApt(null)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-500/10">
                  <CalendarDays size={20} className="text-primary-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editApt.id.startsWith('new-') ? 'Nova Consulta' : 'Editar Consulta'}
                  </h2>
                  <p className="text-xs text-slate-400">{editApt.id.startsWith('new-') ? 'Preencha os dados abaixo' : `ID: ${editApt.id}`}</p>
                </div>
              </div>
              <button onClick={() => setEditApt(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Patient */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paciente</label>
                <select
                  value={editApt.patientId}
                  onChange={e => {
                    const pat = patients.find(p => p.id === e.target.value);
                    setEditApt({ ...editApt, patientId: e.target.value, patientName: pat?.name || '' });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {/* Treatment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tratamento</label>
                <input
                  type="text"
                  value={editApt.treatment}
                  onChange={e => setEditApt({ ...editApt, treatment: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Tipo de procedimento"
                />
              </div>

              {/* Professional */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profissional</label>
                <select
                  value={editApt.professionalId}
                  onChange={e => {
                    const prof = professionals.find(p => p.id === e.target.value);
                    setEditApt({
                      ...editApt,
                      professionalId: e.target.value,
                      professionalName: prof?.name || '',
                      color: prof?.color || editApt.color,
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {professionals.map(p => <option key={p.id} value={p.id}>{p.name} – {p.specialty}</option>)}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    value={editApt.date}
                    onChange={e => setEditApt({ ...editApt, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Início</label>
                  <select
                    value={editApt.startTime}
                    onChange={e => setEditApt({ ...editApt, startTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fim</label>
                  <select
                    value={editApt.endTime}
                    onChange={e => setEditApt({ ...editApt, endTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Room & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sala</label>
                  <select
                    value={editApt.room}
                    onChange={e => setEditApt({ ...editApt, room: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option>Sala 1</option>
                    <option>Sala 2</option>
                    <option>Sala 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={editApt.status}
                    onChange={e => setEditApt({ ...editApt, status: e.target.value as Appointment['status'] })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="completed">Concluído</option>
                    <option value="missed">Faltou</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: editApt.color }} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {editApt.patientName || 'Paciente não selecionado'}
                    </p>
                    <p className="text-xs text-slate-500">{editApt.treatment || 'Sem tratamento'}</p>
                    <p className="text-xs text-slate-400">{editApt.date} · {editApt.startTime}–{editApt.endTime} · {editApt.room}</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                {!editApt.id.startsWith('new-') && (
                  <button
                    onClick={() => handleDeleteApt(editApt.id)}
                    className="px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => setEditApt(null)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (editApt.id.startsWith('new-')) {
                      const newApt: Appointment = {
                        ...editApt,
                        id: String(Date.now()),
                      };
                      setAppointmentsList(prev => [...prev, newApt]);
                    } else {
                      handleSaveEdit();
                    }
                    setEditApt(null);
                  }}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-primary-600/25"
                >
                  <Save size={16} />
                  {editApt.id.startsWith('new-') ? 'Criar Consulta' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
