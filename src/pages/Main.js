import React, {useEffect, useState} from 'react';
import { Image, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Logo from '../imgs/logo.png';
import Like from '../imgs/like.png';
import Dislike from '../imgs/dislike.png';

import api from '../services/api';

export default function Main({ navigation }) {
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers () {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            });
            setUsers(response.data);
        }

        loadUsers();

    }, [id]);

    async function handleLike() {
        const [ user, ... rest ] = users;

        await api.post(`/devs/like/${user.id}`, null, {
            headers: { user: id }
        });

        setUsers(rest);
    }

    async function handleDislike(id) {
        const [ user, ... rest ] = users;

        // console.log(user.id);

        await api.post(`/devs/dislike/${user.id}`, null, {
            headers: { user: id }
        }).then((result) => {
            setUsers(rest);
        });
    }

    async function handleSignOut() {
        AsyncStorage.clear();
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleSignOut}>
                <Image source={Logo} style={styles.logo}/>
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                { users.length === 0 ? <Text style={styles.empty}> Acabou :( </Text> : (
                    users.map((user, index) => {
                        return (
                            <View style={[styles.card, { zIndex: users.length - index }]}  key={user.id}>
                                <Image source={{ uri: user.avatar }} style={styles.userImg}/>
                                <View style={styles.footer}>
                                    <Text style={styles.nome}>
                                        {user.nome}
                                    </Text>
                                    <Text style={styles.bio} numberOfLines={3}>
                                        {user.bio}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </View>
            {users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={Dislike} style={styles.imgButton}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={Like} style={styles.imgButton}/>
                    </TouchableOpacity>
                </View>
            )}
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    logo: {
        marginVertical: 30,
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 600,
    },
    
    card: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        height: 500,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0, 
        right: 0,
        bottom: 0,
    },

    userImg: {
        flex: 1,
        height: 600,
    },

    footer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,
    },
    
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    empty: {
        flex: 1,
        alignSelf: 'center',
        color: '#999',
        fontWeight: 'bold',
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 100,
        elevation: 2, 
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },

});