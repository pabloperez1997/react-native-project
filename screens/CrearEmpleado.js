import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator,ScrollView, Input,Alert,Image} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; 
import Button from 'apsl-react-native-button'
import { TextInput } from "react-native-paper";
import auth from '@react-native-firebase/auth';
import firebase from "firebase";
import "firebase/firestore";


const CrearEmpleado = (props) => {
    const initalState = {
      nombre: "",
      correo: "",
      contraseña: "",
    };
  
const [state, setState] = useState(initalState);
const [loading, setLoading] = useState(false);
const handleChangeText = (value, nombre) => {
      setState({ ...state, [nombre]: value });
    };
  
const saveNewUser = async () => {
  setLoading(true);    

  var config = {
    apiKey: "AIzaSyCZjmOJyA-OAAtzO1q1nJmwwgCFowUwRP8",
    authDomain: "proyecto-f6d11.firebaseapp.com",
    projectId: "proyecto-f6d11",
    storageBucket: "proyecto-f6d11.appspot.com",
    messagingSenderId: "164363464516",
    appId: "1:164363464516:web:57cb7d51dedc3a02757111"
  };
  
  let secundaria = firebase.initializeApp(config, "secundaria");
  

    await secundaria.auth().createUserWithEmailAndPassword(state.correo, state.contraseña).
    then((userCredentials)=>{
        if(userCredentials.user)
          userCredentials.user.updateProfile({displayName: state.nombre})}).
    then( ()=> {
        Alert.alert("Empleado Guardado", "El Empleado fue Guardado con éxito.");
        secundaria.auth().signOut() 
        secundaria.delete()
        props.navigation.goBack(null);
        
      }).
    catch (error =>  {
      switch(error.code) {
        case 'auth/weak-password':
              Alert.alert('Error','La Contraseña debe ser de 6 caracteres o más!')
              break;
        case 'auth/email-already-in-use':
              Alert.alert('Error','Ya existe ese email!')
              break;
        case 'auth/invalid-email':
              Alert.alert('Error','Formato de Email Incorrecto!')
              break;
      }
      console.log(error.code)
      secundaria.auth().signOut() 
      secundaria.delete()
      setLoading(false);
    });
  };
    
 

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
                style={styles.input}
                placeholder="Nombre y Apellido"
                onChangeText={(value) => handleChangeText(value, "nombre")}
                value={state.nombre}  
            />
          </View>  
          {/* Email Input */}
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="envelope" size={25} color="#000"/>
            <TextInput
                label="Email"
                style={styles.input}
                placeholder="Email"
                //numberOfLines={4}
                onChangeText={(value) => handleChangeText(value, "correo")}
                value={state.correo}
               
            />
          </View>
          {/* Contraseña Input */}
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="lock" size={30} color="#000"/>
            <TextInput 
                label="Contraseña"
                style={styles.input}
                placeholder="Contraseña"
                //numberOfLines={4}
                onChangeText={(value) => handleChangeText(value, "contraseña")}
                value={state.contraseña}  
            />
          </View> 

          <Button style={styles.buttonGREEN} textStyle={{fontSize: 18,  fontWeight: 'bold', color: 'white',letterSpacing: 0.25,}}
          onPress={() => saveNewUser()} 
          > Guardar Empleado</Button>

        </ScrollView>
      );
}


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
buttonGREEN: {
    flex: 1,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#34DF70',
    borderColor: 'white'
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
    
    paddingLeft : 15,
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
    borderColor:"#0085FF"
  },


});


export default CrearEmpleado;