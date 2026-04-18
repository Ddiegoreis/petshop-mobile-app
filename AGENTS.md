# Petshop Project - Agent Guidelines

Este documento consolida as regras para agentes de IA neste repositório.
Fonte de verdade: `AGENTS.md`.

## 1. Objetivo do produto
- Centralizar a operação do petshop com foco em:
  - cadastro e gestão de tutores e pets;
  - agenda de atendimentos com conflitos e recorrência;
  - controle financeiro mensal (mensalidades e serviços avulsos), incluindo inadimplência;
  - backup e restauração local via JSON.

## 2. Princípios centrais
- **Architecture First**: seguir os padrões definidos em `docs/sdd.md`.
- **Type Safety**: usar TypeScript, evitar `any`, preferir contratos em `src/types`.
- **Local-First**: persistência em SQLite via Drizzle ORM, sempre pela camada `src/storage`.
- **Business Logic Separation**: regras de negócio em `src/services`; telas só UI + orquestração.
- **UI Premium e consistente**: usar base em `src/components/ui`; em textos, usar `AppText` em vez de `Text`.

## 3. Stack e diretrizes técnicas
- React Native com Expo (manter padrão atual do projeto).
- TypeScript estrito.
- Zustand para estado global de UI.
- Drizzle ORM para queries e migrations.
- Navegação: preservar estrutura já adotada no projeto.

## 4. Arquitetura e responsabilidades
Fluxo obrigatório de dados:
1. Screen recebe interação do usuário.
2. Service aplica validações e regras de negócio.
3. DAO/Storage executa acesso ao banco.
4. UI é atualizada via estado/refetch.

Regras obrigatórias:
- Não acessar DB diretamente nas screens.
- Toda regra de negócio deve estar em `src/services`.
- DAOs em `src/storage/daos` devem conter apenas acesso a dados.
- Schemas em `src/storage/schema`.

## 5. Organização de diretórios
Manter estrutura:
- `src/screens/<Feature>/` com `components/` e `hooks/` locais quando necessário.
- `src/services/` para regras compartilhadas.
- `src/storage/` para schema, conexão e DAOs.
- `src/components/ui/` para componentes globais reutilizáveis.
- `src/types/` para tipos/interfaces compartilhadas.

## 6. Workflow para novas features
1. Planejar impacto em serviço e storage.
2. Atualizar schema e criar migration (quando aplicável).
3. Implementar/ajustar DAO.
4. Implementar regra de negócio no service.
5. Implementar UI (screen + componentes locais).
6. Conectar na navegação.

## 7. Requisitos funcionais mínimos
### Clientes e Pets
- CRUD de tutores com obrigatórios: nome, telefone, endereço.
- CRUD de pets vinculados ao tutor.

### Agenda
- Criar agendamento com data/hora/pet/serviço.
- Bloquear conflito de horário para o mesmo pet.
- Suportar recorrência semanal, quinzenal e mensal.
- Permitir sincronização opcional com calendário.

### Finanças
- Lançamentos por `referenceMonth`.
- Mensalidades recorrentes para clientes elegíveis.
- Lançamentos avulsos de serviço.
- Status: pendente, pago, atrasado, cancelado.
- Histórico por cliente e visão mensal.

### Backup/Restore
- Exportar tabelas para JSON.
- Importar JSON com validação de compatibilidade.
- Restaurar em transação com rollback em erro.

## 8. Regras de UI/UX
- Manter padrão visual consistente do app e do design system.
- Preferir componentes de `src/components/ui`.
- Modal nativo deve seguir padrão do projeto:
  - `animationType="fade"`;
  - overlay escuro `rgba(0,0,0,0.6)`;
  - dismiss ao tocar no backdrop;
  - `KeyboardAvoidingView` quando houver formulário.
- Ações primárias de criação devem usar FAB consistente com o app.

## 9. Qualidade e validação
Antes de concluir mudanças:
- Rodar `npx tsc --noEmit`.
- Verificar impacto nos fluxos existentes.
- Evitar regressões em recorrência, status e histórico financeiro.
- Sempre preferir solução simples, elegante e de impacto mínimo.

## 10. Documentação
- Em mudanças relevantes de arquitetura/produto, atualizar:
  - `docs/prd.md`
  - `docs/sdd.md`

## 11. Restrições
- Não criar telas monolíticas grandes; quebrar em componentes.
- Não usar bibliotecas externas de UI sem solicitação explícita.
- Não violar arquitetura local-first.
- Não alterar regra de negócio sem refletir em service/dao/schema quando necessário.

## 12. Git Workflow (Commit e Push)
- Separar commits por contexto: cada commit deve representar apenas uma mudança coesa.
- Não misturar implementações distintas no mesmo commit (ex.: feature A + feature B).
- Quando houver tipos diferentes de mudança, separar em commits independentes (ex.: `feat`, `test`, `chore`, `docs`, `refactor`).
- Commits devem ser objetivos e claros, com escopo compreensível pelo histórico do projeto.
- Mensagens devem seguir Conventional Commits: `type(scope): descrição`.
- Tipos permitidos (padrão): `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- A descrição do commit deve ser curta, específica e orientada ao resultado (evitar mensagens genéricas).
- Fazer push apenas quando solicitado explicitamente pelo usuário.
