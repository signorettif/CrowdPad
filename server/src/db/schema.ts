import { db } from '.';

db.run(`
  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    username TEXT NOT NULL,
    command TEXT NOT NULL
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed config with some sensible defaults
db.run(`INSERT OR IGNORE INTO config (key, value) VALUES ('cooldown', '100')`);
db.run(
  `INSERT OR IGNORE INTO config (key, value) VALUES ('pollingInterval', '100')`
);
