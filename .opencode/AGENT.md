# OpenCode Agent Rules - Petshop Mobile App

Este arquivo define as regras de execução para o agente neste repositório, com base no PRD (`docs/prd.md`) e no SDD (`docs/sdd.md`).

## 1) Objetivo do produto

O app deve centralizar a operação do petshop com foco em:
- Cadastro e gestão de tutores e pets.
- Agenda de atendimentos com validações de conflito e recorrência.
- Controle financeiro mensal (mensalidades e serviços avulsos), incluindo inadimplência.
- Backup e restauração local via JSON.

## 2) Stack e diretrizes técnicas

- Framework: React Native (Expo SDK 52+).
- Linguagem: TypeScript (evitar `any`).
- Estado: Zustand para UI global; React Query quando aplicável.
- Persistência: SQLite com Drizzle ORM (arquitetura local-first).
- Navegação: estrutura atual de navegação do projeto (manter padrão existente).

## 3) Arquitetura e separação de responsabilidades

Seguir arquitetura Feature-First e fluxo de dados:
1. Screen captura interação do usuário.
2. Service aplica regras de negócio e validações.
3. DAO/Storage executa acesso ao banco via Drizzle.
4. UI é atualizada via estado/refetch.

Regras obrigatórias:
- Não acessar DB direto nas screens.
- Toda regra de negócio deve ficar em `src/services`.
- DAOs em `src/storage/daos` devem conter apenas acesso a dados.
- Schemas em `src/storage/schema`.

## 4) Organização de diretórios

Manter estrutura:
- `src/screens/<Feature>/` com `components/` e `hooks/` locais quando necessário.
- `src/services/` para regras compartilhadas.
- `src/storage/` para schema, conexão e daos.
- `src/components/ui/` para componentes globais reutilizáveis.
- `src/types/` para contratos/interfaces compartilhadas.

Ao criar nova feature:
1. Definir/atualizar schema e migração.
2. Implementar DAO.
3. Implementar Service.
4. Implementar UI (screen + componentes locais).
5. Conectar navegação.

## 5) Requisitos funcionais mínimos por domínio

### Clientes e Pets
- CRUD de tutores com campos obrigatórios (nome, telefone, endereço).
- CRUD de pets vinculados a tutor.
- Busca/listagem de tutores.

### Agenda
- Criar agendamento com data/hora/pet/serviço.
- Bloquear conflito de horário para o mesmo pet.
- Suportar recorrência semanal, quinzenal e mensal.
- Permitir sincronização opcional com calendário do dispositivo.

### Finanças
- Lançamentos mensais por `referenceMonth`.
- Mensalidades recorrentes para clientes elegíveis.
- Lançamentos avulsos de serviço.
- Status de pagamento (ex.: pendente, pago, atrasado, cancelado).
- Histórico por cliente e visão mensal com navegação entre meses.

### Backup/Restore
- Exportar tabelas para JSON.
- Importar JSON com validação de compatibilidade.
- Restaurar em transação com rollback em erro.

## 6) Regras de UI/UX

- Manter interface moderna com padrão visual consistente do app.
- Preferir componentes de `src/components/ui`.
- Em textos de UI, usar `AppText` no lugar de `Text`.

Padrões obrigatórios do SDD:
- **Modal**: usar `Modal` nativo com:
  - `animationType="fade"`
  - overlay escuro `rgba(0,0,0,0.6)`
  - dismiss ao tocar no backdrop
  - `KeyboardAvoidingView` para evitar sobreposição do teclado
- **FAB**: ações primárias de criação devem usar botão flutuante no canto inferior direito com estilo consistente (circular, elevação/sombra, cor primária).

## 7) Qualidade e validação

Antes de concluir mudanças:
- Validar tipagem TypeScript (`npx tsc --noEmit`).
- Conferir impacto em fluxos existentes e regras de negócio.
- Evitar regressões em recorrência, status e histórico financeiro.

## 8) Restrições

- Não criar arquivos monolíticos para telas grandes; quebrar em componentes.
- Não introduzir libs externas de UI sem solicitação explícita.
- Não violar arquitetura local-first.
- Não alterar regras de negócio sem refletir em service/dao/schema quando necessário.

## 9) Atualização de documentação

Em mudanças relevantes de arquitetura ou produto, atualizar:
- `docs/prd.md`
- `docs/sdd.md`
