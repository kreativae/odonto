import type { Patient, Appointment, PipelineCard, Transaction, TreatmentType, Notification } from './types';

export const patients: Patient[] = [
  { id: '1', name: 'Maria Silva Santos', cpf: '123.456.789-00', phone: '(11) 98765-4321', email: 'maria@email.com', birthDate: '1985-03-15', insurance: 'Bradesco Dental', lastVisit: '2024-01-10', nextVisit: '2024-02-15', status: 'active', allergies: ['Penicilina'], notes: 'Paciente com ansiedade. Preferência por atendimento matutino.', totalSpent: 4850, treatmentsCount: 3 },
  { id: '2', name: 'João Pedro Oliveira', cpf: '987.654.321-00', phone: '(11) 97654-3210', email: 'joao@email.com', birthDate: '1990-07-22', insurance: 'Amil Dental', lastVisit: '2024-01-08', nextVisit: '2024-01-25', status: 'active', allergies: [], notes: 'Paciente pontual. Em tratamento ortodôntico.', totalSpent: 12300, treatmentsCount: 5 },
  { id: '3', name: 'Ana Carolina Ferreira', cpf: '456.789.123-00', phone: '(11) 96543-2109', email: 'ana@email.com', birthDate: '1978-11-03', insurance: 'Particular', lastVisit: '2024-01-12', nextVisit: '2024-02-01', status: 'active', allergies: ['Latex', 'Dipirona'], notes: 'Paciente com histórico de problemas periodontais.', totalSpent: 8900, treatmentsCount: 7 },
  { id: '4', name: 'Carlos Eduardo Lima', cpf: '321.654.987-00', phone: '(11) 95432-1098', email: 'carlos@email.com', birthDate: '1995-05-18', insurance: 'SulAmérica', lastVisit: '2023-12-20', nextVisit: '2024-01-30', status: 'active', allergies: [], notes: 'Retorno para avaliação de implante.', totalSpent: 15600, treatmentsCount: 4 },
  { id: '5', name: 'Fernanda Costa Souza', cpf: '654.987.321-00', phone: '(11) 94321-0987', email: 'fernanda@email.com', birthDate: '1988-09-28', insurance: 'Particular', lastVisit: '2023-11-15', nextVisit: '', status: 'inactive', allergies: ['Ibuprofeno'], notes: 'Paciente não compareceu às últimas 2 consultas.', totalSpent: 2300, treatmentsCount: 2 },
  { id: '6', name: 'Roberto Almeida Neto', cpf: '789.123.456-00', phone: '(11) 93210-9876', email: 'roberto@email.com', birthDate: '1972-01-30', insurance: 'Unimed', lastVisit: '2024-01-14', nextVisit: '2024-02-10', status: 'active', allergies: [], notes: 'Tratamento de canal em andamento. Dente 36.', totalSpent: 6700, treatmentsCount: 6 },
  { id: '7', name: 'Patricia Mendes Rocha', cpf: '147.258.369-00', phone: '(11) 92109-8765', email: 'patricia@email.com', birthDate: '1993-12-05', insurance: 'Bradesco Dental', lastVisit: '2024-01-11', nextVisit: '2024-01-28', status: 'active', allergies: [], notes: 'Clareamento dental em andamento.', totalSpent: 3200, treatmentsCount: 2 },
  { id: '8', name: 'Lucas Barbosa Dias', cpf: '258.369.147-00', phone: '(11) 91098-7654', email: 'lucas@email.com', birthDate: '2000-04-12', insurance: 'Particular', lastVisit: '2024-01-09', nextVisit: '2024-02-05', status: 'active', allergies: ['Amoxicilina'], notes: 'Paciente jovem, extração de sisos agendada.', totalSpent: 1800, treatmentsCount: 1 },
  { id: '9', name: 'Juliana Ribeiro Santos', cpf: '369.147.258-00', phone: '(11) 90987-6543', email: 'juliana@email.com', birthDate: '1982-08-20', insurance: 'Amil Dental', lastVisit: '2023-12-28', nextVisit: '2024-02-20', status: 'active', allergies: [], notes: 'Prótese fixa superior. Acompanhamento semestral.', totalSpent: 22500, treatmentsCount: 8 },
  { id: '10', name: 'Marcos Vinícius Gomes', cpf: '741.852.963-00', phone: '(11) 99876-5432', email: 'marcos@email.com', birthDate: '1997-02-14', insurance: 'Particular', lastVisit: '2024-01-13', nextVisit: '2024-01-27', status: 'active', allergies: [], notes: 'Facetas em porcelana – dentes 11 a 21.', totalSpent: 18000, treatmentsCount: 3 },
];

export const professionals = [
  { id: '1', name: 'Dra. Camila Rocha', specialty: 'Ortodontia', color: '#6366f1', avatar: 'CR' },
  { id: '2', name: 'Dr. Rafael Santos', specialty: 'Implantodontia', color: '#06b6d4', avatar: 'RS' },
  { id: '3', name: 'Dra. Beatriz Lima', specialty: 'Endodontia', color: '#f59e0b', avatar: 'BL' },
  { id: '4', name: 'Dr. Thiago Mendes', specialty: 'Clínica Geral', color: '#10b981', avatar: 'TM' },
];

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, days: number) => { const r = new Date(d); r.setDate(r.getDate() + days); return r; };

export const appointments: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'Maria Silva Santos', professionalId: '1', professionalName: 'Dra. Camila Rocha', date: formatDate(today), startTime: '08:00', endTime: '09:00', status: 'confirmed', treatment: 'Manutenção Ortodôntica', room: 'Sala 1', color: '#6366f1' },
  { id: '2', patientId: '2', patientName: 'João Pedro Oliveira', professionalId: '2', professionalName: 'Dr. Rafael Santos', date: formatDate(today), startTime: '08:30', endTime: '10:00', status: 'confirmed', treatment: 'Avaliação Implante', room: 'Sala 2', color: '#06b6d4' },
  { id: '3', patientId: '3', patientName: 'Ana Carolina Ferreira', professionalId: '3', professionalName: 'Dra. Beatriz Lima', date: formatDate(today), startTime: '09:00', endTime: '10:30', status: 'pending', treatment: 'Tratamento de Canal', room: 'Sala 3', color: '#f59e0b' },
  { id: '4', patientId: '7', patientName: 'Patricia Mendes Rocha', professionalId: '4', professionalName: 'Dr. Thiago Mendes', date: formatDate(today), startTime: '10:00', endTime: '11:00', status: 'confirmed', treatment: 'Clareamento', room: 'Sala 1', color: '#10b981' },
  { id: '5', patientId: '8', patientName: 'Lucas Barbosa Dias', professionalId: '2', professionalName: 'Dr. Rafael Santos', date: formatDate(today), startTime: '11:00', endTime: '12:30', status: 'pending', treatment: 'Extração Siso', room: 'Sala 2', color: '#06b6d4' },
  { id: '6', patientId: '10', patientName: 'Marcos Vinícius Gomes', professionalId: '1', professionalName: 'Dra. Camila Rocha', date: formatDate(today), startTime: '13:00', endTime: '14:30', status: 'confirmed', treatment: 'Facetas Porcelana', room: 'Sala 1', color: '#6366f1' },
  { id: '7', patientId: '6', patientName: 'Roberto Almeida Neto', professionalId: '3', professionalName: 'Dra. Beatriz Lima', date: formatDate(today), startTime: '14:00', endTime: '15:30', status: 'confirmed', treatment: 'Retratamento Canal', room: 'Sala 3', color: '#f59e0b' },
  { id: '8', patientId: '9', patientName: 'Juliana Ribeiro Santos', professionalId: '4', professionalName: 'Dr. Thiago Mendes', date: formatDate(today), startTime: '15:00', endTime: '16:00', status: 'confirmed', treatment: 'Revisão Prótese', room: 'Sala 1', color: '#10b981' },
  { id: '9', patientId: '4', patientName: 'Carlos Eduardo Lima', professionalId: '2', professionalName: 'Dr. Rafael Santos', date: formatDate(today), startTime: '16:00', endTime: '17:30', status: 'pending', treatment: 'Cirurgia Implante', room: 'Sala 2', color: '#06b6d4' },
  { id: '10', patientId: '1', patientName: 'Maria Silva Santos', professionalId: '1', professionalName: 'Dra. Camila Rocha', date: formatDate(addDays(today, 1)), startTime: '08:00', endTime: '09:00', status: 'confirmed', treatment: 'Ajuste Aparelho', room: 'Sala 1', color: '#6366f1' },
  { id: '11', patientId: '5', patientName: 'Fernanda Costa Souza', professionalId: '4', professionalName: 'Dr. Thiago Mendes', date: formatDate(addDays(today, 1)), startTime: '09:00', endTime: '10:00', status: 'pending', treatment: 'Limpeza', room: 'Sala 1', color: '#10b981' },
  { id: '12', patientId: '3', patientName: 'Ana Carolina Ferreira', professionalId: '3', professionalName: 'Dra. Beatriz Lima', date: formatDate(addDays(today, 1)), startTime: '10:00', endTime: '11:30', status: 'confirmed', treatment: 'Continuação Canal', room: 'Sala 3', color: '#f59e0b' },
  { id: '13', patientId: '2', patientName: 'João Pedro Oliveira', professionalId: '1', professionalName: 'Dra. Camila Rocha', date: formatDate(addDays(today, 2)), startTime: '08:30', endTime: '09:30', status: 'confirmed', treatment: 'Manutenção Ortodôntica', room: 'Sala 1', color: '#6366f1' },
  { id: '14', patientId: '10', patientName: 'Marcos Vinícius Gomes', professionalId: '1', professionalName: 'Dra. Camila Rocha', date: formatDate(addDays(today, 2)), startTime: '10:00', endTime: '12:00', status: 'confirmed', treatment: 'Prep. Facetas', room: 'Sala 1', color: '#6366f1' },
  { id: '15', patientId: '6', patientName: 'Roberto Almeida Neto', professionalId: '3', professionalName: 'Dra. Beatriz Lima', date: formatDate(addDays(today, 3)), startTime: '09:00', endTime: '10:30', status: 'pending', treatment: 'Finalização Canal', room: 'Sala 3', color: '#f59e0b' },
  { id: '16', patientId: '9', patientName: 'Juliana Ribeiro Santos', professionalId: '4', professionalName: 'Dr. Thiago Mendes', date: formatDate(addDays(today, 3)), startTime: '14:00', endTime: '15:00', status: 'confirmed', treatment: 'Ajuste Prótese', room: 'Sala 1', color: '#10b981' },
  { id: '17', patientId: '4', patientName: 'Carlos Eduardo Lima', professionalId: '2', professionalName: 'Dr. Rafael Santos', date: formatDate(addDays(today, 4)), startTime: '08:00', endTime: '10:00', status: 'confirmed', treatment: 'Implante Fase 2', room: 'Sala 2', color: '#06b6d4' },
  { id: '18', patientId: '7', patientName: 'Patricia Mendes Rocha', professionalId: '4', professionalName: 'Dr. Thiago Mendes', date: formatDate(addDays(today, 4)), startTime: '11:00', endTime: '12:00', status: 'pending', treatment: 'Moldagem', room: 'Sala 1', color: '#10b981' },
];

export const pipelineStages = [
  { id: 'lead_novo', name: 'Lead Novo', color: '#94a3b8' },
  { id: 'avaliacao_agendada', name: 'Avaliação Agendada', color: '#6366f1' },
  { id: 'avaliacao_realizada', name: 'Avaliação Realizada', color: '#8b5cf6' },
  { id: 'orcamento_enviado', name: 'Orçamento Enviado', color: '#f59e0b' },
  { id: 'negociacao', name: 'Negociação', color: '#f97316' },
  { id: 'fechado', name: 'Fechado ✓', color: '#10b981' },
  { id: 'perdido', name: 'Perdido', color: '#ef4444' },
];

export const pipelineCards: PipelineCard[] = [
  { id: 'p1', patientName: 'Ricardo Moraes', treatment: 'Implante Dentário', value: 8500, stage: 'lead_novo', professionalName: 'Dr. Rafael Santos', createdAt: '2024-01-14', phone: '(11) 98888-1111', daysInStage: 2 },
  { id: 'p2', patientName: 'Camila Souza', treatment: 'Ortodontia', value: 6000, stage: 'lead_novo', professionalName: 'Dra. Camila Rocha', createdAt: '2024-01-13', phone: '(11) 98888-2222', daysInStage: 3 },
  { id: 'p3', patientName: 'André Luiz Costa', treatment: 'Prótese Total', value: 12000, stage: 'avaliacao_agendada', professionalName: 'Dr. Rafael Santos', createdAt: '2024-01-10', phone: '(11) 98888-3333', daysInStage: 5 },
  { id: 'p4', patientName: 'Luísa Fernandes', treatment: 'Facetas', value: 15000, stage: 'avaliacao_agendada', professionalName: 'Dra. Camila Rocha', createdAt: '2024-01-11', phone: '(11) 98888-4444', daysInStage: 4 },
  { id: 'p5', patientName: 'Bruno Henrique Silva', treatment: 'Implante + Coroa', value: 9800, stage: 'avaliacao_realizada', professionalName: 'Dr. Rafael Santos', createdAt: '2024-01-08', phone: '(11) 98888-5555', daysInStage: 7 },
  { id: 'p6', patientName: 'Tatiane Oliveira', treatment: 'Clareamento + Facetas', value: 11500, stage: 'orcamento_enviado', professionalName: 'Dra. Camila Rocha', createdAt: '2024-01-06', phone: '(11) 98888-6666', daysInStage: 9 },
  { id: 'p7', patientName: 'Felipe Martins', treatment: 'Reabilitação Oral', value: 25000, stage: 'orcamento_enviado', professionalName: 'Dr. Rafael Santos', createdAt: '2024-01-05', phone: '(11) 98888-7777', daysInStage: 10 },
  { id: 'p8', patientName: 'Renata Pires', treatment: 'Ortodontia Invisível', value: 8000, stage: 'negociacao', professionalName: 'Dra. Camila Rocha', createdAt: '2024-01-03', phone: '(11) 98888-8888', daysInStage: 12 },
  { id: 'p9', patientName: 'Diego Nascimento', treatment: 'Implantes (4)', value: 32000, stage: 'negociacao', professionalName: 'Dr. Rafael Santos', createdAt: '2024-01-02', phone: '(11) 98888-9999', daysInStage: 13 },
  { id: 'p10', patientName: 'Sandra Alves', treatment: 'Prótese Fixa', value: 7500, stage: 'fechado', professionalName: 'Dr. Rafael Santos', createdAt: '2023-12-28', phone: '(11) 97777-1111', daysInStage: 0 },
  { id: 'p11', patientName: 'Gustavo Lima', treatment: 'Coroa Porcelana', value: 3500, stage: 'fechado', professionalName: 'Dra. Beatriz Lima', createdAt: '2023-12-25', phone: '(11) 97777-2222', daysInStage: 0 },
  { id: 'p12', patientName: 'Aline Duarte', treatment: 'Ortodontia', value: 5500, stage: 'perdido', professionalName: 'Dra. Camila Rocha', createdAt: '2023-12-20', phone: '(11) 97777-3333', daysInStage: 0 },
];

export const transactions: Transaction[] = [
  { id: 't1', type: 'income', category: 'Consulta', description: 'Manutenção ortodôntica', value: 350, date: '2024-01-15', status: 'paid', patientName: 'Maria Silva Santos' },
  { id: 't2', type: 'income', category: 'Procedimento', description: 'Implante dentário – parcela 2/6', value: 1416.67, date: '2024-01-14', status: 'paid', patientName: 'Carlos Eduardo Lima' },
  { id: 't3', type: 'income', category: 'Procedimento', description: 'Tratamento de canal', value: 1200, date: '2024-01-13', status: 'paid', patientName: 'Ana Carolina Ferreira' },
  { id: 't4', type: 'expense', category: 'Material', description: 'Resina composta 3M', value: 850, date: '2024-01-13', status: 'paid' },
  { id: 't5', type: 'income', category: 'Procedimento', description: 'Clareamento dental', value: 1500, date: '2024-01-12', status: 'paid', patientName: 'Patricia Mendes Rocha' },
  { id: 't6', type: 'expense', category: 'Aluguel', description: 'Aluguel sala comercial', value: 4500, date: '2024-01-10', status: 'paid' },
  { id: 't7', type: 'income', category: 'Procedimento', description: 'Facetas – parcela 1/10', value: 1800, date: '2024-01-10', status: 'paid', patientName: 'Marcos Vinícius Gomes' },
  { id: 't8', type: 'expense', category: 'Funcionário', description: 'Salário auxiliar', value: 2800, date: '2024-01-05', status: 'paid' },
  { id: 't9', type: 'income', category: 'Consulta', description: 'Avaliação ortodôntica', value: 200, date: '2024-01-05', status: 'paid', patientName: 'João Pedro Oliveira' },
  { id: 't10', type: 'income', category: 'Procedimento', description: 'Prótese fixa – parcela 3/8', value: 2812.50, date: '2024-01-04', status: 'pending', patientName: 'Juliana Ribeiro Santos' },
  { id: 't11', type: 'expense', category: 'Material', description: 'Luvas e EPIs', value: 380, date: '2024-01-03', status: 'paid' },
  { id: 't12', type: 'income', category: 'Procedimento', description: 'Extração simples', value: 450, date: '2024-01-03', status: 'overdue', patientName: 'Lucas Barbosa Dias' },
  { id: 't13', type: 'expense', category: 'Marketing', description: 'Google Ads – Janeiro', value: 1200, date: '2024-01-01', status: 'paid' },
  { id: 't14', type: 'expense', category: 'Software', description: 'Licença software RX digital', value: 350, date: '2024-01-01', status: 'paid' },
  { id: 't15', type: 'income', category: 'Procedimento', description: 'Limpeza e profilaxia', value: 280, date: '2024-01-02', status: 'paid', patientName: 'Roberto Almeida Neto' },
];

export const treatmentTypes: TreatmentType[] = [
  { id: 'tr1', name: 'Limpeza e Profilaxia', category: 'Preventivo', price: 280, duration: 45, description: 'Remoção de tártaro e polimento dental', popularity: 95 },
  { id: 'tr2', name: 'Restauração Resina', category: 'Restaurador', price: 350, duration: 60, description: 'Restauração com resina composta fotopolimerizável', popularity: 88 },
  { id: 'tr3', name: 'Tratamento de Canal', category: 'Endodontia', price: 1200, duration: 90, description: 'Tratamento endodôntico completo', popularity: 72 },
  { id: 'tr4', name: 'Extração Simples', category: 'Cirurgia', price: 450, duration: 45, description: 'Exodontia de dente erupcionado', popularity: 65 },
  { id: 'tr5', name: 'Extração Siso', category: 'Cirurgia', price: 800, duration: 90, description: 'Exodontia de terceiro molar incluso', popularity: 58 },
  { id: 'tr6', name: 'Implante Unitário', category: 'Implantodontia', price: 3500, duration: 120, description: 'Implante osseointegrado unitário com coroa', popularity: 82 },
  { id: 'tr7', name: 'Clareamento Dental', category: 'Estético', price: 1500, duration: 60, description: 'Clareamento dental a laser em consultório', popularity: 90 },
  { id: 'tr8', name: 'Faceta Porcelana', category: 'Estético', price: 2500, duration: 90, description: 'Laminado cerâmico por elemento', popularity: 78 },
  { id: 'tr9', name: 'Ortodontia Convencional', category: 'Ortodontia', price: 5500, duration: 30, description: 'Aparelho fixo metálico – tratamento completo', popularity: 85 },
  { id: 'tr10', name: 'Ortodontia Invisível', category: 'Ortodontia', price: 8000, duration: 30, description: 'Alinhadores transparentes – tratamento completo', popularity: 70 },
  { id: 'tr11', name: 'Prótese Total', category: 'Prótese', price: 3000, duration: 60, description: 'Prótese total superior ou inferior', popularity: 55 },
  { id: 'tr12', name: 'Coroa Porcelana', category: 'Prótese', price: 1800, duration: 60, description: 'Coroa unitária em porcelana sobre metal', popularity: 75 },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'appointment', title: 'Consulta Confirmada', message: 'Maria Silva Santos confirmou a consulta de amanhã às 08:00', time: '5 min atrás', read: false },
  { id: 'n2', type: 'payment', title: 'Pagamento Recebido', message: 'Parcela 2/6 do implante de Carlos Eduardo – R$ 1.416,67', time: '15 min atrás', read: false },
  { id: 'n3', type: 'lead', title: 'Novo Lead', message: 'Ricardo Moraes se interessou por implante dentário via Instagram', time: '1h atrás', read: false },
  { id: 'n4', type: 'system', title: 'Backup Realizado', message: 'Backup automático concluído com sucesso', time: '2h atrás', read: true },
  { id: 'n5', type: 'appointment', title: 'Paciente Faltou', message: 'Fernanda Costa Souza não compareceu à consulta das 14:00', time: '3h atrás', read: true },
  { id: 'n6', type: 'birthday', title: '🎂 Aniversário', message: 'João Pedro Oliveira faz aniversário hoje! Enviar mensagem?', time: '6h atrás', read: true },
  { id: 'n7', type: 'payment', title: 'Pagamento Atrasado', message: 'Lucas Barbosa Dias com parcela vencida há 5 dias – R$ 450,00', time: '1 dia atrás', read: true },
  { id: 'n8', type: 'lead', title: 'Lead Convertido', message: 'Sandra Alves fechou tratamento de prótese fixa – R$ 7.500', time: '1 dia atrás', read: true },
];

export const revenueData = [
  { month: 'Ago', value: 62000 },
  { month: 'Set', value: 58000 },
  { month: 'Out', value: 71000 },
  { month: 'Nov', value: 68500 },
  { month: 'Dez', value: 82000 },
  { month: 'Jan', value: 87450 },
];

export const revenueByProfessional = [
  { name: 'Dra. Camila Rocha', value: 28500, percentage: 33 },
  { name: 'Dr. Rafael Santos', value: 31200, percentage: 36 },
  { name: 'Dra. Beatriz Lima', value: 15800, percentage: 18 },
  { name: 'Dr. Thiago Mendes', value: 11950, percentage: 13 },
];
