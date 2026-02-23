# Petshop Mobile App - Gerente Cão Carioca 🐾

Um aplicativo mobile moderno e eficiente para gestão operacional de petshops, focado no controle de clientes, pets, agendamentos e finanças. Desenvolvido com uma arquitetura local-first para garantir rapidez e disponibilidade.

## 🚀 Tecnologias Utilizadas

O projeto utiliza o que há de mais moderno no ecossistema Mobile e Fullstack:

### Core
- **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/) (SDK 54+).
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para maior segurança e produtividade.
- **Navegação:** [React Navigation v7](https://reactnavigation.org/) (Stack & Tab navigators).

### Persistência e Dados
- **Banco de Dados:** [SQLite](https://www.sqlite.org/) via `expo-sqlite`.
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) para manipulação de dados de forma tipada e segura.
- **DAO Pattern:** Implementação de Data Access Objects para separação de preocupações.

### UI/UX
- **Aesthetics:** Design premium com suporte nativo a **Modo Escuro (Dark Mode)**.
- **Iconografia:** [Lucide React Native](https://lucide.dev/).
- **Componentes:** Visualização de Agenda com [React Native Calendars](https://github.com/wix/react-native-calendars) (Timeline view).
- **Tipografia:** Sistema de design customizado baseado em tokens.

### Serviços Nativos
- **Calendário:** `expo-calendar` para sincronização com o calendário do dispositivo.
- **Sistema de Arquivos:** `expo-file-system` para gerenciamento de anexos e backups.
- **Compartilhamento:** `expo-sharing` para exportação de dados.
- **Document Picker:** `expo-document-picker` para restauração de backups.

## ✨ Funcionalidades Principais

- **Gestão de Clientes e Pets:** CRUD completo de tutores e seus respectivos animais.
- **Agenda Inteligente:**
  - Visualização em Linha do Tempo (Timeline).
  - Validação de conflitos de horário.
  - Suporte a agendamentos recorrentes (Semanal, Quinzenal, Mensal).
  - Sincronização com o calendário do celular.
- **Controle Financeiro:** Acompanhamento de pagamentos de serviços e mensalidades (Clubinho).
- **Backup & Restauração:** Exportação e importação manual de todos os dados do app via arquivos JSON.

## 🏗️ Estrutura do Projeto

```text
/src
  /components     # Componentes de interface compartilhados
  /constants      # Design tokens (Cores, Espaçamentos)
  /hooks          # Hooks customizados (useTheme, etc)
  /navigation     # Configuração de rotas e tipos
  /screens        # Telas do aplicativo organizadas por contexto
  /services       # Lógica de negócio e integrações externas
  /storage        # Camada de persistência (Drizzle Schema, DAOs)
  /utils          # Funções auxiliares e formatadores
```

## 🛠️ Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

2. **Gere as migrações do banco (Drizzle):**
   ```bash
   npx drizzle-kit generate
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npx expo start
   ```

---
Desenvolvido por **Diego Reis** para o projeto **Petshop Mobile App**.
