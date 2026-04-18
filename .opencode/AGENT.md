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

## 10) Orquestração de Workflow (Workflow Orchestration)

### 10.1. Padrão de Modo de Planejamento
- Entre em modo de planejamento para QUALQUER tarefa não trivial (3+ passos ou decisões arquiteturais).
- Se algo der errado, PARE e replaneje imediatamente - não continue forçando.
- Use o modo de planejamento para passos de verificação, não apenas para construção.
- Escreva especificações detalhadas antecipadamente para reduzir ambiguidades.

### 10.2. Estratégia de Subagentes
- Use subagentes de forma generosa para manter a janela de contexto principal limpa.
- Descarregue pesquisa, exploração e análises paralelas para subagentes.
- Para problemas complexos, direcione mais processamento (compute) através de subagentes.
- Uma tarefa por subagente para focar a execução.

### 10.3. Ciclo de Auto-Melhoria
- Após QUALQUER correção feita pelo usuário: atualize `tasks/lessons.md` com o padrão ensinado.
- Escreva regras para si mesmo que previnam cometer o mesmo erro no futuro.
- Itere de forma implacável nessas lições até que a taxa de erros caia.
- Revise as lições no início de cada sessão para o respectivo projeto.

### 10.4. Verificação Antes da Conclusão
- Nunca marque uma tarefa como completa sem provar que ela funciona.
- Verifique a diferença (diff) de comportamento entre a branch principal e suas mudanças quando aplicável.
- Pergunte a si mesmo: "Um Staff Engineer aprovaria isso?"
- Rode testes, cheque os logs e demonstre a corretude da solução.

### 10.5. Exija Elegância (Balanceada)
- Para mudanças não triviais: pause e pergunte "existe uma forma mais elegante?"
- Se uma correção parece uma gambiarra (hacky): "Sabendo de tudo que sei agora, implemente a solução elegante."
- Pule esta reflexão para correções simples e óbvias - não tente super-projetar (don't over-engineer).
- Desafie o seu próprio trabalho antes de apresentá-lo.

### 10.6. Correção Autônoma de Bugs
- Ao receber um relato de bug: apenas conserte. Não peça para ser guiado pela mão.
- Aponte para logs, erros e testes falhando - e então resolva-os.
- Nenhuma troca de contexto (context switching) deve ser requerida do usuário.
- Corrija testes falhando na CI sem precisar ser instruído de como fazê-lo.

## 11) Gerenciamento de Tarefas

1. **Planeje Primeiro**: Escreva o plano em `tasks/todo.md` com itens checáveis.
2. **Verifique o Plano**: Faça uma checagem antes de começar a implementação.
3. **Acompanhe o Progresso**: Marque os itens como concluídos conforme você avança.
4. **Explique as Mudanças**: Forneça um resumo de alto nível em cada etapa.
5. **Documente os Resultados**: Adicione uma seção de revisão ao `tasks/todo.md`.
6. **Capture as Lições**: Atualize `tasks/lessons.md` após receber correções do usuário.

## 12) Princípios Essenciais

- **Simplicidade Primeiro**: Faça cada mudança o mais simples possível. Impacte o mínimo de código.
- **Sem Preguiça**: Encontre as causas raiz. Sem soluções temporárias. Siga os padrões de um desenvolvedor Sênior.
- **Impacto Mínimo**: As mudanças devem tocar apenas no que é estritamente necessário. Evite introduzir novos bugs.
