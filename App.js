import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, SafeAreaView,  Image, Linking, ActivityIndicator } from 'react-native';
import { NavigationContainer, Header, DrawerActions, NetInfo,getFocusedRouteNameFromRoute,CommonActions  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import UsersList from  './screens/UsersList';
import CreateUserScreen from './screens/CreateUserScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import PrestamosScreen from './screens/PrestamosScreen';
import CrearEmpleado from './screens/CrearEmpleado';
import ListaPrestamosScreen from './screens/ListaPrestamosScreen';
import ListadePagosScreen from './screens/ListadePagosScreen';
import CobrosDelDia from './screens/CobrosDelDia'
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from "@react-native-community/netinfo";
import {  DrawerContentScrollView,  DrawerItemList,  DrawerItem} from '@react-navigation/drawer'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0085FF',

  },
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

let logueado  = false;
let conectado = false;


function LoginApp(props) {
//Para mostar Password
  const [icon, setIcon] = useState("eye");
  const [mostrar, setMostrar] = useState(true);
  const changeIcon = () => {
    if(icon === "eye"){
      setIcon("eye-off");
      setMostrar(false);
    }
    else{
      setIcon("eye");
      setMostrar(true);
    }
  }
 
  const Conectado = useNetInfo().isConnected;
  conectado= Conectado;
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
   setUser(user)
   logueado= user;
   //console.log(logueado);
   if (initializing) setInitializing(false);
 }
 


  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const VerificarConexion = () => {



  if(conectado){
    return false;
  }
  else{
    if(logueado)
    return (
      <View >
      <View style={styles.containerErr1}>
      <Text style={styles.inputErr}> <Icon style={styles.inputErr} size={25} name='exclamation-triangle' color='white'/> Error de Conexión a Internet</Text>
      </View>
       
      <TouchableOpacity >
               
      <View style={{marginTop:'50%', justiftyContent:"center", alignItems:"center"}} >
      <Ionicons name="reload" size={40} color={'black'} />
      <Text>Recargar</Text>
      </View>  

      </TouchableOpacity>

      </View>  
    );
    else
    return(
      <View style={styles.containerErr}>
      <Text style={styles.inputErr}> <Icon style={styles.inputErr} size={25} name='exclamation-triangle' color='white'/> Error de Conexión a Internet</Text>
      </View>
    );
  }
  }

  logIn = () => { 
    setLoading(true)
    try {
     // console.log(email,pass)
        auth()
        .signInWithEmailAndPassword(email.email, pass.pass)
        .then((userCredential) => {
         setLoading(false)
         Alert.alert('Bienvenido', 'Iniciaste Sesión como: ' + userCredential.user.displayName)
         

        }).catch((error) => {   
          setLoading(false)
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
      setLoading(false)
      Alert.alert('Usuario Incorrecto.','Verifique su usuario y Contraseña')
    }
    
  }
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
}
  if (!user) {
    return (
      <View style={styles.cantainer1}>
      <VerificarConexion/>
      <Text style={styles.headerTxt}>BIENVENIDO</Text>
      <View style={styles.subView}>
        <Text style={styles.subTxt}>Iniciar Sesión</Text>
          <View style={styles.searchSection}>
            <TextInput autoCompleteType="email" left={<TextInput.Icon size={30} name="account" />} mode="outlined" label="Email" style={styles.input} placeholder="Email" onChangeText={(email => { setEmail({ email }) })} />
          </View>
          <View style={styles.searchSection} >
            <TextInput left={<TextInput.Icon size={30} name="lock" />} right={<TextInput.Icon onPress={()=>changeIcon()} name={icon} />} mode="outlined" label="Contraseña" style={styles.input} secureTextEntry={mostrar} placeholder="Contraseña" onChangeText={(pass => { setPass({ pass }) })} />
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
  
  else if( user &&!conectado){
  return (
    
      <VerificarConexion/>
        
  
  );
  }
  else if (user && conectado){
    return (
    <NavigationContainer> 
      <VerificarConexion/>
      <MyDrawer/>
    </NavigationContainer>
    )
  }
}

function CerrarSesion() {

  Alert.alert(
    "Cerrar Sesión",
    "Estás Seguro?",
    [
      { text: "Si", onPress: () => auth().signOut()}
      ,
      { text: "No", onPress: () => console.log("canceled") },
    ],
    {
      cancelable: true,
    }
    )

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
    case 'CrearEmpleado':
      return 'Crear Empleado';  

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

const CustomSidebarMenu = (props,user) => {

  return (
    <SafeAreaProvider style={{ flex: 1, }}>
      {/*Top Large Image */}
      <Image
        source={{ uri: "https://www.vas-groupec.com/wp-content/uploads/2018/02/hombre.png" }}
        style={styles.sideMenuProfileIcon}
      />
        <Text style={{ fontWeight:'bold', fontSize: 18, textAlign: 'center', color: 'black' }}>
        {auth().currentUser ? auth().currentUser.displayName : ""}</Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: 'grey' }}>
        {auth().currentUser ? auth().currentUser.email : ""}
        
      </Text>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity 
      onPress={ () => CerrarSesion()}>
      <View style={styles.item}>
        <View style={styles.iconContainer}>
        <Ionicons name="log-out-outline" size={35} color={'black'} />
        </View>
        <Text style={styles.label}>Cerrar Sesión</Text>
      </View>
      </TouchableOpacity>
      

    </SafeAreaProvider>
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
        },
        unmountOnBlur: true  
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
     
    >  
      <Drawer.Screen        
        name="Lista de Clientes"
        component={ListaClientesAndDetalles}
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          drawerIcon: () => (
            <Ionicons name="people" size={35} color={'black'} />
          ),
        })  }
        
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

      {(() => {
        if(auth().currentUser)
              if (auth().currentUser.email == 'bruno@gmail.com'){
                  return (
                    <Drawer.Screen
                    name="CrearEmpleado"
                    component={CrearEmpleado}
                    options={{ title: "Crear Empleado", 
                    drawerIcon: () => (
                      <Ionicons name="add-circle" size={35} color={'black'} />
                    ),                 
                    }}
                  />
                  )
              }
              
              return null;

              })()}
     
     

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
  containerErr1: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    
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
  inputErrView: {
    flex: 1,

  },
  inputErr1: {
    fontSize:18 ,
    fontWeight: "bold",
    color: 'white'
  },
  containerErr1: {
    height:30,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  containerErr: {
    flex: 0.3,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  inputErr: {
    fontSize:18 ,
    fontWeight: "bold",
    color: 'white'
  },
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
    marginTop: 200,
    borderRadius: 20,
    
  },
  headerTxt: {
    
    fontSize: 40,
    marginLeft: 40,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    marginTop: 100,
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
    flex: 1,
    flexDirection: 'row',
    height:50,
    backgroundColor: 'blue',
    borderRadius: 5,
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

    marginEnd:0,
    borderRadius: 50,
    },
    searchIcon: {
      paddingLeft: 0,
      paddingRight: 20,
 
    },
    searchIcon1: {
      padding : 10,
    },
    input: {
      marginBottom: 0,
      marginTop: 0,
      marginRight: 0,
      flex: 1,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      backgroundColor: '#fff',
      fontSize: 18,
    },
    sideMenuProfileIcon: {
      resizeMode: 'center',
      width: 100,
      height: 100,
      borderRadius: 100 / 2,
      alignSelf: 'center',
    },

    customItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      margin: 20,
      fontSize: 16,
      fontWeight: 'bold',
      color: 'rgba(0, 0, 0, .87)',
    },
    iconContainer: {
      marginHorizontal: 20,
      alignItems: 'center',
    },
    
});