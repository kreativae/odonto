export type Page = 'dashboard' | 'patients' | 'appointments' | 'pipeline' | 'financial' | 'treatments' | 'insights' | 'notifications' | 'settings';

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate: string;
  insurance: string;
  lastVisit: string;
  nextVisit: string;
  status: 'active' | 'inactive';
  allergies: string[];
  notes: string;
  totalSpent: number;
  treatmentsCount: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'missed';
  treatment: string;
  room: string;
  color: string;
}

export interface PipelineCard {
  id: string;
  patientName: string;
  treatment: string;
  value: number;
  stage: string;
  professionalName: string;
  createdAt: string;
  phone: string;
  daysInStage: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  value: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  patientName?: string;
}

export interface TreatmentType {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  popularity: number;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'lead' | 'system' | 'birthday';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}
