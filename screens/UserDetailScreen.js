import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  LogBox,
  Image
} from "react-native";
import { ListItem } from 'react-native-elements';

import firebase from "../database/firebase";
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'apsl-react-native-button'
import { TextInput } from "react-native-paper";

LogBox.ignoreLogs(['Setting a timer']);

const UserDetailScreen = (props) => {
  const initialState = {
    id: "",
    nombre: "",
    celular: "",
    direccion: "",
  };

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const handleTextChange = (value, prop) => {
    setUser({ ...user, [prop]: value });
  };

  const getUserById = async (id) => {
    const dbRef = firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({ ...user, id: doc.id });
    setLoading(false);
  };

  const deleteUser = async () => {
    setLoading(true)
    const dbRef = firebase.db
      .collection("users")
      .doc(props.route.params.userId);
    await dbRef.delete();
    setLoading(false)
    Alert.alert("Cliente Eliminado.", "El Cliente fue Eliminado con éxito.");
    await props.navigation.navigate("UsersList");
  };

  const openConfirmationAlert = () => {
    Alert.alert(
      "Eliminar el Cliente",
      "Estás Seguro?",
      [
        { text: "Si",   onPress: () => deleteUser()}
        ,
        { text: "No", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  const listarPrestamos = async () => {
    props.navigation.navigate("ListaPrestamosScreen",{userId: props.route.params.userId, userName: user.nombre});
   //props.navigation.navigate("PrestamosScreen",{userId: props.route.params.userId, userName: user.nombre });
  };

  const updateUser = async () => {
    const userRef = firebase.db.collection("users").doc(user.id);
    await userRef.set({
      nombre: user.nombre,
      celular: user.celular,
      direccion: user.direccion,
    });
    setUser(initialState);
    props.navigation.navigate("UsersList");
    Alert.alert("Cliente Actualizado.", "El Cliente fue Actualizado con éxito.");
  };

  useEffect(() => {
    getUserById(props.route.params.userId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
   

   
    <ScrollView style={styles.container}>
      {/*Top Large Image */}
        <Image
        source={{ uri:  "https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png" }}
        style={styles.sideMenuProfileIcon}
      />
       {/* Nombre y Apellido Input */}
      <View style={styles.searchSection}>
      <Icon style={styles.searchIcon} name="user" size={30} color="#000"/>
        <TextInput
          label="Nombre y Apellido"
          placeholder="Nombre y Apellido"
          autoCompleteType="username"
          style={styles.input}
          value={user.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
      </View>
      {/* Celular Input */}
      <View style={styles.searchSection}>
      <Icon style={styles.searchIcon} name="phone" size={30} color="#000"/>
        <TextInput
          label="Celular"
          placeholder="Celular"
          autoCompleteType="tel"
          style={styles.input}
          value={user.celular}
          keyboardType="numeric" 
          onChangeText={(value) => handleTextChange(value, "celular")}
        />
      </View>
      {/* Dirección Input */}
      <View style={styles.searchSection}>
      <Icon style={styles.searchIcon} name="map-marker" size={30} color="#000"/>
        <TextInput
          label="Dirección"
          placeholder="Dirección"
          autoCompleteType="street-address"
          style={styles.input}
          value={user.direccion}
          onChangeText={(value) => handleTextChange(value, "direccion")}
        />
      </View>
      <View style={styles.searchSection}>
        <Button style={styles.buttonRED} textStyle={{fontSize: 18,  fontWeight: 'bold', color: 'white', letterSpacing: 0.25, lineHeight: 21}}
          onPress={() => openConfirmationAlert()}
          backgroundColor="#E37399"
        >Eliminar Cliente</Button>
      </View>
      <View style={styles.searchSection}>
        <Button style={styles.buttonGREEN} textStyle={{fontSize: 18,  fontWeight: 'bold', color: 'white', letterSpacing: 0.25,}}
        onPress={() => updateUser()} 
        > Actualizar Datos</Button>
        </View>
        <View style={styles.searchSection}>
        <Button style={styles.buttonGREY} textStyle={{fontSize: 18,  fontWeight: 'bold', color: 'black', letterSpacing: 0.25,}}
          onPress={() => listarPrestamos()}> 
          <Icon style={styles.searchIcon1} name="credit-card" size={25} color="#000"/>  
          Ver Préstamos
          <Icon style={styles.searchIcon1} name="chevron-right" size={25} color="#000"/>  
        </Button>
      </View>
    </ScrollView>
    
    
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
    
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRED: {
      flex: 1,
      marginBottom: 10,
      marginTop: 10,
      backgroundColor: '#FF4141',
      borderColor: 'white',
      
  },
  buttonGREEN: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#34DF70',
    borderColor: 'white'
  },  
  buttonGREY: {
    marginTop:30,
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#E4FEFF',
    borderColor: 'white',
    borderRadius: 0,
  },
 
  searchSection: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
  },
  searchIcon: {
    paddingLeft: 20,
    minWidth:60
    
  },
  searchIcon1: {
    padding : 10,
  },
  input: {
    marginBottom: 0,
    marginTop: 0,
    marginRight: 20,
    flex: 1,
    paddingTop: 0,
    paddingRight: 10,
    paddingBottom: 0,
    paddingLeft: 0,
    backgroundColor: '#fff',
 
    fontSize: 18,
  },


});

export default UserDetailScreen;