import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import { NavigationContainer,Header,DrawerActions  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0085FF',

  },
};

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator()

import UsersList from  './screens/UsersList';
import CreateUserScreen from './screens/CreateUserScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import PrestamosScreen from './screens/PrestamosScreen';
import ListaPrestamosScreen from './screens/ListaPrestamosScreen';
import ListadePagosScreen from './screens/ListadePagosScreen';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

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
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} headerShown={false} options={{headerMode: 'none', headerShown: false}}/> 
      <Stack.Screen name="ListaPrestamosScreen" component={ListaPrestamosScreen} headerShown={false} options={{headerMode: 'none', headerShown: false}}/>
      <Stack.Screen name="ListadePagosScreen" component={ListadePagosScreen} headerShown={false} options={{headerMode: 'none', headerShown: false}}/> 
      <Stack.Screen name="PrestamosScreen" component={PrestamosScreen} headerShown={false} options={{headerMode: 'none', headerShown: false}}/> 
    </Stack.Navigator>
  );
};

function MyDrawer() {
  return (

    <Drawer.Navigator
      screenOptions={{
        
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
        })}
       />
      <Drawer.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ title: "Nuevo Cliente",                  
        }}
      />

      </Drawer.Navigator>

      
  );
}

export default function App() {
  
  return (
    <PaperProvider theme={theme}>
 
    <SafeAreaProvider>
      <NavigationContainer> 
        <MyDrawer/>
      </NavigationContainer>
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
});