# 🛡️ Relatório de Segurança - CRM Odonto Pro

Este sistema foi construído seguindo os princípios de "Security by Design" e "Defense in Depth", garantindo conformidade com as melhores práticas de proteção de dados médicos (LGPD/HIPAA).

## 🔒 1. Autenticação e Autorização
- **JWT (JSON Web Tokens):** Sessões stateless e seguras.
- **Bcrypt Hashing:** Senhas nunca são salvas em texto plano; usamos salt + hash complexo.
- **RBAC (Role-Based Access Control):** Controle granular de acesso.
    - *Ex:* Apenas 'Financeiro' e 'Admin' acessam fluxo de caixa.
    - *Ex:* Apenas 'Admin' pode excluir registros críticos.

## 🛡️ 2. Proteção de Infraestrutura
- **Helmet JS:** Define cabeçalhos HTTP seguros para prevenir ataques comuns.
- **Rate Limiting:** Limita requisições por IP (100 a cada 10 min) para evitar ataques de Força Bruta e DDoS.
- **CORS Estrito:** A API aceita requisições apenas do domínio frontend autorizado.

## 💉 3. Sanitização de Dados (Anti-Hacker)
- **NoSQL Injection:** Middleware `express-mongo-sanitize` remove caracteres maliciosos (`$`, `.`) que poderiam manipular o banco de dados.
- **XSS (Cross-Site Scripting):** Middleware `xss-clean` remove scripts maliciosos de inputs de texto.
- **Zod Validation:** Todas as entradas (Login, Cadastro, Agendamento) passam por validação rigorosa de tipo e formato antes de tocar o banco de dados.

## 👁️ 4. Auditoria e Rastreabilidade
- **Audit Logs:** Cada ação crítica (Criar, Editar, Excluir) é registrada no banco de dados.
    - *Dados gravados:* Quem fez, o que fez, ID do registro afetado, IP de origem e Data/Hora.
    - Isso garante responsabilidade legal em caso de disputas ou vazamentos internos.

## 🚫 5. Tratamento de Erros
- **Production-Ready:** Em ambiente de produção, stack traces e detalhes técnicos são ocultados para evitar que atacantes mapeiem a infraestrutura.

---

### Como Rodar com Segurança
Certifique-se de configurar as variáveis de ambiente no arquivo `.env`:
```
NODE_ENV=production
JWT_SECRET=sua_chave_super_secreta_e_longa
MONGO_URI=sua_connection_string_segura
```