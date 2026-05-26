import type { SQLiteDatabase } from 'expo-sqlite';

import type { CharacterTemplate } from '@/src/domain/character/character-template';

type CharacterTemplateRow = {
  id: number;
  name: string;
  ca: number;
  max_hp: number;
  is_player: number;
};

function mapCharacterTemplate(row: CharacterTemplateRow): CharacterTemplate {
  return {
    id: row.id,
    name: row.name,
    ca: row.ca,
    maxHp: row.max_hp,
    isPlayer: Boolean(row.is_player),
  };
}

export async function getCharacterTemplates(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<CharacterTemplateRow>(
    'SELECT id, name, ca, max_hp, is_player FROM character_templates ORDER BY name ASC'
  );

  return rows.map(mapCharacterTemplate);
}

export async function createCharacterTemplate(
  db: SQLiteDatabase,
  character: Omit<CharacterTemplate, 'id'>
) {
  const result = await db.runAsync(
    `
      INSERT INTO character_templates (name, ca, max_hp, is_player)
      VALUES (?, ?, ?, ?)
    `,
    character.name,
    character.ca,
    character.maxHp,
    character.isPlayer ? 1 : 0
  );

  return {
    id: Number(result.lastInsertRowId),
    ...character,
  } satisfies CharacterTemplate;
}
