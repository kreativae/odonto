# 🔍 CHECKLIST COMPLETO – CONEXÕES FRONTEND ↔ BACKEND ↔ BANCO DE DADOS
## CRM Odonto Pro – Auditoria de Botões e Interações

**Data da Auditoria:** Janeiro 2025  
**Status Geral:** 🔴 Frontend usa dados MOCK locais. Backend construído mas NÃO conectado.

### Legenda
- 🟢 **CONECTADO** – Botão chama API → Backend → MongoDB  
- 🟡 **PARCIAL** – Lógica existe no frontend (local state) mas não chama API  
- 🔴 **DESCONECTADO** – Botão existe mas não faz nada ou usa mock data  
- ⚪ **VISUAL** – Botão decorativo / placeholder para futuro

---

## 📄 PÁGINA: LOGIN (`LoginPage.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Botão "Entrar"** | 🟡 | Valida campos localmente, simula delay, cria AuthUser local. NÃO chama `POST /api/auth/login` |
| 2 | **Botão "Google"** | ⚪ | Visual apenas. Não possui OAuth configurado |
| 3 | **Botão "Facebook"** | ⚪ | Visual apenas. Não possui OAuth configurado |
| 4 | **Link "Esqueceu a senha?"** | 🟡 | Navega para tela de forgot. NÃO chama `POST /api/auth/forgot-password` |
| 5 | **Botão "Enviar link de recuperação"** | 🟡 | Simula envio. NÃO envia email real |
| 6 | **Checkbox "Lembrar de mim"** | 🟡 | Salva flag no state, localStorage persiste auth, mas sem refresh token real |
| 7 | **Link "Cadastre-se grátis"** | 🟢 | Navegação local funciona |
| 8 | **Botão "Continuar" (Step 1)** | 🟡 | Valida campos localmente. NÃO verifica email duplicado no backend |
| 9 | **Botão "Continuar" (Step 2)** | 🟡 | Valida campos localmente. NÃO verifica CNPJ duplicado |
| 10 | **Seletor de Perfil (Admin/Dentista/etc)** | 🟡 | Salva no state local, não persiste |
| 11 | **Seletor de Plano (Starter/Pro/Enterprise)** | 🟡 | Salva no state local, não cria assinatura real |
| 12 | **Botão "Criar conta e começar"** | 🟡 | Simula criação. NÃO chama `POST /api/auth/register` |
| 13 | **Inputs de código de verificação (6 dígitos)** | 🟡 | Aceita qualquer código. NÃO valida com backend |
| 14 | **Botão "Verificar e entrar"** | 🟡 | Aceita qualquer código. NÃO chama verificação real |
| 15 | **Link "Reenviar código"** | ⚪ | Não faz nada |
| 16 | **Link "Trocar email"** | 🟢 | Navegação local funciona |
| 17 | **Links Termos/Privacidade/Suporte** | ⚪ | Não possuem destino |

**Rotas Backend existentes mas não chamadas:**
- `POST /api/auth/register` ✅ Existe
- `POST /api/auth/login` ✅ Existe  
- `GET /api/auth/me` ✅ Existe
- `POST /api/auth/forgot-password` ❌ Não existe
- `POST /api/auth/verify-email` ❌ Não existe

---

## 🏠 PÁGINA: HEADER / APP (`App.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Campo de busca global** | ⚪ | Input visual. Não busca nada no backend |
| 2 | **Botão de notificações (sino)** | 🟡 | Navega para página de notificações. Badge usa contagem do mockData |
| 3 | **Avatar do usuário (dropdown)** | 🟡 | Mostra menu. Dados vêm do AuthUser local |
| 4 | **"⚙️ Configurações" (menu)** | 🟢 | Navegação local funciona |
| 5 | **"👤 Meu Perfil" (menu)** | ⚪ | Não navega para nenhum lugar |
| 6 | **"🏥 Clínica" (menu)** | ⚪ | Não navega para nenhum lugar |
| 7 | **"Sair da conta"** | 🟡 | Limpa localStorage e state. NÃO chama `POST /api/auth/logout` |

---

## 📊 SIDEBAR (`Sidebar.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **9 itens de navegação** | 🟢 | Navegação local funciona (state) |
| 2 | **Botão Dark/Light Mode** | 🟢 | Funciona (localStorage + class toggle) |
| 3 | **Botão "Recolher"** | 🟢 | Funciona (state local) |
| 4 | **Botão Logout (sidebar)** | ⚪ | Ícone visual, não possui onClick |
| 5 | **Menu mobile (hamburger)** | 🟢 | Funciona (state local) |
| 6 | **Badge de notificações** | 🟡 | Conta do mockData, não do backend |

---

## 📈 PÁGINA: DASHBOARD (`Dashboard.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **4 Cards de métricas** | 🟡 | Dados calculados do mockData, não do `GET /api/dashboard/metrics` |
| 2 | **Gráfico de faturamento** | 🟡 | Dados do mockData.revenueData |
| 3 | **Receita por profissional** | 🟡 | Dados do mockData.revenueByProfessional |
| 4 | **Lista "Agenda de Hoje"** | 🟡 | Filtra mockData.appointments pela data atual |
| 5 | **Lista "Últimas Transações"** | 🟡 | Exibe mockData.transactions |
| 6 | **Resumo Pipeline** | 🟡 | Calcula de mockData.pipelineCards |
| 7 | **Cards "Insights da IA"** | 🟡 | Dados estáticos/calculados, nenhuma chamada API |

**Observação:** Dashboard é somente leitura. Nenhum botão de ação, apenas exibição de dados.
**Precisa:** `GET /api/dashboard/summary` (endpoint consolidado)

---

## 👥 PÁGINA: PACIENTES (`Patients.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Botão "Novo Paciente"** | 🟡 | Abre modal. Salva no state local (useState). NÃO chama `POST /api/patients` |
| 2 | **Campo de busca** | 🟡 | Filtra array local. NÃO chama `GET /api/patients?search=` |
| 3 | **Filtro "Todos/Ativos/Inativos"** | 🟡 | Filtra array local. NÃO chama `GET /api/patients?status=` |
| 4 | **Botão Filtro (ícone)** | ⚪ | Não faz nada |
| 5 | **Click no card do paciente** | 🟡 | Abre Quick View com dados do array local |
| 6 | **Botão "Editar" (Quick View)** | 🟡 | Abre modal de edição. Salva no state local. NÃO chama `PUT /api/patients/:id` |
| 7 | **Botão "WhatsApp" (Quick View)** | 🟢 | Abre wa.me com número do paciente (funciona) |
| 8 | **Botão "Copiar" (Quick View)** | 🟢 | Copia para clipboard (funciona) |
| 9 | **Botão "Agendar" (Quick View)** | 🟡 | Abre sub-panel. Salva com alert(). NÃO chama `POST /api/appointments` |
| 10 | **Botão "Prontuário" (Quick View)** | 🟡 | Abre sub-panel com dados mock hardcoded |
| 11 | **Botão "Financeiro" (Quick View)** | 🟡 | Abre sub-panel. Filtra mockData.transactions por nome |
| 12 | **Seletor de profissional (Agendar)** | 🟡 | State local |
| 13 | **Seletor de tratamento (Agendar)** | 🟡 | Lista do mockData.treatmentTypes |
| 14 | **Seletor de horário (Agendar)** | 🟡 | State local. NÃO verifica disponibilidade real |
| 15 | **Botão "Confirmar Agendamento"** | 🟡 | window.alert(). NÃO chama `POST /api/appointments` |
| 16 | **Tabs Prontuário (Anamnese/Evolução/Histórico/Exames)** | 🟡 | Navegação local. Dados hardcoded no componente |
| 17 | **Botão "Nova Evolução"** | ⚪ | Não faz nada (placeholder) |
| 18 | **Botão "Upload" (Exames)** | ⚪ | Não faz nada (sem integração S3/Storage) |
| 19 | **Botão "Adicionar Exame"** | ⚪ | Não faz nada (placeholder) |
| 20 | **Tabs Financeiro (Extrato/Pendentes/Resumo)** | 🟡 | Navegação local. Dados do mockData |
| 21 | **Botão "Marcar Pago"** | ⚪ | Não faz nada. NÃO chama `PUT /api/financial/:id` |
| 22 | **Botão WhatsApp (cobrança)** | ⚪ | Não faz nada |
| 23 | **Salvar edição de paciente** | 🟡 | Salva no state local. NÃO chama `PUT /api/patients/:id` |
| 24 | **Excluir paciente** | 🟡 | Remove do state local. NÃO chama `DELETE /api/patients/:id` |

**Rotas Backend existentes:**
- `GET /api/patients` ✅
- `POST /api/patients` ✅
- `PUT /api/patients/:id` ✅
- `DELETE /api/patients/:id` ✅
- `GET /api/patients/:id/appointments` ✅
- `GET /api/patients/:id/financial` ✅
- `POST /api/patients/:id/evolution` ✅
- `POST /api/patients/:id/documents` ✅
- `PUT /api/patients/:id/anamnesis` ✅

---

## 📅 PÁGINA: AGENDA (`Appointments.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Botão "Nova Consulta"** | 🟡 | Abre modal. Salva no state local. NÃO chama `POST /api/appointments` |
| 2 | **Navegação semanal (← →)** | 🟢 | Funciona (state local de data) |
| 3 | **Botão "Hoje"** | 🟢 | Funciona (state local) |
| 4 | **Seletor de profissional** | 🟡 | Filtra array local. NÃO chama API com query param |
| 5 | **Tabs Dia/Semana/Lista** | 🟢 | Funciona (state local) |
| 6 | **Click em consulta (Quick View)** | 🟡 | Abre panel com dados do array local |
| 7 | **Botões de status (Confirmado/Pendente/etc)** | 🟡 | Muda status no state local. NÃO chama `PATCH /api/appointments/:id/status` |
| 8 | **Botão "Editar Consulta"** | 🟡 | Abre modal. NÃO chama `PUT /api/appointments/:id` |
| 9 | **Botão "Copiar"** | 🟢 | Funciona (clipboard) |
| 10 | **Botão "Excluir"** | 🟡 | Remove do state local. NÃO chama `DELETE /api/appointments/:id` |
| 11 | **Botão "WhatsApp"** | ⚪ | Não abre link (falta número) |
| 12 | **Drag & Drop (arrastar consulta)** | 🟡 | Muda data/hora no state local. NÃO chama `PATCH /api/appointments/:id/drag` |
| 13 | **Botão "Salvar Alterações" (modal)** | 🟡 | Salva no state local. NÃO chama `PUT /api/appointments/:id` |
| 14 | **Botão "Criar Consulta" (modal novo)** | 🟡 | Adiciona ao state local. NÃO chama `POST /api/appointments` |
| 15 | **Seletor de paciente (modal)** | 🟡 | Lista do mockData.patients |
| 16 | **Seletor de sala (modal)** | 🟡 | State local |
| 17 | **Botão "Excluir" (modal edição)** | 🟡 | Remove do state local |

**Rotas Backend existentes:**
- `GET /api/appointments` ✅
- `POST /api/appointments` ✅ (com verificação de conflito)
- `PUT /api/appointments/:id` ✅
- `DELETE /api/appointments/:id` ✅
- `PATCH /api/appointments/:id/status` ✅
- `PATCH /api/appointments/:id/drag` ✅
- `GET /api/appointments/today/summary` ✅

---

## 📊 PÁGINA: PIPELINE (`Pipeline.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Botão "Novo Lead"** | 🟡 | Abre modal. Salva no state local. NÃO chama API |
| 2 | **Drag & Drop entre colunas** | 🟡 | Muda stage no state local. NÃO chama API |
| 3 | **Click no card (Quick View)** | 🟡 | Abre panel com dados do array local |
| 4 | **Botão "Editar Lead"** | 🟡 | Abre modal. NÃO chama API |
| 5 | **Botão "Copiar" (Quick View)** | 🟢 | Funciona (clipboard) |
| 6 | **Botão "Excluir" (Quick View)** | 🟡 | Remove do state local |
| 7 | **Botões "← Voltar / Avançar →"** | 🟡 | Muda stage no state local |
| 8 | **Grid de etapas (click para mover)** | 🟡 | Muda stage no state local |
| 9 | **Botão "Marcar como Ganho"** | 🟡 | Muda stage para 'fechado' local |
| 10 | **Botão "Marcar como Perdido"** | 🟡 | Muda stage para 'perdido' local |
| 11 | **Botão "WhatsApp"** | ⚪ | Não possui link real |
| 12 | **Botão "Ligar"** | ⚪ | Não faz nada |
| 13 | **Botão "Email"** | ⚪ | Não faz nada |
| 14 | **Botão "Nota"** | ⚪ | Não faz nada |
| 15 | **Botão "Contato" (card)** | ⚪ | Não faz nada |
| 16 | **Botão "..." (stage header)** | ⚪ | Não faz nada |
| 17 | **Salvar edição de lead** | 🟡 | State local |
| 18 | **Excluir lead (modal)** | 🟡 | State local |

**Rotas Backend existentes:** Faltam rotas específicas de pipeline/leads!
- `GET /api/leads` ❌ Não existe (precisa criar)
- `POST /api/leads` ❌ Não existe
- `PUT /api/leads/:id` ❌ Não existe
- `DELETE /api/leads/:id` ❌ Não existe
- `PATCH /api/leads/:id/stage` ❌ Não existe

---

## 💰 PÁGINA: FINANCEIRO (`Financial.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Botão "Exportar"** | ⚪ | Não faz nada. Precisa gerar CSV/PDF |
| 2 | **Botão "Nova Transação"** | ⚪ | Não abre modal (falta implementação) |
| 3 | **Tabs "Todas/Receitas/Despesas"** | 🟡 | Filtra array local (mockData.transactions) |
| 4 | **Botão Filtro (ícone)** | ⚪ | Não faz nada |
| 5 | **4 Cards de métricas** | 🟡 | Calculados do mockData |
| 6 | **Gráfico Fluxo de Caixa** | 🟡 | mockData.revenueData |
| 7 | **DRE Simplificado** | 🟡 | Dados hardcoded |
| 8 | **Tabela de transações** | 🟡 | mockData.transactions |
| 9 | **Cards PIX/Cartão/Boleto** | 🟡 | Dados hardcoded |

**Rotas Backend existentes:**
- `GET /api/financial` ✅
- `POST /api/financial` ✅
- `PUT /api/financial/:id` ✅
- `DELETE /api/financial/:id` ✅

**FALTAM:**
- Modal de "Nova Transação" (frontend)
- Editar transação (frontend)
- Excluir transação (frontend)
- `GET /api/financial/summary` (backend - DRE/métricas)
- `GET /api/financial/export` (backend - CSV/PDF)

---

## 🦷 PÁGINA: TRATAMENTOS (`Treatments.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Botão "Novo Procedimento"** | 🟡 | Abre modal. Salva no state local. NÃO chama `POST /api/treatments` |
| 2 | **Campo de busca** | 🟡 | Filtra array local |
| 3 | **Filtros de categoria** | 🟡 | Filtra array local |
| 4 | **Click no card (Quick View)** | 🟡 | Abre panel com dados locais |
| 5 | **Botão "Editar Serviço" (Quick View)** | 🟡 | Abre modal. State local |
| 6 | **Botão "Copiar Info"** | 🟢 | Funciona (clipboard) |
| 7 | **Botão "Excluir Procedimento"** | 🟡 | Remove do state local |
| 8 | **Salvar edição (modal)** | 🟡 | State local. NÃO chama `PUT /api/treatments/:id` |
| 9 | **Excluir (modal)** | 🟡 | State local. NÃO chama `DELETE /api/treatments/:id` |
| 10 | **Seletor de categoria (modal)** | 🟡 | State local |
| 11 | **Slider de popularidade (modal)** | 🟡 | State local |
| 12 | **Simulador de parcelamento** | 🟡 | Cálculo local (funciona) |

**Rotas Backend existentes:**
- `GET /api/treatments` ✅
- `POST /api/treatments` ✅
- `PUT /api/treatments/:id` ✅
- `DELETE /api/treatments/:id` ✅

---

## 🧠 PÁGINA: INSIGHTS & IA (`Insights.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **4 Cards de insight auto (banner)** | 🟡 | Click abre resposta. Dados calculados do mockData |
| 2 | **Input "Pergunte à IA"** | 🟡 | Gera resposta local. NÃO chama API de IA |
| 3 | **Botão "Perguntar"** | 🟡 | Gera resposta local |
| 4 | **12 Cards de pesquisa rápida** | 🟡 | Click gera resposta local simulada |
| 5 | **Filtros de categoria** | 🟡 | Filtra array local |
| 6 | **Botão "Entendido" (result panel)** | 🟢 | Fecha panel |
| 7 | **Botão "Atualizar" (result panel)** | 🟡 | Re-executa query local |

**Rotas Backend:** NÃO existem rotas de Insights/IA
- `GET /api/insights/health-score` ❌ Não existe
- `POST /api/insights/query` ❌ Não existe
- `GET /api/insights/metrics` ❌ Não existe

---

## 🔔 PÁGINA: NOTIFICAÇÕES (`Notifications.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Botão "Marcar todas como lidas"** | 🟡 | State local. NÃO chama API |
| 2 | **Tabs "Todas / Não lidas"** | 🟡 | Filtra array local |
| 3 | **Botão ✓ (marcar lida individual)** | 🟡 | State local |
| 4 | **Botão 🗑️ (excluir notificação)** | 🟡 | State local |

**Rotas Backend:** NÃO existem rotas de notificações
- `GET /api/notifications` ❌ Não existe
- `PATCH /api/notifications/:id/read` ❌ Não existe
- `PATCH /api/notifications/read-all` ❌ Não existe
- `DELETE /api/notifications/:id` ❌ Não existe

---

## ⚙️ PÁGINA: CONFIGURAÇÕES (`Settings.tsx`)

| # | Botão / Interação | Status | Detalhe |
|---|-------------------|--------|---------|
| 1 | **Toggle Dark/Light Mode** | 🟢 | Funciona (localStorage + class) |
| 2 | **"Dados da Clínica"** | ⚪ | Não abre nada |
| 3 | **"Equipe e Profissionais"** | ⚪ | Não abre nada |
| 4 | **"Unidades"** | ⚪ | Não abre nada |
| 5 | **"Permissões (RBAC)"** | ⚪ | Não abre nada |
| 6 | **"Segurança e LGPD"** | ⚪ | Não abre nada |
| 7 | **"Backup e Dados"** | ⚪ | Não abre nada |
| 8 | **"WhatsApp API"** | ⚪ | Não abre nada |
| 9 | **"Email e SMS"** | ⚪ | Não abre nada |
| 10 | **"Automações"** | ⚪ | Não abre nada |
| 11 | **Tabela RBAC (perfis)** | 🟡 | Exibição estática |

**Rotas Backend:** NÃO existem rotas de settings
- `GET /api/settings` ❌
- `PUT /api/settings` ❌
- `GET /api/settings/team` ❌
- `PUT /api/settings/rbac` ❌

---

## 📊 RESUMO GERAL

### Contagem Total de Botões/Interações

| Página | Total | 🟢 Conectado | 🟡 Parcial | 🔴 Desconectado | ⚪ Visual |
|--------|-------|-------------|-----------|-----------------|----------|
| Login | 17 | 2 | 11 | 0 | 4 |
| Header/App | 7 | 1 | 4 | 0 | 2 |
| Sidebar | 6 | 4 | 1 | 0 | 1 |
| Dashboard | 7 | 0 | 7 | 0 | 0 |
| Pacientes | 24 | 2 | 17 | 0 | 5 |
| Agenda | 17 | 1 | 14 | 0 | 2 |
| Pipeline | 18 | 1 | 11 | 0 | 6 |
| Financeiro | 9 | 0 | 5 | 0 | 4 |
| Tratamentos | 12 | 1 | 10 | 0 | 1 |
| Insights & IA | 7 | 1 | 5 | 0 | 1 |
| Notificações | 4 | 0 | 4 | 0 | 0 |
| Configurações | 11 | 1 | 1 | 0 | 9 |
| **TOTAL** | **139** | **14 (10%)** | **90 (65%)** | **0** | **35 (25%)** |

### O que significa:
- **10% Conectados:** Apenas ações puramente locais (clipboard, navegação, dark mode)
- **65% Parciais:** Funcionalidade existe NO FRONTEND (state local) mas NÃO chama o backend
- **25% Visuais:** Botões placeholder que não fazem nada ainda

---

## 🔧 O QUE FALTA PARA CONECTAR TUDO

### 1. Camada de API no Frontend (CRÍTICO)
Criar `src/services/api.ts` com Axios configurado:
- Base URL: `http://localhost:5000/api`
- Interceptor de Token JWT
- Interceptor de erro 401 (auto-logout)

### 2. Serviços por Módulo
Criar services para cada módulo:
- `src/services/authService.ts` → login, register, logout, me
- `src/services/patientService.ts` → CRUD pacientes
- `src/services/appointmentService.ts` → CRUD agenda
- `src/services/pipelineService.ts` → CRUD leads
- `src/services/financialService.ts` → CRUD transações
- `src/services/treatmentService.ts` → CRUD tratamentos
- `src/services/notificationService.ts` → notificações
- `src/services/insightsService.ts` → queries IA

### 3. Context/State Management
- `src/contexts/AuthContext.tsx` → gerenciar sessão JWT
- Substituir `useState(mockData)` por `useEffect` + fetch da API

### 4. Rotas Backend Faltantes
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-email`
- `GET /api/leads` + CRUD completo
- `GET /api/notifications` + CRUD
- `GET /api/settings` + CRUD
- `GET /api/dashboard/summary`
- `GET /api/insights/health-score`
- `POST /api/insights/query`
- `GET /api/financial/summary`
- `GET /api/financial/export`

### 5. Config do Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/odontopro
JWT_SECRET=chave_super_secreta_aqui
```

### 6. Config do Frontend (proxy Vite)
Adicionar proxy no `vite.config.ts`:
```ts
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 🎯 PRIORIDADE DE IMPLEMENTAÇÃO

### Fase 1 – Core (Sem isso nada funciona)
1. ✅ Criar `src/services/api.ts`
2. ✅ Criar `src/contexts/AuthContext.tsx`
3. ✅ Conectar Login → `POST /api/auth/login`
4. ✅ Conectar Register → `POST /api/auth/register`

### Fase 2 – CRUD Principal
5. Conectar Pacientes CRUD → `/api/patients`
6. Conectar Agenda CRUD → `/api/appointments`
7. Conectar Tratamentos CRUD → `/api/treatments`

### Fase 3 – Complementar
8. Conectar Pipeline CRUD → `/api/leads` (criar rotas)
9. Conectar Financeiro CRUD → `/api/financial`
10. Conectar Notificações → `/api/notifications` (criar rotas)

### Fase 4 – Avançado
11. Conectar Insights/IA → `/api/insights`
12. Conectar Configurações → `/api/settings`
13. Implementar upload de documentos → S3/Storage
14. Implementar WhatsApp API
15. Implementar geração de PDF (orçamento, contrato)
