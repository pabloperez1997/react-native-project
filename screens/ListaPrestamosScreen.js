import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { FAB } from 'react-native-paper';
import firebase from "../database/firebase";



const ListaPrestamosScreen = (props) => {
  const [prestamos, setPres] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    firebase.db.collection("prestamos").where("idCliente", "==", props.route.params.userId).onSnapshot((querySnapshot) => {
      const prestamos = [];
      querySnapshot.docs.forEach((doc) => {
        const { idCliente, nombre, monto, total, fecha,valorcuota, deuda, descripcion } = doc.data();
        prestamos.push({
          id: doc.id,
          idCliente,
          nombre,
          monto,
          total,
          valorcuota,
          deuda,
          descripcion,         
          fecha

        });
      });
      setPres(prestamos);
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

      {prestamos.map((prestamo) => {
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
                  "https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/128/external-money-banking-and-finance-kiranshastry-lineal-color-kiranshastry-4.png",
              }}
              
            />
            <ListItem.Content>
              <ListItem.Title>Préstamo de: ${prestamo.monto} - {prestamo.nombre}</ListItem.Title>
              <ListItem.Subtitle>Cliente: {prestamo.nombre}</ListItem.Subtitle>
              <ListItem.Subtitle>Fecha: {prestamo.fecha}</ListItem.Subtitle>
              <ListItem.Subtitle>Total Préstamo: ${prestamo.monto}</ListItem.Subtitle>
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