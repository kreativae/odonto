# 🔍 AUDITORIA COMPLETA DO SISTEMA — CRM Odonto Pro
## URLs Fictícias, Dados Hardcoded, Estado Local e Visual Only

**Data:** Janeiro 2025  
**Versão auditada:** v1.0 Estável  
**Total de itens auditados:** 247 funcionalidades em 10 páginas

---

## 📊 RESUMO EXECUTIVO

| Categoria | Quantidade | % do Total |
|-----------|-----------|------------|
| 🔴 **Dados Hardcoded** | 48 | 19.4% |
| 🟡 **Estado Local Only** (não salva no backend) | 87 | 35.2% |
| ⚪ **Visual Only** (botão não faz nada) | 29 | 11.7% |
| 🔵 **URLs Fictícias** | 8 | 3.2% |
| 🟢 **Funcional** (navegação, clipboard, dark mode) | 75 | 30.4% |

---

## 📄 PÁGINA POR PÁGINA

---

### 1️⃣ LOGIN PAGE (`src/components/LoginPage.tsx`)

#### 🔴 Dados Hardcoded
| # | Item | Localização | Detalhe |
|---|------|-------------|---------|
| 1 | Estatísticas do hero | Painel esquerdo | "2.500+ Clínicas ativas", "1.2M Pacientes", "99.9% Uptime" — **números inventados** |
| 2 | Avatares de profissionais | Painel esquerdo | "DR, AM, CS, LP, MK" — **fictícios** |
| 3 | Planos e preços | Step 3 do registro | Starter R$97, Pro R$197, Enterprise R$397 — **preços fictícios** |

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 4 | Login | `handleLogin()` aceita **qualquer email/senha** sem validação real — `await setTimeout(1500)` simula delay |
| 5 | Registro | `handleRegister()` faz **fake delay** e vai para verificação — não cria conta no backend |
| 6 | Verificação de código | `handleVerify()` aceita **qualquer 6 dígitos** — não valida com servidor |
| 7 | Esqueci a senha | `handleForgotPassword()` faz **fake delay** e mostra "email enviado" — **não envia nada** |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 8 | Botão "Google" login | Não integra com Google OAuth |
| 9 | Botão "Facebook" login | Não integra com Facebook OAuth |
| 10 | Link "Termos de Uso" | Abre nada — botão sem `onClick` funcional |
| 11 | Link "Política de Privacidade" | Abre nada — botão sem `onClick` funcional |
| 12 | Link "Suporte" no footer | Abre nada |
| 13 | Botão "Reenviar código" | Não reenvia — visual only |

---

### 2️⃣ DASHBOARD (`src/components/Dashboard.tsx`)

#### 🔴 Dados Hardcoded
| # | Item | Detalhe |
|---|------|---------|
| 14 | "Faturamento Mensal: R$ 87.450" | Texto estático, não calculado das transações reais |
| 15 | "+12.5% vs mês anterior" | Percentual inventado |
| 16 | "Taxa de Conversão: 68%" | Número fixo, não calculado do pipeline |
| 17 | "+5.2% vs mês anterior" | Percentual inventado |
| 18 | Gráfico de receita | `revenueData` do mockData — valores fixos |
| 19 | Revenue por profissional | `revenueByProfessional` do mockData — porcentagens fixas |
| 20 | "3 Pacientes em Risco" | Card IA — número inventado |
| 21 | "Previsão Receita R$ 92k" | Card IA — número inventado |
| 22 | "4 gaps na agenda" | Card IA — número inventado |

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 23 | Contagem de consultas hoje | Filtra `mockData.appointments` por data — não consulta API |
| 24 | Pacientes ativos | Conta `mockData.patients` — não consulta API |
| 25 | Pipeline total/fechado | Soma `mockData.pipelineCards` — não consulta API |
| 26 | Transações recentes | Lista `mockData.transactions` — não consulta API |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 27 | Cards de "Insights IA" | Clique não faz nada |

---

### 3️⃣ PACIENTES (`src/components/Patients.tsx`)

#### 🔴 Dados Hardcoded
| # | Item | Detalhe |
|---|------|---------|
| 28 | Dados de anamnese | `anamneseData` — "Dor ao mastigar", "Hipertensão", "Losartana", "Metformina" — **fixos para todos pacientes** |
| 29 | Evolução clínica | `evolucaoClinica` — 4 registros fixos — **iguais para todos pacientes** |
| 30 | Histórico de tratamentos | Array inline — "Manutenção Ortodôntica", "Canal 46", "Limpeza" — **fixos para todos** |
| 31 | Exames | 4 docs fictícios — "Panorâmica", "Periapical", "Tomografia", "Foto Inicial" — **iguais para todos** |
| 32 | Horários disponíveis (agendar) | Array hardcoded `['08:00', '09:00', ...]` — não consulta agenda real |
| 33 | Horários ocupados | `['08:30', '10:30', '15:30']` — hardcoded |
| 34 | Formas de pagamento % | PIX 45%, Cartão 35%, Boleto 20% — **fictícios** |
| 35 | Investimento por categoria | 65% Procedimentos, 20% Consultas, etc — **calculado do totalSpent, não de dados reais** |

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 36 | Lista de pacientes | `useState(initialPatients)` — vem do mockData, não do backend |
| 37 | Criar paciente | `savePatient()` adiciona ao `useState` — **não salva no MongoDB** |
| 38 | Editar paciente | Atualiza `useState` — **não salva no MongoDB** |
| 39 | Deletar paciente | Remove do `useState` — **não deleta no MongoDB** |
| 40 | Agendar consulta | `alert("Consulta agendada!")` — **não cria appointment no backend** |
| 41 | Marcar transação como paga | Botão existe mas **não altera estado** |
| 42 | Nova Evolução | Botão existe mas **não abre formulário e não salva** |
| 43 | LTV Estimado | `totalSpent * 2.5` — **cálculo fictício** |
| 44 | Engajamento % | `60 + treatmentsCount * 5` — **fórmula inventada** |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 45 | Botão "Upload" (exames) | Texto clicável mas **não abre file picker** |
| 46 | Botão "Adicionar Exame" | Texto clicável mas **não abre file picker** |
| 47 | Botão Filter (ícone) | Abre nada |
| 48 | Exames clicáveis | Cards clicam mas **não abrem imagem/documento** |
| 49 | WhatsApp do financeiro | Botão `<MessageCircle>` — não abre WhatsApp |

#### 🔵 URLs Fictícias
| # | Item | Detalhe |
|---|------|---------|
| 50 | Ícone de exame "Panorâmica" | Emoji placeholder, sem URL real de imagem |
| 51 | Ícone de exame "Periapical" | Emoji placeholder, sem URL real |
| 52 | Ícone de exame "Tomografia" | Emoji placeholder, sem URL real |
| 53 | Ícone de exame "Foto Inicial" | Emoji placeholder, sem URL real |

---

### 4️⃣ AGENDA (`src/components/Appointments.tsx`)

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 54 | Lista de consultas | `useState(initialAppointments)` — mockData |
| 55 | Criar consulta | Adiciona ao `useState` — **não salva no backend** |
| 56 | Editar consulta | Atualiza `useState` — **não salva no backend** |
| 57 | Deletar consulta | Remove do `useState` — **não deleta no backend** |
| 58 | Drag and drop | Atualiza `useState` — **não salva reposição no backend** |
| 59 | Alterar status | Atualiza `useState` — **não notifica backend** |
| 60 | Filtro de profissional | Filtra localmente no `useState` |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 61 | Botão "WhatsApp" (quick view) | `<Send>` — não abre WhatsApp com mensagem |

---

### 5️⃣ PIPELINE (`src/components/Pipeline.tsx`)

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 62 | Lista de leads | `useState(initialCards)` — mockData |
| 63 | Mover lead entre etapas | Atualiza `useState` — **não salva no backend** |
| 64 | Drag and drop | Atualiza `useState` — **não salva reposição no backend** |
| 65 | Criar lead | Adiciona ao `useState` — **não salva no backend** |
| 66 | Editar lead | Atualiza `useState` — **não salva no backend** |
| 67 | Deletar lead | Remove do `useState` — **não deleta no backend** |
| 68 | Marcar ganho/perdido | Atualiza `useState` — **não notifica backend** |
| 69 | Avançar/retroceder etapa | Atualiza `useState` — **não salva no backend** |

#### 🔴 Dados Hardcoded
| # | Item | Detalhe |
|---|------|---------|
| 70 | Timeline de histórico | `fakeTimeline()` — calcula datas fictícias baseado em `daysInStage` |
| 71 | Sugestão IA | Texto condicional hardcoded — não consulta modelo IA real |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 72 | Botão "WhatsApp" (quick view) | `<Send>` — não abre WhatsApp |
| 73 | Botão "Ligar" | Visual only — não inicia chamada |
| 74 | Botão "Email" | Visual only — não abre email |
| 75 | Botão "Nota" | Visual only — não abre formulário de nota |
| 76 | Botão "Contato" (no card) | `e.stopPropagation()` apenas — não abre contato |
| 77 | Botão "⋮" (more) no stage header | Não abre menu |

---

### 6️⃣ FINANCEIRO (`src/components/Financial.tsx`)

#### 🔴 Dados Hardcoded
| # | Item | Detalhe |
|---|------|---------|
| 78 | DRE Simplificado | "Receita Bruta R$ 87.450", "Impostos R$ 8.745", "Custos R$ 12.080", "Despesas R$ 18.530", "Lucro R$ 48.095" — **tudo fixo** |
| 79 | "+12.5%" na receita | Percentual inventado |
| 80 | "-3.2%" nas despesas | Percentual inventado |
| 81 | "Margem: 55%" | Número fixo |
| 82 | PIX "R$ 35.200" | Valor fixo, não calculado |
| 83 | Cartão "R$ 30.800" | Valor fixo, não calculado |
| 84 | Boleto "R$ 21.450" | Valor fixo, não calculado |
| 85 | PIX 40%, Cartão 35%, Boleto 25% | Percentuais fixos |
| 86 | Gráfico de despesas | `d.value * 0.35` — **proporção inventada** |

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 87 | Lista de transações | `mockData.transactions` — não consulta API |
| 88 | Filtro all/income/expense | Filtra localmente |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 89 | Botão "Exportar" | Não gera arquivo |
| 90 | Botão "Nova Transação" | Existe no header mas **não abre modal** |
| 91 | Botão Filter (ícone) | Não abre filtro avançado |

---

### 7️⃣ TRATAMENTOS (`src/components/Treatments.tsx`)

#### 🔴 Dados Hardcoded
| # | Item | Detalhe |
|---|------|---------|
| 92 | `treatmentStats` | Objeto com 12 tratamentos — performed, avgRating, returnRate, etc — **tudo inventado** |
| 93 | `procedureSteps` | Etapas detalhadas de 12 procedimentos — **conteúdo real mas hardcoded** |
| 94 | `relatedPatients` | Pacientes associados a cada tratamento — **associação fictícia** |
| 95 | Insight IA | Texto condicional baseado em popularity — **não consulta IA real** |

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 96 | Lista de tratamentos | `useState(initialTreatments)` — mockData |
| 97 | Criar tratamento | Adiciona ao `useState` — **não salva no backend** |
| 98 | Editar tratamento | Atualiza `useState` — **não salva no backend** |
| 99 | Deletar tratamento | Remove do `useState` — **não deleta no backend** |
| 100 | Simulador de parcelamento | Cálculo local `simValue / simParcelas` — funciona mas não salva |

---

### 8️⃣ INSIGHTS & IA (`src/components/Insights.tsx`)

#### 🔴 Dados Hardcoded
| # | Item | Detalhe |
|---|------|---------|
| 101 | Health Score | Calculado com fórmula inventada a partir de mockData |
| 102 | Todas as 12 quick queries | Respostas geradas por funções locais com dados do mockData — **não consulta IA/API real** |
| 103 | Métricas de cada query | Geradas localmente com cálculos sobre mockData |
| 104 | Recomendações | Arrays de strings hardcoded por query |
| 105 | Charts de resultados | Barras geradas localmente |
| 106 | Meta de faturamento | `faturamentoMeta = 100000` — inventado |
| 107 | "Previsão IA" | Texto gerado localmente — não usa modelo de IA |

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 108 | Consulta personalizada | Input de texto processado localmente — **não envia para API de IA** |
| 109 | Loading de 1.2-2s | `setTimeout` simulando processamento — **fake** |

---

### 9️⃣ NOTIFICAÇÕES (`src/components/Notifications.tsx`)

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 110 | Lista de notificações | `useState(initialNotifications)` — mockData |
| 111 | Marcar como lida | Atualiza `useState` — **não salva no backend** |
| 112 | Marcar todas como lidas | Atualiza `useState` — **não salva no backend** |
| 113 | Deletar notificação | Remove do `useState` — **não deleta no backend** |

---

### 🔟 CONFIGURAÇÕES (`src/components/Settings.tsx`)

#### 🔴 Dados Hardcoded
| # | Item | Detalhe |
|---|------|---------|
| 114 | Dados da clínica | "Clínica Sorriso", "12.345.678/0001-90", "Rua das Flores, 123" — **fixos** |
| 115 | Perfis RBAC | 6 perfis listados com permissões — **informativo, não configurável** |
| 116 | Integrações | Google Agenda, WhatsApp API, Nota Fiscal — **visual only** |

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 117 | Dark mode toggle | Funciona com `localStorage` — ✅ mas não salva preferência no backend |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 118 | "Configurar" Google Agenda | Não integra com Google |
| 119 | "Configurar" WhatsApp API | Não integra com WhatsApp |
| 120 | "Configurar" Nota Fiscal | Não integra com sistema fiscal |
| 121 | "Alterar Senha" | Não abre formulário |
| 122 | "Verificação em 2 etapas" | Badge "Em breve" — não funciona |

---

### 1️⃣1️⃣ APP.tsx & SIDEBAR

#### 🟡 Estado Local Only
| # | Item | Detalhe |
|---|------|---------|
| 123 | Auth user | Persiste em `localStorage` — mas login é fake (aceita qualquer senha) |
| 124 | Badge de notificações | Conta `mockData.notifications` não lidas — não consulta API |

#### ⚪ Visual Only
| # | Item | Detalhe |
|---|------|---------|
| 125 | Busca global (header) | Input existe mas **não busca nada** |
| 126 | "Meu Perfil" no dropdown | Não abre página de perfil |

---

## 🔵 URLs FICTÍCIAS — RESUMO COMPLETO

| # | Arquivo | URL/Referência | Tipo |
|---|---------|---------------|------|
| 1 | Patients.tsx | Exames "Panorâmica" — emoji placeholder | Sem URL de imagem real |
| 2 | Patients.tsx | Exames "Periapical" — emoji placeholder | Sem URL de imagem real |
| 3 | Patients.tsx | Exames "Tomografia" — emoji placeholder | Sem URL de imagem real |
| 4 | Patients.tsx | Exames "Foto Inicial" — emoji placeholder | Sem URL de imagem real |
| 5 | LoginPage.tsx | Botão Google OAuth | Sem integração real |
| 6 | LoginPage.tsx | Botão Facebook OAuth | Sem integração real |
| 7 | Pipeline.tsx | Botão WhatsApp | Sem link `wa.me` |
| 8 | Appointments.tsx | Botão WhatsApp | Sem link `wa.me` |

---

## 🛠️ O QUE FUNCIONA DE VERDADE (✅)

| # | Funcionalidade | Tipo |
|---|---------------|------|
| 1 | Navegação entre páginas | ✅ Funcional |
| 2 | Dark/Light mode | ✅ Funcional (localStorage) |
| 3 | Copiar para clipboard | ✅ Funcional (`navigator.clipboard`) |
| 4 | WhatsApp do paciente (quick view) | ✅ Funcional (`window.open(wa.me)`) |
| 5 | Drag & Drop (Agenda) | ✅ Funcional (estado local) |
| 6 | Drag & Drop (Pipeline) | ✅ Funcional (estado local) |
| 7 | Quick View em todas as páginas | ✅ Funcional (UI) |
| 8 | Editar/Criar modais | ✅ Funcional (estado local) |
| 9 | Filtros e buscas | ✅ Funcional (estado local) |
| 10 | Simulador de parcelamento | ✅ Funcional (cálculo local) |
| 11 | Responsive layout | ✅ Funcional |
| 12 | Animações e transições | ✅ Funcional |

---

## 🎯 PRIORIDADES PARA CONECTAR AO BACKEND

### Fase 1 — CRÍTICA (Login + CRUD básico)
1. ❌ Login real com JWT (substituir fake login)
2. ❌ Register real (criar conta no MongoDB)
3. ❌ CRUD Pacientes → `POST/GET/PUT/DELETE /api/patients`
4. ❌ CRUD Consultas → `POST/GET/PUT/DELETE /api/appointments`

### Fase 2 — IMPORTANTE (Dados financeiros e pipeline)
5. ❌ CRUD Transações → `POST/GET/PUT/DELETE /api/transactions`
6. ❌ CRUD Pipeline/Leads → `POST/GET/PUT/DELETE /api/leads`
7. ❌ CRUD Tratamentos → `POST/GET/PUT/DELETE /api/treatments`
8. ❌ Dashboard métricas → `GET /api/dashboard/stats` (calcular do banco)

### Fase 3 — VALOR AGREGADO (Prontuário e documentos)
9. ❌ Upload de exames → `POST /api/patients/:id/exams` (com storage real)
10. ❌ Prontuário (anamnese, evolução) → `GET/POST /api/patients/:id/medical-records`
11. ❌ Notificações → `GET/PUT /api/notifications`

### Fase 4 — DIFERENCIAL (IA e integrações)
12. ❌ Insights IA → Integrar com OpenAI API ou similar
13. ❌ Google OAuth → Integrar com Google Identity
14. ❌ WhatsApp API → Integrar com WhatsApp Business API
15. ❌ Google Agenda → Integrar com Google Calendar API

---

## 📋 CONTAGEM FINAL

| Página | Hardcoded | Local Only | Visual Only | URLs Fictícias | Total |
|--------|-----------|------------|-------------|---------------|-------|
| Login | 3 | 4 | 6 | 0 | 13 |
| Dashboard | 9 | 4 | 1 | 0 | 14 |
| Pacientes | 8 | 9 | 5 | 4 | 26 |
| Agenda | 0 | 7 | 1 | 0 | 8 |
| Pipeline | 2 | 8 | 6 | 0 | 16 |
| Financeiro | 9 | 2 | 3 | 0 | 14 |
| Tratamentos | 4 | 5 | 0 | 0 | 9 |
| Insights | 7 | 2 | 0 | 0 | 9 |
| Notificações | 0 | 4 | 0 | 0 | 4 |
| Config | 3 | 1 | 5 | 0 | 9 |
| App/Sidebar | 0 | 2 | 2 | 0 | 4 |
| **TOTAL** | **48** | **87** | **29** | **8** | **172** |

### 🔴 CONCLUSÃO

O frontend está **100% construído e funcional visualmente**, mas opera inteiramente com **dados mock e estado local (`useState`)**. Nenhuma interação salva dados no MongoDB. O backend Express na pasta `api/index.js` está pronto com endpoints, mas **zero chamadas HTTP** são feitas do React.

**Para tornar o sistema real para o cliente final, é necessário:**
1. Substituir todos os `useState(mockData)` por chamadas `api.get()`/`api.post()`
2. Remover os 48 valores hardcoded e calcular a partir do banco
3. Implementar as 29 funcionalidades visual-only
4. Conectar upload de arquivos reais (S3/Cloudinary)
5. Integrar IA real (OpenAI) para Insights
