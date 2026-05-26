import {
  createCharacterTemplate,
  getCharacterTemplates,
} from '@/src/db/character-template-repository';
import type { CharacterTemplate } from '@/src/domain/character/character-template';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

export function useTrackerViewModel() {
  const db = useSQLiteContext();

  const [characters, setCharacters] = useState<CharacterTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const data = await getCharacterTemplates(db);
      setCharacters(data);
    } finally {
      setIsLoading(false);
    }
  };

  const addCharacter = async (character: Omit<CharacterTemplate, 'id'>) => {
    await createCharacterTemplate(db, character);
    await loadCharacters();
  };

  useEffect(() => {
    loadCharacters();
  }, [db]);

  return {
    addCharacter,
    characters,
    isLoading,
  };
}
