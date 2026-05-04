---
type: community
cohesion: 0.33
members: 6
---

# Navigation and Screens

**Cohesion:** 0.33 - loosely connected
**Members:** 6 nodes

## Members
- [[Backup Screen]] - code - src/screens/Home/BackupScreen.tsx
- [[Database Backup Service]] - code - src/services/DatabaseBackupService.ts
- [[Home Screen]] - code - src/screens/Home/HomeScreen.tsx
- [[Home Stack]] - code - src/navigation/stacks/HomeStack.tsx
- [[Home Stack Param List]] - code - src/navigation/types.ts
- [[SQLite Drizzle DB]] - code - src/storage/database/connection.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Navigation_and_Screens
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Project Notes]]

## Top bridge nodes
- [[Home Stack]] - degree 4, connects to 1 community
- [[Home Screen]] - degree 2, connects to 1 community