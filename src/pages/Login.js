import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Logo from '../imgs/logo.png';

import api from '../services/api';

export default function Login ({ navigation }) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then((user) => {
            if(user) navigation.navigate('Main', { user: user });
        });
    });

    async function handleLogin() {
        const response = await api.post('/devs/store', { 'username': username });

        const { id_user } = response.data;

        await AsyncStorage.setItem('user', JSON.stringify(id_user));

        navigation.navigate('Main', { user: id_user });
    }

    return (
        <KeyboardAvoidingView 
        behavior="padding"
        enabled={Platform.OS === 'ios'}
        style={styles.container}
        >
            <Image source={Logo} />
            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                placeholder="Digite seu usuário do Github" 
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>
                    Enviar
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10, 
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});