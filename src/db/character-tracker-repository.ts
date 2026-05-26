import type { SQLiteDatabase } from 'expo-sqlite';

import type { CharacterTracker } from '@/src/features/tracker/types/character-tracker';

type CharacterTrackerRow = {
  id: number;
  character_id: number;
  init: number;
  current_hp: number;
  states: string;
};

function parseStates(states: string) {
  try {
    const parsed = JSON.parse(states);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function mapCharacterTracker(row: CharacterTrackerRow): CharacterTracker {
  return {
    id: row.id,
    characterId: row.character_id,
    init: row.init,
    currentHp: row.current_hp,
    states: parseStates(row.states),
  };
}

export async function getCharacterTrackers(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<CharacterTrackerRow>(
    `
      SELECT id, character_id, init, current_hp, states
      FROM character_trackers
      ORDER BY init DESC, id ASC
    `
  );

  return rows.map(mapCharacterTracker);
}

export async function createCharacterTracker(
  db: SQLiteDatabase,
  tracker: Omit<CharacterTracker, 'id'>
) {
  const result = await db.runAsync(
    `
      INSERT INTO character_trackers (character_id, init, current_hp, states)
      VALUES (?, ?, ?, ?)
    `,
    tracker.characterId,
    tracker.init,
    tracker.currentHp,
    JSON.stringify(tracker.states)
  );

  return {
    id: Number(result.lastInsertRowId),
    ...tracker,
  } satisfies CharacterTracker;
}

export async function updateCharacterTrackerHp(
  db: SQLiteDatabase,
  trackerId: number,
  currentHp: number
) {
  await db.runAsync(
    'UPDATE character_trackers SET current_hp = ? WHERE id = ?',
    currentHp,
    trackerId
  );
}

export async function updateCharacterTrackerInitiative(
  db: SQLiteDatabase,
  trackerId: number,
  init: number
) {
  await db.runAsync(
    'UPDATE character_trackers SET init = ? WHERE id = ?',
    init,
    trackerId
  );
}

export async function updateCharacterTrackerStates(
  db: SQLiteDatabase,
  trackerId: number,
  states: string[]
) {
  await db.runAsync(
    'UPDATE character_trackers SET states = ? WHERE id = ?',
    JSON.stringify(states),
    trackerId
  );
}
