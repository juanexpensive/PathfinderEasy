import { useTrackerViewModel } from '@/src/hooks/use-tracker-viewmodel';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { addCharacter, characters, isLoading } = useTrackerViewModel();
  const [name, setName] = useState('');
  const [ca, setCa] = useState('');
  const [maxHp, setMaxHp] = useState('');
  const [isPlayer, setIsPlayer] = useState(true);
  const parsedCa = Number(ca);
  const parsedMaxHp = Number(maxHp);
  const isFormValid =
    name.trim() !== '' &&
    ca.trim() !== '' &&
    maxHp.trim() !== '' &&
    !Number.isNaN(parsedCa) &&
    !Number.isNaN(parsedMaxHp);

  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

  const handleCreateCharacter = async () => {
    if (!name.trim() || Number.isNaN(parsedCa) || Number.isNaN(parsedMaxHp)) {
      return;
    }

    await addCharacter({
      name: name.trim(),
      ca: parsedCa,
      maxHp: parsedMaxHp,
      isPlayer,
    });

    setName('');
    setCa('');
    setMaxHp('');
    setIsPlayer(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PathfinderEasy</Text>
      <View style={styles.form}>
        <TextInput
          onChangeText={setName}
          placeholder="Nombre"
          style={styles.input}
          value={name}
        />
        <TextInput
          keyboardType="numeric"
          onChangeText={setCa}
          placeholder="CA"
          style={styles.input}
          value={ca}
        />
        <TextInput
          keyboardType="numeric"
          onChangeText={setMaxHp}
          placeholder="Vida maxima"
          style={styles.input}
          value={maxHp}
        />
        <View style={styles.switchRow}>
          <Text>Es jugador</Text>
          <Switch onValueChange={setIsPlayer} value={isPlayer} />
        </View>
        <Pressable
          disabled={!isFormValid}
          onPress={handleCreateCharacter}
          style={isFormValid ? styles.button : styles.buttonDisabled}
        >
          <Text style={styles.buttonText}>Guardar personaje</Text>
        </Pressable>
      </View>

      {characters.length === 0 ? (
        <Text>No hay personajes guardados</Text>
      ) : null}

      {characters.map((character) => (
        <Text key={character.id}>{character.name}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1f6feb',
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonDisabled: {
    alignItems: 'center',
    backgroundColor: '#6d6969',
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
