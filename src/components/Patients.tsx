import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  ChevronRight,
  X,
  Heart,
  FileText,
  DollarSign,
  Clock,
  User,
  Shield,
  Edit3,
  Trash2,
  Copy,
  MessageCircle,
  Activity,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ClipboardList,
  Pill,
  Camera,
  Upload,
  ChevronDown,
  ChevronUp,
  Star,
  ArrowRight,
  CalendarPlus,
  Receipt,
} from 'lucide-react';
import { patients as initialPatients, appointments as allAppointments, transactions as allTransactions, professionals, treatmentTypes } from '../mockData';
import type { Patient } from '../types';

type SubPanel = null | 'prontuario' | 'financeiro' | 'agendar';

export default function Patients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [patientsList, setPatientsList] = useState<Patient[]>(initialPatients);
  const [quickViewPatient, setQuickViewPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [subPanel, setSubPanel] = useState<SubPanel>(null);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    birthDate: '',
    insurance: 'Particular',
    allergies: '',
    notes: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Schedule form state
  const [scheduleData, setScheduleData] = useState({
    professionalId: '1',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '09:00',
    treatment: '',
    room: 'Sala 1',
  });

  // Prontuario state
  const [prontuarioTab, setProntuarioTab] = useState<'anamnese' | 'evolucao' | 'historico' | 'exames'>('anamnese');
  const [expandedEvolucao, setExpandedEvolucao] = useState<string | null>(null);

  // Financial state
  const [financeTab, setFinanceTab] = useState<'extrato' | 'pendentes' | 'resumo'>('extrato');

  const filtered = patientsList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search) ||
      p.phone.includes(search);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openNewForm = () => {
    setEditingPatient(null);
    setFormData({
      name: '', cpf: '', phone: '', email: '', birthDate: '',
      insurance: 'Particular', allergies: '', notes: '', status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      cpf: patient.cpf,
      phone: patient.phone,
      email: patient.email,
      birthDate: patient.birthDate,
      insurance: patient.insurance,
      allergies: patient.allergies.join(', '),
      notes: patient.notes,
      status: patient.status,
    });
    setShowForm(true);
  };

  const savePatient = () => {
    if (!formData.name.trim()) return;
    const allergiesArr = formData.allergies.split(',').map(a => a.trim()).filter(Boolean);

    if (editingPatient) {
      setPatientsList(prev => prev.map(p =>
        p.id === editingPatient.id
          ? { ...p, ...formData, allergies: allergiesArr }
          : p
      ));
      if (quickViewPatient?.id === editingPatient.id) {
        setQuickViewPatient({ ...editingPatient, ...formData, allergies: allergiesArr });
      }
    } else {
      const newPatient: Patient = {
        id: `new-${Date.now()}`,
        ...formData,
        allergies: allergiesArr,
        lastVisit: '-',
        nextVisit: '',
        totalSpent: 0,
        treatmentsCount: 0,
      };
      setPatientsList(prev => [newPatient, ...prev]);
    }
    setShowForm(false);
    setEditingPatient(null);
  };

  const deletePatient = (id: string) => {
    setPatientsList(prev => prev.filter(p => p.id !== id));
    if (quickViewPatient?.id === id) setQuickViewPatient(null);
    setShowForm(false);
  };

  // Get patient appointments
  const patientAppointments = useMemo(() => {
    if (!quickViewPatient) return [];
    return allAppointments.filter(a => a.patientId === quickViewPatient.id || a.patientName === quickViewPatient.name);
  }, [quickViewPatient]);

  // Get patient transactions
  const patientTransactions = useMemo(() => {
    if (!quickViewPatient) return [];
    return allTransactions.filter(t => t.patientName === quickViewPatient.name);
  }, [quickViewPatient]);

  const pendingTransactions = patientTransactions.filter(t => t.status === 'pending' || t.status === 'overdue');
  const totalPaid = patientTransactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((s, t) => s + t.value, 0);
  const totalPending = patientTransactions.filter(t => t.type === 'income' && (t.status === 'pending' || t.status === 'overdue')).reduce((s, t) => s + t.value, 0);

  // Mock prontuario data
  const anamneseData = {
    queixaPrincipal: 'Dor ao mastigar no lado direito',
    historicoMedico: 'Hipertensão controlada com medicação. Diabetes tipo 2.',
    medicamentos: ['Losartana 50mg', 'Metformina 850mg'],
    habitos: ['Bruxismo noturno', 'Escovação 2x/dia'],
    ultimaConsulta: quickViewPatient?.lastVisit || '-',
  };

  const evolucaoClinica = [
    { id: 'e1', date: '2024-01-14', professional: 'Dra. Camila Rocha', title: 'Manutenção Ortodôntica', description: 'Troca de elástico. Ajuste de arco superior. Paciente relatou leve desconforto nos primeiros dias. Orientado sobre uso de cera.', tipo: 'Rotina' },
    { id: 'e2', date: '2024-01-08', professional: 'Dr. Rafael Santos', title: 'Avaliação para Implante', description: 'Avaliação clínica e radiográfica. Solicitado tomografia para planejamento. Região 36 com indicação de implante unitário.', tipo: 'Avaliação' },
    { id: 'e3', date: '2023-12-15', professional: 'Dra. Beatriz Lima', title: 'Tratamento de Canal - Dente 46', description: 'Primeira sessão de endodontia. Anestesia infiltrativa. Abertura coronária, instrumentação e medicação intracanal. Paciente assintomático ao final.', tipo: 'Procedimento' },
    { id: 'e4', date: '2023-11-20', professional: 'Dr. Thiago Mendes', title: 'Limpeza e Profilaxia', description: 'Raspagem supragengival e polimento. Orientação de higiene. Recomendado retorno em 6 meses.', tipo: 'Preventivo' },
  ];

  const openQuickView = (patient: Patient) => {
    setQuickViewPatient(patient);
    setSubPanel(null);
  };

  const openSubPanel = (panel: SubPanel) => {
    setSubPanel(panel);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pacientes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {patientsList.length} pacientes cadastrados · {patientsList.filter(p => p.status === 'active').length} ativos
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25"
        >
          <Plus size={18} />
          Novo Paciente
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === s
                  ? s === 'all' ? 'bg-primary-600 text-white' : s === 'active' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {s === 'all' ? 'Todos' : s === 'active' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
          <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((patient) => (
          <div
            key={patient.id}
            onClick={() => openQuickView(patient)}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-500/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-dental-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {getInitials(patient.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">CPF: {patient.cpf}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    patient.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone size={14} className="shrink-0 text-slate-400" />
                <span className="truncate">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Shield size={14} className="shrink-0 text-slate-400" />
                <span className="truncate">{patient.insurance}</span>
              </div>
              {patient.allergies.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span className="truncate">{patient.allergies.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Gasto Total</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">R$ {patient.totalSpent.toLocaleString('pt-BR')}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Tratamentos</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{patient.treatmentsCount}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <User size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Nenhum paciente encontrado</p>
        </div>
      )}

      {/* ==================== QUICK VIEW PANEL ==================== */}
      {quickViewPatient && !subPanel && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setQuickViewPatient(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-dental-500 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl border border-white/30">
                    {getInitials(quickViewPatient.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{quickViewPatient.name}</h2>
                    <p className="text-primary-100 text-sm mt-0.5">CPF: {quickViewPatient.cpf}</p>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      quickViewPatient.status === 'active'
                        ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30'
                        : 'bg-red-400/20 text-red-100 border border-red-400/30'
                    }`}>
                      {quickViewPatient.status === 'active' ? '● Ativo' : '● Inativo'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setQuickViewPatient(null)} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <DollarSign size={18} className="mx-auto text-emerald-500 mb-1" />
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">R$ {quickViewPatient.totalSpent.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">Total Gasto</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                  <Heart size={18} className="mx-auto text-blue-500 mb-1" />
                  <p className="text-base font-bold text-blue-700 dark:text-blue-400">{quickViewPatient.treatmentsCount}</p>
                  <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-0.5">Tratamentos</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20">
                  <Calendar size={18} className="mx-auto text-violet-500 mb-1" />
                  <p className="text-base font-bold text-violet-700 dark:text-violet-400">{patientAppointments.length}</p>
                  <p className="text-[10px] text-violet-600/70 dark:text-violet-400/70 mt-0.5">Consultas</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Informações Pessoais</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Phone, label: 'Telefone', value: quickViewPatient.phone },
                    { icon: Mail, label: 'Email', value: quickViewPatient.email },
                    { icon: Calendar, label: 'Nascimento', value: quickViewPatient.birthDate },
                    { icon: Shield, label: 'Convênio', value: quickViewPatient.insurance },
                    { icon: Clock, label: 'Última Visita', value: quickViewPatient.lastVisit },
                    { icon: CalendarPlus, label: 'Próxima', value: quickViewPatient.nextVisit || 'Não agendada' },
                  ].map((info, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                      <info.icon size={14} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400">{info.label}</p>
                        <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              {quickViewPatient.allergies.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
                    <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400">Alergias</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewPatient.allergies.map(a => (
                      <span key={a} className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-medium">
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Observações Clínicas</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 leading-relaxed">
                  {quickViewPatient.notes}
                </p>
              </div>

              {/* Recent Appointments */}
              {patientAppointments.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Consultas Recentes</h3>
                  <div className="space-y-2">
                    {patientAppointments.slice(0, 3).map(apt => (
                      <div key={apt.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: apt.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{apt.treatment}</p>
                          <p className="text-[10px] text-slate-400">{apt.date} · {apt.startTime} - {apt.endTime}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          apt.status === 'confirmed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                          apt.status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                          apt.status === 'completed' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                          'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                        }`}>
                          {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : apt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LTV & Engagement Score */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-dental-50 dark:from-primary-500/10 dark:to-dental-500/10 border border-primary-100 dark:border-primary-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-primary-600 dark:text-primary-400" />
                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold">LTV Estimado</span>
                  </div>
                  <p className="text-lg font-bold text-primary-700 dark:text-primary-300">
                    R$ {(quickViewPatient.totalSpent * 2.5).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Engajamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      {quickViewPatient.status === 'active' ? Math.min(95, 60 + quickViewPatient.treatmentsCount * 5) : 20}%
                    </p>
                    <div className="flex-1 h-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${quickViewPatient.status === 'active' ? Math.min(95, 60 + quickViewPatient.treatmentsCount * 5) : 20}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Main */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ações Rápidas</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openSubPanel('agendar')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100 dark:hover:bg-primary-500/20 border border-primary-200 dark:border-primary-500/20 transition-colors group"
                  >
                    <CalendarPlus size={20} className="text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-primary-700 dark:text-primary-400">Agendar</span>
                  </button>
                  <button
                    onClick={() => openSubPanel('prontuario')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 border border-violet-200 dark:border-violet-500/20 transition-colors group"
                  >
                    <ClipboardList size={20} className="text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-400">Prontuário</span>
                  </button>
                  <button
                    onClick={() => openSubPanel('financeiro')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 transition-colors group"
                  >
                    <Receipt size={20} className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Financeiro</span>
                  </button>
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(quickViewPatient)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Edit3 size={15} />
                  Editar
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/55${quickViewPatient.phone.replace(/\D/g, '')}`, '_blank')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <MessageCircle size={15} />
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(`${quickViewPatient.name} - ${quickViewPatient.phone}`)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== AGENDAR CONSULTA PANEL ==================== */}
      {quickViewPatient && subPanel === 'agendar' && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubPanel(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-blue-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSubPanel(null)} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-white">Agendar Consulta</h2>
                    <p className="text-primary-100 text-sm">{quickViewPatient.name}</p>
                  </div>
                </div>
                <button onClick={() => { setSubPanel(null); setQuickViewPatient(null); }} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Patient Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-dental-500 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(quickViewPatient.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{quickViewPatient.name}</p>
                  <p className="text-xs text-slate-500">{quickViewPatient.insurance} · {quickViewPatient.phone}</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Profissional</label>
                  <div className="grid grid-cols-2 gap-2">
                    {professionals.map(prof => (
                      <button
                        key={prof.id}
                        onClick={() => setScheduleData({ ...scheduleData, professionalId: prof.id })}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                          scheduleData.professionalId === prof.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: prof.color }}>
                          {prof.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{prof.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{prof.specialty}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tratamento</label>
                  <select
                    value={scheduleData.treatment}
                    onChange={(e) => setScheduleData({ ...scheduleData, treatment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">Selecione o tratamento</option>
                    {treatmentTypes.map(t => (
                      <option key={t.id} value={t.name}>{t.name} – R$ {t.price.toLocaleString('pt-BR')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Data</label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Início</label>
                    <select
                      value={scheduleData.startTime}
                      onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 20 }, (_, i) => {
                        const h = Math.floor(i / 2) + 8;
                        const m = i % 2 === 0 ? '00' : '30';
                        return `${h.toString().padStart(2, '0')}:${m}`;
                      }).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Término</label>
                    <select
                      value={scheduleData.endTime}
                      onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 20 }, (_, i) => {
                        const h = Math.floor(i / 2) + 8;
                        const m = i % 2 === 0 ? '00' : '30';
                        return `${h.toString().padStart(2, '0')}:${m}`;
                      }).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sala</label>
                  <div className="flex gap-2">
                    {['Sala 1', 'Sala 2', 'Sala 3'].map(room => (
                      <button
                        key={room}
                        onClick={() => setScheduleData({ ...scheduleData, room })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                          scheduleData.room === room
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Slots Preview */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Horários Disponíveis</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['08:00', '09:00', '09:30', '10:00', '11:00', '13:00', '14:00', '14:30', '15:00', '16:00', '17:00'].map(time => {
                      const isSelected = scheduleData.startTime === time;
                      const isOccupied = ['08:30', '10:30', '15:30'].includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => {
                            if (!isOccupied) {
                              const [h, m] = time.split(':').map(Number);
                              const endH = h + 1;
                              setScheduleData({
                                ...scheduleData,
                                startTime: time,
                                endTime: `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                              });
                            }
                          }}
                          disabled={isOccupied}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected ? 'bg-primary-600 text-white shadow-sm' :
                            isOccupied ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-600 line-through cursor-not-allowed' :
                            'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preview Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-700/30 dark:to-primary-500/5 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Preview</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-12 rounded-full" style={{ backgroundColor: professionals.find(p => p.id === scheduleData.professionalId)?.color || '#6366f1' }} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{scheduleData.treatment || 'Tratamento não selecionado'}</p>
                      <p className="text-xs text-slate-500">{quickViewPatient.name}</p>
                      <p className="text-xs text-slate-400">{scheduleData.date} · {scheduleData.startTime} - {scheduleData.endTime} · {scheduleData.room}</p>
                      <p className="text-xs text-slate-400">{professionals.find(p => p.id === scheduleData.professionalId)?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSubPanel(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors">
                  Voltar
                </button>
                <button
                  onClick={() => {
                    alert(`✅ Consulta agendada!\n\nPaciente: ${quickViewPatient.name}\nData: ${scheduleData.date}\nHorário: ${scheduleData.startTime} - ${scheduleData.endTime}\nTratamento: ${scheduleData.treatment}\nSala: ${scheduleData.room}`);
                    setSubPanel(null);
                  }}
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25"
                >
                  <span className="flex items-center justify-center gap-2"><CalendarPlus size={16} /> Confirmar Agendamento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PRONTUÁRIO PANEL ==================== */}
      {quickViewPatient && subPanel === 'prontuario' && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubPanel(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-purple-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSubPanel(null)} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-white">Prontuário Eletrônico</h2>
                    <p className="text-violet-100 text-sm">{quickViewPatient.name}</p>
                  </div>
                </div>
                <button onClick={() => { setSubPanel(null); setQuickViewPatient(null); }} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                {([
                  { id: 'anamnese' as const, label: 'Anamnese', icon: ClipboardList },
                  { id: 'evolucao' as const, label: 'Evolução', icon: Activity },
                  { id: 'historico' as const, label: 'Histórico', icon: Heart },
                  { id: 'exames' as const, label: 'Exames', icon: Camera },
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setProntuarioTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      prontuarioTab === tab.id
                        ? 'bg-white dark:bg-slate-600 text-violet-700 dark:text-violet-300 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Anamnese Tab */}
              {prontuarioTab === 'anamnese' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
                    <h4 className="text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wider mb-2">Queixa Principal</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{anamneseData.queixaPrincipal}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Histórico Médico</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{anamneseData.historicoMedico}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Pill size={13} /> Medicamentos em Uso
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {anamneseData.medicamentos.map(med => (
                        <span key={med} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                          💊 {med}
                        </span>
                      ))}
                    </div>
                  </div>

                  {quickViewPatient.allergies.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                      <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle size={13} /> Alergias
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {quickViewPatient.allergies.map(a => (
                          <span key={a} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium">
                            ⚠️ {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hábitos e Observações</h4>
                    <div className="flex flex-wrap gap-2">
                      {anamneseData.habitos.map(h => (
                        <span key={h} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Observações Clínicas</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{quickViewPatient.notes}</p>
                  </div>
                </div>
              )}

              {/* Evolução Clínica Tab */}
              {prontuarioTab === 'evolucao' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Evoluções Registradas</h3>
                    <span className="text-xs text-slate-400">{evolucaoClinica.length} registros</span>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-violet-200 dark:bg-violet-500/20" />
                    <div className="space-y-3">
                      {evolucaoClinica.map((ev) => (
                        <div key={ev.id} className="relative pl-10">
                          <div className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 ${
                            ev.tipo === 'Procedimento' ? 'bg-violet-500 border-violet-300' :
                            ev.tipo === 'Avaliação' ? 'bg-blue-500 border-blue-300' :
                            ev.tipo === 'Preventivo' ? 'bg-emerald-500 border-emerald-300' :
                            'bg-slate-400 border-slate-300'
                          }`} />

                          <div
                            onClick={() => setExpandedEvolucao(expandedEvolucao === ev.id ? null : ev.id)}
                            className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-violet-200 dark:hover:border-violet-500/20"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    ev.tipo === 'Procedimento' ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400' :
                                    ev.tipo === 'Avaliação' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                                    ev.tipo === 'Preventivo' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                                    'bg-slate-200 dark:bg-slate-600/50 text-slate-600 dark:text-slate-400'
                                  }`}>
                                    {ev.tipo}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{ev.date}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{ev.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{ev.professional}</p>
                              </div>
                              {expandedEvolucao === ev.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                            </div>

                            {expandedEvolucao === ev.id && (
                              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600/50 animate-fade-in">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{ev.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-2.5 border-2 border-dashed border-violet-300 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 rounded-xl text-sm font-semibold hover:bg-violet-50 dark:hover:bg-violet-500/5 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Nova Evolução
                  </button>
                </div>
              )}

              {/* Histórico de Tratamentos Tab */}
              {prontuarioTab === 'historico' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tratamentos Realizados</h3>
                    <span className="text-xs text-slate-400">{quickViewPatient.treatmentsCount} tratamentos</span>
                  </div>

                  {[
                    { name: 'Manutenção Ortodôntica', status: 'Em andamento', startDate: '2023-06-15', sessions: '12/24', value: 5500, professional: 'Dra. Camila Rocha' },
                    { name: 'Tratamento de Canal - 46', status: 'Em andamento', startDate: '2023-12-15', sessions: '1/3', value: 1200, professional: 'Dra. Beatriz Lima' },
                    { name: 'Limpeza e Profilaxia', status: 'Concluído', startDate: '2023-11-20', sessions: '1/1', value: 280, professional: 'Dr. Thiago Mendes' },
                  ].map((trat, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{trat.name}</h4>
                          <p className="text-xs text-slate-500">{trat.professional}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          trat.status === 'Em andamento' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                          'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {trat.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-800">
                          <p className="text-[10px] text-slate-400">Início</p>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{trat.startDate}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-800">
                          <p className="text-[10px] text-slate-400">Sessões</p>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{trat.sessions}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-800">
                          <p className="text-[10px] text-slate-400">Valor</p>
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">R$ {trat.value.toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                      {trat.status === 'Em andamento' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>Progresso</span>
                            <span>{trat.sessions}</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-600/50 rounded-full">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-primary-500 rounded-full transition-all"
                              style={{ width: `${(parseInt(trat.sessions.split('/')[0]) / parseInt(trat.sessions.split('/')[1])) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Exames Tab */}
              {prontuarioTab === 'exames' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exames e Documentos</h3>
                    <button className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                      <Upload size={13} /> Upload
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Panorâmica', date: '2024-01-08', type: 'Radiografia', icon: '🦷' },
                      { name: 'Periapical - 46', date: '2023-12-15', type: 'Radiografia', icon: '📸' },
                      { name: 'Tomografia', date: '2024-01-08', type: 'Tomografia', icon: '🔬' },
                      { name: 'Foto Inicial', date: '2023-06-15', type: 'Foto Clínica', icon: '📷' },
                    ].map((doc, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-full h-20 bg-slate-200 dark:bg-slate-600/50 rounded-lg flex items-center justify-center mb-2 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors">
                          <span className="text-2xl">{doc.icon}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{doc.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-400">{doc.date}</span>
                          <span className="text-[10px] font-medium text-primary-600 dark:text-primary-400">{doc.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex items-center justify-center gap-2">
                    <Upload size={16} /> Adicionar Exame ou Documento
                  </button>
                </div>
              )}

              {/* Back Button */}
              <button onClick={() => setSubPanel(null)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <ArrowRight size={15} className="rotate-180" /> Voltar ao Paciente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FINANCEIRO PANEL ==================== */}
      {quickViewPatient && subPanel === 'financeiro' && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubPanel(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSubPanel(null)} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-white">Financeiro do Paciente</h2>
                    <p className="text-emerald-100 text-sm">{quickViewPatient.name}</p>
                  </div>
                </div>
                <button onClick={() => { setSubPanel(null); setQuickViewPatient(null); }} className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle2 size={18} className="mx-auto text-emerald-500 mb-1" />
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">R$ {totalPaid.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Pago</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                  <AlertCircle size={18} className="mx-auto text-amber-500 mb-1" />
                  <p className="text-base font-bold text-amber-700 dark:text-amber-400">R$ {totalPending.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">Pendente</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                  <CreditCard size={18} className="mx-auto text-blue-500 mb-1" />
                  <p className="text-base font-bold text-blue-700 dark:text-blue-400">R$ {quickViewPatient.totalSpent.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70">Total</p>
                </div>
              </div>

              {/* Financial Health */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-slate-700/30 dark:to-emerald-500/5 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saúde Financeira</span>
                  <span className={`text-xs font-bold ${totalPending > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {totalPending > 0 ? '⚠️ Com pendências' : '✅ Em dia'}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-600/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${totalPaid / (totalPaid + totalPending || 1) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Pago: {((totalPaid / (totalPaid + totalPending || 1)) * 100).toFixed(0)}%</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">Pendente: {((totalPending / (totalPaid + totalPending || 1)) * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                {([
                  { id: 'extrato' as const, label: 'Extrato', icon: FileText },
                  { id: 'pendentes' as const, label: `Pendentes (${pendingTransactions.length})`, icon: AlertCircle },
                  { id: 'resumo' as const, label: 'Resumo', icon: TrendingUp },
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFinanceTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      financeTab === tab.id
                        ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-300 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Extrato Tab */}
              {financeTab === 'extrato' && (
                <div className="space-y-2 animate-fade-in">
                  {patientTransactions.length > 0 ? (
                    patientTransactions.map(tx => (
                      <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:shadow-md transition-all">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20'
                            : 'bg-red-100 dark:bg-red-500/20'
                        }`}>
                          {tx.type === 'income' ? (
                            <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <XCircle size={16} className="text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">{tx.date}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              tx.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                              tx.status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                              'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                            }`}>
                              {tx.status === 'paid' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : 'Vencido'}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm font-bold shrink-0 ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {tx.type === 'income' ? '+' : '-'} R$ {tx.value.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma transação registrada</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pendentes Tab */}
              {financeTab === 'pendentes' && (
                <div className="space-y-3 animate-fade-in">
                  {pendingTransactions.length > 0 ? (
                    pendingTransactions.map(tx => (
                      <div key={tx.id} className={`p-4 rounded-xl border ${
                        tx.status === 'overdue'
                          ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                          : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Vencimento: {tx.date}</p>
                          </div>
                          <p className="text-base font-bold text-slate-900 dark:text-white">R$ {tx.value.toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                            <CheckCircle2 size={13} /> Marcar Pago
                          </button>
                          <button className="py-2 px-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-600">
                            <MessageCircle size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2" />
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Sem pendências! 🎉</p>
                      <p className="text-xs text-slate-400 mt-1">Todas as contas estão em dia</p>
                    </div>
                  )}
                </div>
              )}

              {/* Resumo Tab */}
              {financeTab === 'resumo' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Monthly Revenue from Patient */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Investimento por Categoria</h4>
                    {[
                      { category: 'Procedimentos', value: quickViewPatient.totalSpent * 0.65, pct: 65, color: 'bg-violet-500' },
                      { category: 'Consultas', value: quickViewPatient.totalSpent * 0.2, pct: 20, color: 'bg-blue-500' },
                      { category: 'Manutenção', value: quickViewPatient.totalSpent * 0.1, pct: 10, color: 'bg-emerald-500' },
                      { category: 'Outros', value: quickViewPatient.totalSpent * 0.05, pct: 5, color: 'bg-slate-400' },
                    ].map((cat, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600 dark:text-slate-400">{cat.category}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">R$ {cat.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-600/50 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Financial Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Ticket Médio', value: `R$ ${(quickViewPatient.totalSpent / Math.max(quickViewPatient.treatmentsCount, 1)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, color: 'text-primary-600 dark:text-primary-400' },
                      { label: 'Frequência', value: `${quickViewPatient.treatmentsCount}x`, color: 'text-violet-600 dark:text-violet-400' },
                      { label: 'Última Movimentação', value: quickViewPatient.lastVisit, color: 'text-slate-600 dark:text-slate-400' },
                      { label: 'LTV Projetado', value: `R$ ${(quickViewPatient.totalSpent * 2.5).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, color: 'text-emerald-600 dark:text-emerald-400' },
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                        <p className="text-[10px] text-slate-400 mb-0.5">{m.label}</p>
                        <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Formas de Pagamento Utilizadas</h4>
                    <div className="flex gap-2">
                      {[
                        { method: 'PIX', icon: '⚡', pct: 45 },
                        { method: 'Cartão', icon: '💳', pct: 35 },
                        { method: 'Boleto', icon: '📄', pct: 20 },
                      ].map((pm, idx) => (
                        <div key={idx} className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-center">
                          <span className="text-xl">{pm.icon}</span>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{pm.method}</p>
                          <p className="text-[10px] text-slate-400">{pm.pct}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <button onClick={() => setSubPanel(null)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <ArrowRight size={15} className="rotate-180" /> Voltar ao Paciente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT / NEW PATIENT MODAL ==================== */}
      {showForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in">
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
                </h2>
                {editingPatient && (
                  <p className="text-sm text-slate-400 mt-0.5">ID: {editingPatient.id}</p>
                )}
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Nome do paciente"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CPF</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Convênio</label>
                  <select
                    value={formData.insurance}
                    onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option>Particular</option>
                    <option>Bradesco Dental</option>
                    <option>Amil Dental</option>
                    <option>SulAmérica</option>
                    <option>Unimed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormData({ ...formData, status: 'active' })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        formData.status === 'active'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Ativo
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, status: 'inactive' })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        formData.status === 'inactive'
                          ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Inativo
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alergias</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Separar por vírgula (ex: Penicilina, Latex)"
                />
                {formData.allergies && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.allergies.split(',').map(a => a.trim()).filter(Boolean).map(a => (
                      <span key={a} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-medium">
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações Clínicas</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Observações clínicas relevantes"
                />
              </div>

              {/* Live Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-700/30 dark:to-primary-500/5 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Preview</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-dental-500 flex items-center justify-center text-white font-bold text-sm">
                    {formData.name ? getInitials(formData.name) : '??'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formData.name || 'Nome do paciente'}</p>
                    <p className="text-xs text-slate-500">{formData.insurance} · {formData.phone || 'Telefone'}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      formData.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                      {formData.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {editingPatient && (
                  <button
                    onClick={() => deletePatient(editingPatient.id)}
                    className="px-4 py-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePatient}
                  disabled={!formData.name.trim()}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  {editingPatient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
