import { db } from ".";

db.run(`
  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    username TEXT NOT NULL,
    command TEXT NOT NULL
  );
`);
