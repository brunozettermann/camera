import { useState, useRef } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library"; 
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Linking } from 'react-native';

export default function Camera() {
    const [permissao, pedirPermissao] = useCameraPermissions();
    const [foto, setFoto] = useState(null);
    const cameraRef = useRef(null);
    const [ladoCamera, setLadoCamera] = useState('back');
    const [permissaoSalvar, pedirPermissaoSalvar] = MediaLibrary.usePermissions();
    const [scanear, setScanear] = useState(false);

    if (!permissao) {
        return <View />;
    }

    if (!permissao.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.textopermissao}>Você precisa permitir o aplicativo acessar sua câmera</Text>
                <TouchableOpacity style={styles.button} onPress={pedirPermissao}>
                    <Text style={styles.buttonText}>Pedir Permissão</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const tirarFoto = async () => {
        const foto = await cameraRef.current?.takePictureAsync({
            quality: 0.5,
            base64: true,
        });
        setFoto(foto);
        console.log(foto);
    };

    const inverterLadoCamera = () => {
        setLadoCamera(ladoCamera === 'back' ? 'front' : 'back');
    };

    const salvarFoto = async () => {
        if (permissaoSalvar.status !== 'granted') {
            await pedirPermissaoSalvar();
        }
        if (foto && foto.uri) {
            await MediaLibrary.saveToLibraryAsync(foto.uri);
            setFoto(null);
        }
    };

    const descartarFoto = () => {
        setFoto(null);
    };

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanear(false);
        const supported = await Linking.canOpenURL(data);
        if (supported) {
            await Linking.openURL(data);
        } else {
            Alert.alert("Não foi possível abrir o link.");
        }
    };

    return (
        <View style={styles.container}>
            {foto ? (
                <View style={styles.previewContainer}>
                    <Image style={styles.image} source={{ uri: foto.uri }} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={descartarFoto}>
                            <Text style={styles.buttonText}>Descartar Imagem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={salvarFoto}>
                            <Text style={styles.buttonText}>Salvar Foto</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : scanear ? (
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            ) : (
                <CameraView style={styles.camera} facing={ladoCamera} ref={cameraRef}>
                    <View style={styles.botaosalvar}>
                        <TouchableOpacity style={styles.button} onPress={tirarFoto}>
                            <Text style={styles.buttonText}>Tirar Foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={inverterLadoCamera}>
                            <Text style={styles.buttonText}>Trocar Lado</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setScanear(true)}>
                            <Text style={styles.buttonText}>Escaneador de Código</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    textopermissao: {
        textAlign: 'center',
    },
    camera: {
        flex: 1,
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        width: '100%',
    },
    botaosalvar: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: 'yellow',
        borderRadius: 20,
        padding: 10,
        width: '40%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
