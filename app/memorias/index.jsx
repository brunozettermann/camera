import React, { useEffect, useState } from 'react'; 
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

const App = () => {
  const [memories, setMemories] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const loadMemories = async () => {
    try {
      const storedMemories = await AsyncStorage.getItem('memories');
      if (storedMemories) {
        setMemories(JSON.parse(storedMemories));
      }
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  };

  const saveMemories = async (newMemories) => {
    try {
      await AsyncStorage.setItem('memories', JSON.stringify(newMemories));
    } catch (error) {
      console.error('Failed to save memories:', error);
    }
  };

  const addMemory = () => {
    if (text && image) {
      const newMemory = { text, image };
      const updatedMemories = [...memories, newMemory];
      setMemories(updatedMemories);
      saveMemories(updatedMemories);
      setText('');
      setImage(null);
    }
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.memoryListContainer}>
        <FlatList
          data={memories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.memoryItem}>
              <Text style={styles.memoryText}>{item.text}</Text>
              {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            </View>
          )}
        />
      </View>
      <View style={styles.memoryFormContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua memória"
          value={text}
          onChangeText={setText}
          placeholderTextColor="#888"
        />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>Selecionar Imagem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={addMemory}>
          <Text style={styles.buttonText}>Adicionar Memória</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  memoryListContainer: {
    flex: 2,
    padding: 20,
  },
  memoryItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  memoryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  memoryFormContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
