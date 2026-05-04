---
type: community
cohesion: 0.29
members: 8
---

# App Architecture

**Cohesion:** 0.29 - loosely connected
**Members:** 8 nodes

## Members
- [[ClientService.test.ts]] - code - src/services/__tests__/ClientService.test.ts
- [[ClientService.ts]] - code - src/services/ClientService.ts
- [[clubinho.ts]] - code - src/services/utils/clubinho.ts
- [[ensureCurrentMonthClubinhoIfNeeded()]] - code - src/services/ClientService.ts
- [[hasFeeChanged()]] - code - src/services/ClientService.ts
- [[nextReferenceMonth()]] - code - src/services/ClientService.ts
- [[normalizeDueDay()]] - code - src/services/utils/clubinho.ts
- [[normalizeInput()]] - code - src/services/ClientService.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/App_Architecture
SORT file.name ASC
```
