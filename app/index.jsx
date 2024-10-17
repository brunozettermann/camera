import { View, StyleSheet, Text } from "react-native";
import { Link } from 'expo-router';

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282a36', // Cor de fundo escura, estilo moderno
  },
  box: {
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    borderRadius: 20,
    padding: 40,
    backgroundColor: '#44475a', // Caixa com um fundo roxo escuro
    elevation: 8,
  },
  texto: {
    fontSize: 34,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: '#ff79c6', // Título com cor rosa vibrante
    letterSpacing: 2, // Aumenta o espaçamento entre as letras
  },
  link: {
    fontSize: 20,
    color: '#50fa7b', // Verde neon para os links
    textDecorationLine: 'none',
    marginBottom: 20,
    fontWeight: '600',
    backgroundColor: '#6272a4', // Fundo dos links com um roxo suave
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    textAlign: 'center',
  },
});

export default function Page() {
  return (
    <View style={style.container}>
      <View style={style.box}>
        <Text style={style.texto}>Atividades</Text>
        <Link href="/camero" style={style.link}>Camera</Link>
        <Link href="/memorias" style={style.link}>Memorias</Link>
      </View>
    </View>
  );
}
