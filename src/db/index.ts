import type { Database } from 'better-sqlite3';
export const db: Database = require('better-sqlite3')(
  './db/label-system.db',
  {},
);
export const initDB = async () => {
  db.prepare('');
};
