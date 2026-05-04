# Graph Report - .  (2026-05-04)

## Corpus Check
- 60 files · ~68,794 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 324 nodes · 378 edges · 40 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 1% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 22 edges
2. `Petshop Mobile App - Gerente Cão Carioca` - 20 edges
3. `AppText()` - 17 edges
4. `Petshop Project - Agent Guidelines` - 12 edges
5. `AppCard()` - 10 edges
6. `Owner DAO` - 9 edges
7. `Petshop Mobile App - Product Requirements Document (PRD)` - 9 edges
8. `Clients Stack` - 8 edges
9. `Design System - Gerente Cão Carioca` - 8 edges
10. `Petshop Mobile App - Software Design Document (SDD)` - 8 edges

## Surprising Connections (you probably didn't know these)
- `babel-preset-expo` --conceptually_related_to--> `Expo app config`  [INFERRED]
  babel.config.js → app.json
- `Expo Metro default config` --conceptually_related_to--> `Expo app config`  [INFERRED]
  metro.config.js → app.json
- `App root component registration` --conceptually_related_to--> `Expo app config`  [INFERRED]
  index.ts → app.json
- `useDatabase` --conceptually_related_to--> `Storage Layer`  [INFERRED]
  src/hooks/useDatabase.ts → docs/sdd.md
- `Petshop Cão Carioca logo` --semantically_similar_to--> `Petshop Cão Carioca launcher icon xxxhdpi`  [INFERRED] [semantically similar]
  assets/image/icon.png → android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.webp

## Hyperedges (group relationships)
- **Monthly Finance Workflow** — financescreen_financescreen, financeservice_financeservice, paymentdao_paymentdao, expensedao_expensedao [INFERRED 0.95]
- **Android launcher icon density set** — ic_launcher_xxxhdpi_petshop_cao_carioca_logo, ic_launcher_xxhdpi_petshop_cao_carioca_logo, ic_launcher_xhdpi_petshop_cao_carioca_logo, ic_launcher_mdpi_petshop_cao_carioca_logo, ic_launcher_hdpi_petshop_cao_carioca_logo [INFERRED 0.95]
- **Android launcher foreground density set** — ic_launcher_xxxhdpi_foreground_petshop_cao_carioca_logo, ic_launcher_xxhdpi_foreground_petshop_cao_carioca_logo, ic_launcher_xhdpi_foreground_petshop_cao_carioca_logo, ic_launcher_mdpi_foreground_petshop_cao_carioca_logo, ic_launcher_hdpi_foreground_petshop_cao_carioca_logo [INFERRED 0.95]
- **Android splashscreen logo density set** — splashscreen_logo_xxxhdpi_petshop_cao_carioca_logo, splashscreen_logo_xxhdpi_petshop_cao_carioca_logo, splashscreen_logo_xhdpi_petshop_cao_carioca_logo, splashscreen_logo_mdpi_petshop_cao_carioca_logo, splashscreen_logo_hdpi_petshop_cao_carioca_logo [INFERRED 0.95]
- **Screen-Service-Storage-UI Flow** — agents_fluxo_obrigatorio_de_dados, sdd_data_flow, sdd_service_layer, sdd_storage_layer [INFERRED 0.95]
- **Monthly Finance Workflow** — agents_financas, prd_financial_control, sdd_financeservice, readme_controlle_financeiro [INFERRED 0.85]
- **UI System Consistency** — agents_ui_premium_e_consistente, design_system_visual_standards, design_system_apptext, design_system_appbutton [INFERRED 0.95]
- **Monthly Finance Workflow** — financescreen_financescreen, financeservice_financeservice, paymentdao_paymentdao, expensedao_expensedao [INFERRED 0.95]
- **Drizzle migration chain** — drizzle_migrations_journal, drizzle_migrations_m0000, drizzle_migrations_m0001, drizzle_migrations_m0002, drizzle_migrations_m0003, drizzle_migrations_m0004, drizzle_migrations_m0005 [EXTRACTED 1.00]
- **Petshop finance schema** — m0000_payments_table, m0002_payments_description, m0002_payments_paid_at, m0003_payments_receipt_issued_at, m0004_expenses_table [INFERRED 0.85]
- **Android launcher icon density set** — ic_launcher_xxxhdpi_petshop_cao_carioca_logo, ic_launcher_xxhdpi_petshop_cao_carioca_logo, ic_launcher_xhdpi_petshop_cao_carioca_logo, ic_launcher_mdpi_petshop_cao_carioca_logo, ic_launcher_hdpi_petshop_cao_carioca_logo [INFERRED 0.95]
- **Android launcher foreground density set** — ic_launcher_xxxhdpi_foreground_petshop_cao_carioca_logo, ic_launcher_xxhdpi_foreground_petshop_cao_carioca_logo, ic_launcher_xhdpi_foreground_petshop_cao_carioca_logo, ic_launcher_mdpi_foreground_petshop_cao_carioca_logo, ic_launcher_hdpi_foreground_petshop_cao_carioca_logo [INFERRED 0.95]
- **Android splashscreen logo density set** — splashscreen_logo_xxxhdpi_petshop_cao_carioca_logo, splashscreen_logo_xxhdpi_petshop_cao_carioca_logo, splashscreen_logo_xhdpi_petshop_cao_carioca_logo, splashscreen_logo_mdpi_petshop_cao_carioca_logo, splashscreen_logo_hdpi_petshop_cao_carioca_logo [INFERRED 0.95]

## Communities (49 total, 24 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (36): Agenda, Architecture First, Backup/Restore, Business Logic Separation, Clientes e Pets, design system, Finanças, Fluxo obrigatório de dados (+28 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (6): useTheme(), handleSave(), validate(), AppCard(), AppInput(), AppText()

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (34): Add Appointment Screen, Add Edit Client Screen, Add Edit Pet Screen, Agenda Screen, Agenda Stack, App, App Navigator, Appointment DAO (+26 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (21): babel-plugin-inline-import, Drizzle output directory, Drizzle schema path, migrations journal, migration 0000 init fix schema, migration 0001 handy the phantom, migration 0002 bitter panther, migration 0003 bent deathstrike (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.1
Nodes (20): Agenda Inteligente, Backup & Restauração, Gestão de Clientes e Pets, Controle Financeiro, DAO Pattern, Dark Mode, Design Tokens, Drizzle ORM (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (8): useDatabase(), AppNavigator(), App(), AgendaStack(), ClientsStack(), FinanceStack(), HomeStack(), PetsStack()

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (8): createCalendarEvent(), generateInstances(), getCalendarId(), handleSave(), NavHelper(), addMonths(), getReferenceMonth(), buildMonthlyDueDate()

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (4): confirmReopenPayment(), handleCloseServiceModal(), handleCreateServicePayment(), handleMarkAsOpen()

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (14): UI Premium e consistente, AppButton, AppCard, AppInput, AppText, Color Palette, Empty States, Design System - Gerente Cão Carioca (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (14): Agenda / Scheduling, Appointments, Backup & Restore, Customer & Pet Management, Financial Control, Goals, Introduction, Monthly Payments (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.31
Nodes (5): handlePhoneChange(), handleSave(), validate(), formatCurrency(), formatPhone()

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (9): Expo app config, babel-preset-expo, react-native-reanimated plugin, ignored Expo and native build artifacts, App root component registration, Expo Metro default config, runtime dependencies, main entrypoint (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.36
Nodes (4): buildReceiptHtml(), escapeHtml(), formatCurrency(), formatDateTime()

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (6): Backup Screen, SQLite Drizzle DB, Database Backup Service, Home Screen, Home Stack, Home Stack Param List

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (4): Petshop Cão Carioca launcher icon xxxhdpi, Petshop Cão Carioca logo, Petshop Cão Carioca splash logo, Petshop Cão Carioca splashscreen logo xxxhdpi

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (3): agent_evals agent.py, agent_evals evals.py, agent_evals README

## Ambiguous Edges - Review These
- `agent_evals README` → `agent_evals evals.py`  [AMBIGUOUS]
  agent_evals/README.md · relation: conceptually_related_to
- `agent_evals README` → `agent_evals agent.py`  [AMBIGUOUS]
  agent_evals/README.md · relation: conceptually_related_to

## Knowledge Gaps
- **106 isolated node(s):** `App`, `Colors`, `useDatabase`, `useTheme`, `Root Tab Param List` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `agent_evals README` and `agent_evals evals.py`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `agent_evals README` and `agent_evals agent.py`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `useTheme()` connect `Community 1` to `Community 11`, `Community 5`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `Petshop Project - Agent Guidelines` connect `Community 0` to `Community 8`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `useTheme()` (e.g. with `AppCard()` and `AppInput()`) actually correct?**
  _`useTheme()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `App`, `Colors`, `useDatabase` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._