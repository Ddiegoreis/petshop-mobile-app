// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_init_fix_schema.sql';
import m0001 from './0001_handy_the_phantom.sql';
import m0002 from './0002_bitter_panther.sql';
import m0003 from './0003_bent_deathstrike.sql';
import m0004 from './0004_expenses.sql';
import m0005 from './0005_clubinho_due_day.sql';

  export default {
    journal,
    migrations: {
      m0000,
 m0001,
 m0002,
 m0003,
 m0004,
 m0005
    }
  }
  
