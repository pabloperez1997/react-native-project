import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import { ListItem, Avatar, SearchBar } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import { FAB } from 'react-native-paper';
import firebase from "../database/firebase";

const UserScreen = (props) => {
const [users, setUsers] = useState([]);
const [arrayholder, setFilter] = useState([]);

const [estado, setEstado] = useState("");



const handleChangeText = (value) => {
  setEstado(value);
  searchFilterFunction(value);
};

  useEffect(() => {
    firebase.db.collection("users").onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.docs.forEach((doc) => {
        const { nombre, celular, direccion } = doc.data();
        users.push({
          id: doc.id,
          nombre,
          celular,
          direccion,
        });
      });
      setUsers(users);
      setFilter(users);
    });
  }, []);

  searchFilterFunction = (text) => {

  console.log(arrayholder)
    const newData = users.filter(item => {
      const itemData = item.nombre.toUpperCase();
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setFilter(newData);
  };


  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>   
      <SearchBar
       containerStyle={{backgroundColor: 'white'}}
        placeholder="Buscar Cliente..."
        lightTheme
        round
        onChangeText={(value) => handleChangeText(value, "estado")}
        autoCorrect={false}
        value={estado}
      />
    <ScrollView>

      {arrayholder.map((user) => {
        return (
          <ListItem
            key={user.id}
            bottomDivider
            onPress={() => {
              props.navigation.navigate("UserDetailScreen", {
                userId: user.id,
              });
            }}
          >
            <ListItem.Chevron />
            <Avatar
              source={{
                uri:
                  "https://cdn-icons-png.flaticon.com/512/147/147144.png",
              }}
              rounded
            />
            <ListItem.Content>
              <ListItem.Title>{user.nombre}</ListItem.Title>
              <ListItem.Subtitle>{user.celular}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      })}   
    </ScrollView>

    <FAB
    title="Nuevo Cliente" 
    style={styles.fab}
    medium
    icon="plus"
    onPress={() => props.navigation.navigate("CreateUserScreen")}
    onLongPress={() => alert("Presiona para Crear un Nuevo Cliente.")}
    />
    </View>
  );
};

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: '#19AC52'
    },
  });

export default UserScreen;