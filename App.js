import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View,Button,TouchableOpacity,Alert } from 'react-native';
import { NavigationContainer,Header,DrawerActions  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import UsersList from  './screens/UsersList';
import CreateUserScreen from './screens/CreateUserScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import PrestamosScreen from './screens/PrestamosScreen';
import ListaPrestamosScreen from './screens/ListaPrestamosScreen';
import ListadePagosScreen from './screens/ListadePagosScreen';
import CobrosDelDia from './screens/CobrosDelDia'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0085FF',

  },
};

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator()

function LoginApp() {


  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [email, setEmail] = useState();
  const [pass, setPass] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  

  logIn = () => {
  
    try {
      
     // console.log(email,pass)
        auth()
        .signInWithEmailAndPassword(email.email, pass.pass)
        .then((userCredential) => {

         
          //userCredential.catch((error)
          // Signed in
         // user = userCredential.user;
          // ...
         Alert.alert('Bienvenido', 'Iniciaste Sesión como: ' + userCredential.user.email)
           
          //Alert.alert(usua)
        }).catch((error) => {   
          switch(error.code) {
            case 'auth/wrong-password':
                  Alert.alert('Error','Contraseña Incorrecta!')
                  break;
            case 'auth/user-not-found':
                  Alert.alert('Error','Usuario Inexistente!')
                  break;
            case 'auth/invalid-email':
                  Alert.alert('Error','Formato de Email Incorrecto!')
                  break;
            //default :
            //      Alert.alert('Error','Error Al iniciar Sesión!')
            //      break;
            
         }
         })
    }
    catch (error) {
      //console.log('error');
      Alert.alert('Usuario Incorrecto.','Verifique su usuario y Contraseña')
    }
  }
  

  if (!user) {
    return (
      <View style={styles.cantainer1}>
      <Text style={styles.headerTxt}>BIENVENIDO</Text>
      <View style={styles.subView}>
        <Text style={styles.subTxt}>Iniciar Sesión</Text>
          <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="user" size={30} color="#000"/>
            <TextInput label="Email" style={styles.input} placeholder="Email" onChangeText={(email => { setEmail({ email }) })} />
          </View>
          <View style={styles.searchSection} >
            <Icon style={styles.searchIcon} name="lock" size={30} color="#000"/>
            <TextInput label="Contraseña" style={styles.input} placeholder="Contraseña" onChangeText={(pass => { setPass({ pass }) })} />
          </View>

          <View style={styles.searchSection} >
            <TouchableOpacity style={styles.btn}  onPress={logIn}>
          <Text style={styles.btnTxt} letterSpacing={0.25} >Iniciar Sesión</Text>
          
        </TouchableOpacity>
        </View>
      </View>
    </View>
    );
  }

  return (
    <NavigationContainer> 
        <MyDrawer/>
    </NavigationContainer>
  );
}

function CerrarSesion() {
  
  auth().signOut()
    
  return (
    null
  );
}


function getHeaderTitle(route) {
  
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'UsersList';

  switch (routeName) {
    case 'UsersList':
      return 'Lista de Clientes';
    case 'UserDetailScreen':
      return 'Detalles del Cliente';
    case 'PrestamosScreen':
      return 'Nuevo Préstamo';
    case 'ListaPrestamosScreen':
      return 'Lista de Préstamos';
    case 'ListadePagosScreen':
      return 'Lista de Cuotas';

  }
}

const ListaClientesAndDetalles = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UsersList" component={UsersList} headerShown={false} options={{headerMode: 'none', headerShown: false}}/>
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen}  options={{headerTitle: 'Atrás'}} /> 
      <Stack.Screen name="ListaPrestamosScreen" component={ListaPrestamosScreen} options={{headerTitle: 'Atrás'}}/>
      <Stack.Screen name="ListadePagosScreen" component={ListadePagosScreen} options={{headerTitle: 'Atrás'}}/> 
      <Stack.Screen name="PrestamosScreen" component={PrestamosScreen} options={{headerTitle: 'Atrás'}}/> 
    </Stack.Navigator>
  );
};

function MyDrawer() {
  return (

    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',

        },
        headerStyle: {
          backgroundColor: "#0085FF",
          
        },
        headerTintColor: "#fff",
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: "bold",
        }
      }}
    >  
      <Drawer.Screen
      
        name="Lista de Clientes"
        component={ListaClientesAndDetalles}
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          drawerIcon: () => (
            <Ionicons name="people" size={35} color={'black'} />
          ),
        })}
        
       />
      <Drawer.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ title: "Nuevo Cliente",   
        drawerIcon: () => (
          <Ionicons name="person-add" size={35} color={'black'} />
        ), 
                     
        }}
      />

      <Drawer.Screen
        name="CobrosDelDia"
        component={CobrosDelDia}
        options={{ title: "Cobros del Día", 
        drawerIcon: () => (
          <Ionicons name="cash-outline" size={35} color={'black'} />
        ),                 
        }}
      />

      <Drawer.Screen
        name="CerrarSesion"
        component={CerrarSesion}
        options={{ title: "Cerrar Sesión", 
        drawerIcon: () => (
          <Ionicons name="log-out-outline" size={35} color={'black'} />
        ),                 
        }}
      />



      </Drawer.Navigator>

      
  );
}

export default function App() {
 
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>

      <LoginApp/>
    
    </SafeAreaProvider>

    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cantainer1: {
    backgroundColor: '#0085FF',
    height: '100%',
    padding:5
  },
  subView: {
    backgroundColor: 'white',
    height: 430,
    marginTop: 240,
    borderRadius: 20,
    
  },
  headerTxt: {
    
    fontSize: 40,
    marginLeft: 40,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    marginTop: 140,
  },
  subTxt: {
    color: 'black',
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 70,
  },
  nameInput: {
    width: 270,
    marginLeft: 40,
    borderBottomWidth: 0,
    marginTop: 30,
    fontSize: 20,
    backgroundColor: '#fff'
  },
  btn: {
    height: 50,
    width: 300,
    backgroundColor: 'blue',
    borderRadius: 80,
    borderWidth: 0,
 
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  endView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  endTxt: {
    fontSize: 15,
    marginTop: 30,
    marginLeft: 60,
    fontWeight: 'bold',
  },
  endBtn: {
    marginRight: 80,
  },
  loginTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
  },
  searchSection: {
    
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    paddingTop: 0,
    paddingBottom: 0,
    marginEnd:0,
    borderRadius: 50,
    },
    searchIcon: {
      paddingLeft: 20,
     
 
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