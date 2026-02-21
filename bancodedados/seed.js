const mongoose = require('mongoose');
const connectDB = require('./connection');
const Clinic = require('./models/Clinic');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Treatment = require('./models/Treatment');
const Appointment = require('./models/Appointment');
const Lead = require('./models/Lead');
const Transaction = require('./models/Transaction');
const Notification = require('./models/Notification');
const Automation = require('./models/Automation');

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Iniciando seed do banco de dados...');

    // Clear all collections
    await Promise.all([
      Clinic.deleteMany({}), User.deleteMany({}), Patient.deleteMany({}),
      Treatment.deleteMany({}), Appointment.deleteMany({}), Lead.deleteMany({}),
      Transaction.deleteMany({}), Notification.deleteMany({}), Automation.deleteMany({})
    ]);

    // Create Clinic
    const clinic = await Clinic.create({
      name: 'OdontoPro Clínica',
      cnpj: '12.345.678/0001-90',
      email: 'contato@odontopro.com',
      phone: '(11) 99999-0000',
      address: {
        street: 'Rua das Flores', number: '123', neighborhood: 'Centro',
        city: 'São Paulo', state: 'SP', zipCode: '01001-000'
      },
      plan: 'pro',
      settings: {
        workingHours: { start: '08:00', end: '18:00' },
        slotDuration: 30,
        rooms: [
          { name: 'Sala 1', active: true },
          { name: 'Sala 2', active: true },
          { name: 'Sala 3', active: true }
        ]
      }
    });

    // Create Users
    const admin = await User.create({
      clinicId: clinic._id, name: 'Dr. Admin', email: 'admin@odontopro.com',
      password: 'admin123', phone: '(11) 99999-0001', role: 'admin', color: '#3B82F6', active: true
    });

    const dentist1 = await User.create({
      clinicId: clinic._id, name: 'Dra. Ana Silva', email: 'ana@odontopro.com',
      password: 'ana123', phone: '(11) 99999-0002', role: 'dentist',
      specialty: 'Ortodontia', cro: 'CRO-SP 12345', color: '#8B5CF6', active: true
    });

    const dentist2 = await User.create({
      clinicId: clinic._id, name: 'Dr. Carlos Santos', email: 'carlos@odontopro.com',
      password: 'carlos123', phone: '(11) 99999-0003', role: 'dentist',
      specialty: 'Implantodontia', cro: 'CRO-SP 23456', color: '#10B981', active: true
    });

    const secretary = await User.create({
      clinicId: clinic._id, name: 'Maria Oliveira', email: 'maria@odontopro.com',
      password: 'maria123', phone: '(11) 99999-0004', role: 'secretary', color: '#F59E0B', active: true
    });

    const financial = await User.create({
      clinicId: clinic._id, name: 'João Finanças', email: 'joao@odontopro.com',
      password: 'joao123', phone: '(11) 99999-0005', role: 'financial', color: '#EF4444', active: true
    });

    // Create Treatments
    const treatments = await Treatment.insertMany([
      { clinicId: clinic._id, name: 'Limpeza Dental', category: 'preventive', description: 'Profilaxia completa com ultrassom', price: 250, duration: 45, popularity: 92, sessionsRequired: 1 },
      { clinicId: clinic._id, name: 'Restauração Resina', category: 'restorative', description: 'Restauração em resina composta', price: 350, duration: 60, popularity: 85, sessionsRequired: 1 },
      { clinicId: clinic._id, name: 'Canal Unitário', category: 'endodontics', description: 'Tratamento endodôntico de canal único', price: 800, duration: 90, popularity: 70, sessionsRequired: 2 },
      { clinicId: clinic._id, name: 'Extração Simples', category: 'surgery', description: 'Extração de dente erupcionado', price: 400, duration: 45, popularity: 65, sessionsRequired: 1 },
      { clinicId: clinic._id, name: 'Aparelho Ortodôntico', category: 'orthodontics', description: 'Instalação de aparelho fixo metálico', price: 3500, duration: 60, popularity: 88, sessionsRequired: 24 },
      { clinicId: clinic._id, name: 'Clareamento', category: 'aesthetic', description: 'Clareamento dental a laser', price: 1200, duration: 90, popularity: 95, sessionsRequired: 3 },
      { clinicId: clinic._id, name: 'Prótese Total', category: 'prosthetics', description: 'Prótese total superior ou inferior', price: 2500, duration: 120, popularity: 55, sessionsRequired: 4 },
      { clinicId: clinic._id, name: 'Implante Dental', category: 'implants', description: 'Implante unitário com coroa', price: 4500, duration: 120, popularity: 78, sessionsRequired: 3 },
      { clinicId: clinic._id, name: 'Raspagem Periodontal', category: 'periodontics', description: 'Raspagem subgengival', price: 450, duration: 60, popularity: 60, sessionsRequired: 2 },
      { clinicId: clinic._id, name: 'Lente de Contato', category: 'aesthetic', description: 'Faceta em porcelana ultra-fina', price: 2800, duration: 90, popularity: 90, sessionsRequired: 3 },
      { clinicId: clinic._id, name: 'Aplicação de Flúor', category: 'preventive', description: 'Aplicação de flúor infantil', price: 120, duration: 20, popularity: 75, sessionsRequired: 1 },
      { clinicId: clinic._id, name: 'Coroa de Porcelana', category: 'prosthetics', description: 'Coroa unitária em porcelana', price: 1800, duration: 90, popularity: 72, sessionsRequired: 3 }
    ]);

    // Create Patients
    const patients = await Patient.insertMany([
      {
        clinicId: clinic._id, name: 'Lucas Mendes', cpf: '123.456.789-00',
        birthDate: new Date('1990-05-15'), phone: '(11) 98765-4321', email: 'lucas@email.com',
        insurance: 'Amil Dental', status: 'active',
        allergies: ['Dipirona', 'Látex'], medicalNotes: 'Hipertensão controlada',
        totalSpent: 4500, lastVisit: new Date('2024-01-10')
      },
      {
        clinicId: clinic._id, name: 'Mariana Costa', cpf: '987.654.321-00',
        birthDate: new Date('1985-08-22'), phone: '(11) 91234-5678', email: 'mariana@email.com',
        insurance: 'Bradesco Dental', status: 'active',
        allergies: ['Penicilina'], medicalNotes: 'Gestante - 6 meses',
        totalSpent: 3200, lastVisit: new Date('2024-01-15')
      },
      {
        clinicId: clinic._id, name: 'Pedro Alves', cpf: '456.789.123-00',
        birthDate: new Date('1978-03-10'), phone: '(11) 94567-8901', email: 'pedro@email.com',
        insurance: 'SulAmérica', status: 'active',
        allergies: [], medicalNotes: 'Diabético tipo 2',
        totalSpent: 8900, lastVisit: new Date('2024-01-20')
      },
      {
        clinicId: clinic._id, name: 'Juliana Ferreira', cpf: '321.654.987-00',
        birthDate: new Date('1995-11-30'), phone: '(11) 92345-6789', email: 'juliana@email.com',
        insurance: 'Particular', status: 'active',
        allergies: ['Ibuprofeno'], medicalNotes: '',
        totalSpent: 1500, lastVisit: new Date('2024-01-05')
      },
      {
        clinicId: clinic._id, name: 'Roberto Silva', cpf: '654.987.321-00',
        birthDate: new Date('1968-07-18'), phone: '(11) 93456-7890', email: 'roberto@email.com',
        insurance: 'Unimed', status: 'active',
        allergies: [], medicalNotes: 'Uso de anticoagulante',
        totalSpent: 12000, lastVisit: new Date('2024-02-01')
      },
      {
        clinicId: clinic._id, name: 'Camila Santos', cpf: '789.123.456-00',
        birthDate: new Date('2000-01-25'), phone: '(11) 95678-9012', email: 'camila@email.com',
        insurance: 'Particular', status: 'active',
        allergies: [], medicalNotes: '',
        totalSpent: 800, lastVisit: new Date('2023-12-15')
      },
      {
        clinicId: clinic._id, name: 'Fernando Lima', cpf: '159.753.486-00',
        birthDate: new Date('1982-09-14'), phone: '(11) 96789-0123', email: 'fernando@email.com',
        status: 'inactive', allergies: ['Anestésico local'],
        totalSpent: 2100, lastVisit: new Date('2023-06-20')
      },
      {
        clinicId: clinic._id, name: 'Beatriz Rocha', cpf: '753.159.852-00',
        birthDate: new Date('1992-04-08'), phone: '(11) 97890-1234', email: 'beatriz@email.com',
        insurance: 'Porto Seguro', status: 'active',
        allergies: [], medicalNotes: 'Ansiedade dental severa',
        totalSpent: 5600, lastVisit: new Date('2024-01-25')
      }
    ]);

    // Create Appointments
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

    await Appointment.insertMany([
      { clinicId: clinic._id, patientId: patients[0]._id, professionalId: dentist1._id, treatmentId: treatments[5]._id, date: today, startTime: '09:00', endTime: '10:00', room: 'Sala 1', status: 'confirmed', type: 'procedure', treatmentName: 'Clareamento', patientName: 'Lucas Mendes', professionalName: 'Dra. Ana Silva', professionalColor: '#8B5CF6', duration: 60, price: 1200 },
      { clinicId: clinic._id, patientId: patients[1]._id, professionalId: dentist2._id, treatmentId: treatments[0]._id, date: today, startTime: '10:00', endTime: '10:45', room: 'Sala 2', status: 'pending', type: 'consultation', treatmentName: 'Limpeza Dental', patientName: 'Mariana Costa', professionalName: 'Dr. Carlos Santos', professionalColor: '#10B981', duration: 45, price: 250 },
      { clinicId: clinic._id, patientId: patients[2]._id, professionalId: dentist1._id, treatmentId: treatments[4]._id, date: today, startTime: '11:00', endTime: '12:00', room: 'Sala 1', status: 'confirmed', type: 'procedure', treatmentName: 'Aparelho Ortodôntico', patientName: 'Pedro Alves', professionalName: 'Dra. Ana Silva', professionalColor: '#8B5CF6', duration: 60, price: 3500 },
      { clinicId: clinic._id, patientId: patients[3]._id, professionalId: dentist2._id, treatmentId: treatments[1]._id, date: today, startTime: '14:00', endTime: '15:00', room: 'Sala 2', status: 'confirmed', type: 'procedure', treatmentName: 'Restauração Resina', patientName: 'Juliana Ferreira', professionalName: 'Dr. Carlos Santos', professionalColor: '#10B981', duration: 60, price: 350 },
      { clinicId: clinic._id, patientId: patients[4]._id, professionalId: dentist1._id, treatmentId: treatments[7]._id, date: tomorrow, startTime: '09:00', endTime: '11:00', room: 'Sala 1', status: 'pending', type: 'procedure', treatmentName: 'Implante Dental', patientName: 'Roberto Silva', professionalName: 'Dra. Ana Silva', professionalColor: '#8B5CF6', duration: 120, price: 4500 },
      { clinicId: clinic._id, patientId: patients[5]._id, professionalId: dentist2._id, treatmentId: treatments[9]._id, date: tomorrow, startTime: '10:00', endTime: '11:30', room: 'Sala 2', status: 'confirmed', type: 'evaluation', treatmentName: 'Lente de Contato', patientName: 'Camila Santos', professionalName: 'Dr. Carlos Santos', professionalColor: '#10B981', duration: 90, price: 2800 },
      { clinicId: clinic._id, patientId: patients[7]._id, professionalId: dentist1._id, treatmentId: treatments[2]._id, date: nextWeek, startTime: '08:00', endTime: '09:30', room: 'Sala 1', status: 'pending', type: 'procedure', treatmentName: 'Canal Unitário', patientName: 'Beatriz Rocha', professionalName: 'Dra. Ana Silva', professionalColor: '#8B5CF6', duration: 90, price: 800 }
    ]);

    // Create Leads
    await Lead.insertMany([
      { clinicId: clinic._id, patientName: 'Ana Beatriz Souza', phone: '(11) 91111-2222', treatment: 'Implante Dental', value: 4500, stage: 'new_lead', professional: 'Dra. Ana Silva', professionalId: dentist1._id, professionalColor: '#8B5CF6', source: 'instagram', daysInStage: 2 },
      { clinicId: clinic._id, patientName: 'Ricardo Mendonça', phone: '(11) 92222-3333', treatment: 'Clareamento', value: 1200, stage: 'evaluation_scheduled', professional: 'Dr. Carlos Santos', professionalId: dentist2._id, professionalColor: '#10B981', source: 'google', daysInStage: 5 },
      { clinicId: clinic._id, patientName: 'Patrícia Lima', phone: '(11) 93333-4444', treatment: 'Lente de Contato', value: 16800, stage: 'budget_sent', professional: 'Dra. Ana Silva', professionalId: dentist1._id, professionalColor: '#8B5CF6', source: 'referral', daysInStage: 3 },
      { clinicId: clinic._id, patientName: 'Marcos Tavares', phone: '(11) 94444-5555', treatment: 'Aparelho Ortodôntico', value: 3500, stage: 'negotiation', professional: 'Dr. Carlos Santos', professionalId: dentist2._id, professionalColor: '#10B981', source: 'website', daysInStage: 7 },
      { clinicId: clinic._id, patientName: 'Larissa Gomes', phone: '(11) 95555-6666', treatment: 'Prótese Total', value: 2500, stage: 'closed_won', professional: 'Dra. Ana Silva', professionalId: dentist1._id, professionalColor: '#8B5CF6', source: 'walkin', daysInStage: 0 },
      { clinicId: clinic._id, patientName: 'Gustavo Pereira', phone: '(11) 96666-7777', treatment: 'Canal Unitário', value: 800, stage: 'evaluation_done', professional: 'Dr. Carlos Santos', professionalId: dentist2._id, professionalColor: '#10B981', source: 'facebook', daysInStage: 1 },
      { clinicId: clinic._id, patientName: 'Isabela Martins', phone: '(11) 97777-8888', treatment: 'Clareamento', value: 1200, stage: 'closed_lost', professional: 'Dra. Ana Silva', professionalId: dentist1._id, professionalColor: '#8B5CF6', source: 'instagram', lostReason: 'Preço alto', daysInStage: 0 }
    ]);

    // Create Transactions
    const lastMonth = new Date(); lastMonth.setMonth(lastMonth.getMonth() - 1);
    await Transaction.insertMany([
      { clinicId: clinic._id, type: 'income', category: 'treatment', description: 'Clareamento - Lucas Mendes', amount: 1200, date: today, status: 'paid', paymentMethod: 'pix', patientId: patients[0]._id, patientName: 'Lucas Mendes', professionalId: dentist1._id, professionalName: 'Dra. Ana Silva' },
      { clinicId: clinic._id, type: 'income', category: 'treatment', description: 'Implante - Roberto Silva', amount: 4500, date: lastMonth, status: 'paid', paymentMethod: 'credit_card', patientId: patients[4]._id, patientName: 'Roberto Silva', professionalId: dentist1._id, professionalName: 'Dra. Ana Silva', installment: { current: 1, total: 10 } },
      { clinicId: clinic._id, type: 'income', category: 'consultation', description: 'Avaliação - Camila Santos', amount: 150, date: today, status: 'pending', paymentMethod: 'pix', patientId: patients[5]._id, patientName: 'Camila Santos', professionalId: dentist2._id, professionalName: 'Dr. Carlos Santos' },
      { clinicId: clinic._id, type: 'income', category: 'treatment', description: 'Limpeza - Mariana Costa', amount: 250, date: today, status: 'paid', paymentMethod: 'debit_card', patientId: patients[1]._id, patientName: 'Mariana Costa', professionalId: dentist2._id, professionalName: 'Dr. Carlos Santos' },
      { clinicId: clinic._id, type: 'expense', category: 'salary', description: 'Salário - Maria Oliveira', amount: 3500, date: lastMonth, status: 'paid', paymentMethod: 'transfer' },
      { clinicId: clinic._id, type: 'expense', category: 'rent', description: 'Aluguel consultório', amount: 5000, date: lastMonth, status: 'paid', paymentMethod: 'boleto' },
      { clinicId: clinic._id, type: 'expense', category: 'supplies', description: 'Material odontológico', amount: 2200, date: today, status: 'paid', paymentMethod: 'pix' },
      { clinicId: clinic._id, type: 'income', category: 'treatment', description: 'Restauração - Juliana Ferreira', amount: 350, date: today, status: 'pending', paymentMethod: 'boleto', patientId: patients[3]._id, patientName: 'Juliana Ferreira', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { clinicId: clinic._id, type: 'income', category: 'treatment', description: 'Aparelho - Pedro Alves', amount: 350, date: lastMonth, status: 'overdue', paymentMethod: 'boleto', patientId: patients[2]._id, patientName: 'Pedro Alves', dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { clinicId: clinic._id, type: 'expense', category: 'marketing', description: 'Google Ads', amount: 1500, date: lastMonth, status: 'paid', paymentMethod: 'credit_card' }
    ]);

    // Create Notifications
    await Notification.insertMany([
      { clinicId: clinic._id, userId: admin._id, type: 'appointment', title: 'Consulta em 30min', message: 'Lucas Mendes - Clareamento às 09:00', priority: 'high' },
      { clinicId: clinic._id, userId: admin._id, type: 'payment', title: 'Pagamento recebido', message: 'PIX de R$ 1.200 - Lucas Mendes', priority: 'medium' },
      { clinicId: clinic._id, userId: admin._id, type: 'lead', title: 'Novo lead recebido', message: 'Ana Beatriz Souza via Instagram - Implante', priority: 'high' },
      { clinicId: clinic._id, userId: admin._id, type: 'system', title: 'Backup realizado', message: 'Backup automático concluído com sucesso', priority: 'low', read: true },
      { clinicId: clinic._id, userId: admin._id, type: 'birthday', title: '🎂 Aniversário hoje!', message: 'Camila Santos faz aniversário hoje', priority: 'medium' },
      { clinicId: clinic._id, userId: admin._id, type: 'payment', title: 'Pagamento vencido', message: 'Boleto de Pedro Alves venceu há 15 dias - R$ 350', priority: 'urgent' }
    ]);

    // Create Automations
    await Automation.insertMany([
      { clinicId: clinic._id, name: 'Lembrete de Consulta (24h)', type: 'appointment_reminder', trigger: { event: 'appointment_upcoming', schedule: '24h_before' }, action: { type: 'whatsapp', template: 'Olá {patientName}! Lembrando da sua consulta amanhã às {time}. Confirme respondendo SIM.' }, active: true, stats: { totalSent: 156, delivered: 150, opened: 142 } },
      { clinicId: clinic._id, name: 'Reativação (90 dias)', type: 'reactivation', trigger: { event: 'patient_inactive', conditions: { daysInactive: 90 } }, action: { type: 'whatsapp', template: 'Olá {patientName}! Faz tempo que não nos vemos. Que tal agendar uma avaliação?' }, active: true, stats: { totalSent: 45, delivered: 40, converted: 12 } },
      { clinicId: clinic._id, name: 'Feliz Aniversário', type: 'birthday', trigger: { event: 'patient_birthday', schedule: '09:00' }, action: { type: 'whatsapp', template: '🎂 Parabéns {patientName}! A OdontoPro deseja um feliz aniversário!' }, active: true, stats: { totalSent: 89, delivered: 85 } },
      { clinicId: clinic._id, name: 'Cobrança amigável', type: 'payment_reminder', trigger: { event: 'payment_overdue', conditions: { daysOverdue: 3 } }, action: { type: 'whatsapp', template: 'Olá {patientName}, notamos que há um pagamento pendente. Podemos ajudar?' }, active: true, stats: { totalSent: 34, delivered: 30, converted: 18 } },
      { clinicId: clinic._id, name: 'Follow-up pós procedimento', type: 'follow_up', trigger: { event: 'appointment_completed', delay: { value: 3, unit: 'days' } }, action: { type: 'whatsapp', template: 'Olá {patientName}! Como está se sentindo após o procedimento? Alguma dúvida?' }, active: true, stats: { totalSent: 67, delivered: 64 } }
    ]);

    console.log('✅ Seed concluído com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`  - 1 clínica`);
    console.log(`  - 5 usuários (admin, 2 dentistas, secretária, financeiro)`);
    console.log(`  - ${patients.length} pacientes`);
    console.log(`  - ${treatments.length} tratamentos`);
    console.log(`  - 7 agendamentos`);
    console.log(`  - 7 leads`);
    console.log(`  - 10 transações`);
    console.log(`  - 6 notificações`);
    console.log(`  - 5 automações`);
    console.log('\n🔑 Login: admin@odontopro.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

seed();
