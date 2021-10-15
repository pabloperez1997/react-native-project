import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { ListItem, Avatar, Divider  } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { FAB } from 'react-native-paper';
import firebase from "../database/firebase";



const ListaPrestamosScreen = (props) => {
  const [prestamos, setPres] = useState([]);
  const [filtradospagos, setFiltradospagos] = useState([]);
  const [filtradosimpagos, setFiltradosimpagos] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    firebase.db.collection("prestamos").where("idCliente", "==", props.route.params.userId).onSnapshot((querySnapshot) => {
      const prestamos = [];
      querySnapshot.docs.forEach((doc) => {
        const { idCliente, nombre, monto, total, fecha,valorcuota, deuda, descripcion, interes, cuotas } = doc.data();
        prestamos.push({
          id: doc.id,
          idCliente,
          nombre,
          monto,
          total,
          valorcuota,
          deuda,
          descripcion,         
          fecha, 
          interes,
          cuotas

        });
      });
      setPres(prestamos);
      setFiltradospagos(prestamos.filter(pres  => pres.deuda == "0")) 
      setFiltradosimpagos(prestamos.filter(pres  => pres.deuda > "0")) 
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }
 



  return (
    <View style={{flex:1, backgroundColor: '#f3f3f3'}}>     
    <ScrollView>
    <Divider 
      color='red'
      width={2} 
      orientation="horizontal"
      subHeader="Préstamos Vigentes"
      subHeaderStyle={{ alignSelf:'center', color: 'red', fontSize: 19, fontWeight:"bold" }}
    />
    <Divider
      color='red'
      width={2} 
      orientation="horizontal"
      
    />

      { filtradosimpagos.map((prestamo) => {
        return (

          <ListItem
            key={prestamo.id}
            bottomDivider
            onPress={() => {
              props.navigation.navigate("ListadePagosScreen", {
                prestamoId: prestamo.id,
              });
            }}
          >
            <ListItem.Chevron />
           
            <Avatar
              source={{
                uri:
                  "data:image/png;base64,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",
              }}
              
            />
              <ListItem.Content>
                <ListItem.Title>Préstamo de: ${prestamo.monto} - {prestamo.nombre}</ListItem.Title>
                <ListItem.Subtitle>Cliente: {prestamo.nombre}</ListItem.Subtitle>
                <ListItem.Subtitle>Fecha: {prestamo.fecha}</ListItem.Subtitle>
                <ListItem.Subtitle>Total a Pagar: ${prestamo.total}</ListItem.Subtitle>
                <ListItem.Subtitle>Interés: %{prestamo.interes}</ListItem.Subtitle>
                <ListItem.Subtitle>Cantidad Cuotas: ${prestamo.cuotas}</ListItem.Subtitle>
                <ListItem.Subtitle>Valor Cuota: ${prestamo.valorcuota}</ListItem.Subtitle>
                <ListItem.Subtitle>Deuda Actual: ${prestamo.deuda}</ListItem.Subtitle>
                <ListItem.Subtitle>Descripción: {prestamo.descripcion}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      })}  
      <Divider
      color='white'
      width={25} 
      orientation="horizontal"
      />      
      <Divider
      color='green'
      width={2} 
      orientation="horizontal"
      subHeader="Préstamos Completados"
      subHeaderStyle={{ letterSpacing:0.25, alignSelf:'center', color: 'green', fontSize: 19, fontWeight:"bold" }}
      />
      <Divider
      color='green'
      width={2} 
      orientation="horizontal"
      />

    
      { filtradospagos.map((prestamo) => {

        // if(prestamos.length=0){
         // return(<Text>No Hay datos para mostrar.</Text>)}
 
        return (
          
          <ListItem
            key={prestamo.id}
            bottomDivider
            onPress={() => {
              props.navigation.navigate("ListadePagosScreen", {
                prestamoId: prestamo.id,
              });
            }}
          >
            <ListItem.Chevron />
            <Avatar
              source={{
                uri:
                  "data:image/png;base64,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"              }}
              
            />
            <ListItem.Content>
              <ListItem.Title>Préstamo de: ${prestamo.monto} - {prestamo.nombre}</ListItem.Title>
              <ListItem.Subtitle>Cliente: {prestamo.nombre}</ListItem.Subtitle>
              <ListItem.Subtitle>Fecha: {prestamo.fecha}</ListItem.Subtitle>
              <ListItem.Subtitle>Total a Pagar: ${prestamo.total}</ListItem.Subtitle>
              <ListItem.Subtitle>Interés: %{prestamo.interes}</ListItem.Subtitle>
              <ListItem.Subtitle>Cantidad Cuotas: {prestamo.cuotas}</ListItem.Subtitle>
              <ListItem.Subtitle>Valor Cuota: ${prestamo.valorcuota}</ListItem.Subtitle>
              <ListItem.Subtitle>Deuda Actual: ${prestamo.deuda}</ListItem.Subtitle>
              <ListItem.Subtitle>Descripción: {prestamo.descripcion}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      })}  

    </ScrollView>

    <FAB
    title="Nuevo Préstamo" 
    style={styles.fab}
    medium
    icon="plus"
    onPress={() => props.navigation.navigate("PrestamosScreen",{userId: props.route.params.userId, userName: props.route.params.userName})}
    onLongPress={() => Alert.alert("Información","Presiona para Crear un Nuevo Préstamo.")}
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
    loader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default ListaPrestamosScreen;