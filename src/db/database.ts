import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'pathfinder-easy.db';

export async function migrateDatabaseIfNeeded(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= 1) {
    return;
  }

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS character_templates (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      ca INTEGER NOT NULL,
      max_hp INTEGER NOT NULL,
      is_player INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS character_trackers (
      id INTEGER PRIMARY KEY NOT NULL,
      character_id INTEGER NOT NULL,
      init INTEGER NOT NULL,
      current_hp INTEGER NOT NULL,
      states TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (character_id) REFERENCES character_templates(id)
    );

    PRAGMA user_version = 1;
  `);
}
