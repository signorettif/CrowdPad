import { db } from '.';

// Enable WAL mode and optimize settings
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');
db.exec('PRAGMA cache_size = 1000000000;');
db.exec('PRAGMA temp_store = memory;');

// Migrations
db.run(`
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed config with some sensible defaults
db.run(`INSERT OR IGNORE INTO config (key, value) VALUES ('cooldown', '100')`);
