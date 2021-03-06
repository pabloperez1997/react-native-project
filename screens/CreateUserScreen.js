import React, { useState } from 'react';
import { View, StyleSheet, ScrollView,ActivityIndicator, Input,Alert,Image} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; 
import firebase from "../database/firebase";
import Button from 'apsl-react-native-button'
import { TextInput } from "react-native-paper";


const CreateUserScreen = (props) => {
    const initalState = {
      nombre: "",
      celular: "",
      direccion: "",
    };
  
const [state, setState] = useState(initalState);
const [loading, setLoading] = useState(false);

const handleChangeText = (value, nombre) => {
      setState({ ...state, [nombre]: value });
    };
  
const saveNewUser = async () => {
  setLoading(true);   
  let int = /^\d+$/.test(state.celular);

      if (state.nombre === "") {
        setLoading(false);
        Alert.alert("Error","Por favor, ingrese un Nombre.");
           
        return;
      }

      if(!int){                 
        setLoading(false);  
        Alert.alert("Error","Por favor, compruebe el celular.");
           
        return;
      }  
      
        try {
          await firebase.db.collection("users").add({
            nombre: state.nombre,
            celular: state.celular,
            direccion: state.direccion,
          });
          Alert.alert("Cliente Guardado", "El Cliente fue Guardado con éxito.");
          props.navigation.goBack(null);
        } catch (error) {
          console.log(error)
          setLoading(false);  
        }
        setLoading(false);  
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
          {/* Celular Input */}
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="phone" size={30} color="#000"/>
            <TextInput
                label="Celular"
                style={styles.input}
                placeholder="Celular"
                //numberOfLines={4}
                onChangeText={(value) => handleChangeText(value, "celular")}
                value={state.celular}
                keyboardType="numeric" 
            />
          </View>
          {/* Dirección Input */}
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="map-marker" size={30} color="#000"/>
            <TextInput 
                label="Dirección"
                style={styles.input}
                placeholder="Dirección"
                //numberOfLines={4}
                onChangeText={(value) => handleChangeText(value, "direccion")}
                value={state.direccion}  
            />
          </View> 

          <Button style={styles.buttonGREEN} textStyle={{fontSize: 18,  fontWeight: 'bold', color: 'white',letterSpacing: 0.25,}}
          onPress={() => saveNewUser()} 
          > Guardar Cliente</Button>

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


export default CreateUserScreen;