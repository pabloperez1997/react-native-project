import React, { useState, useEffect } from "react";
import { Button, StyleSheet,ActivityIndicator, View, Alert } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import firebase from "../database/firebase";
import Moment from 'moment';
import 'moment/locale/es';

const CobrosDelDia = (props) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  Moment.locale('es');
  const [date, setDate] = useState(Moment(new Date()).format('dddd DD/MM/yyyy'))

  useEffect(() => {
    firebase.db.collection("pagos").where("fechapagar", "==", date.toString()).orderBy("paga","asc").onSnapshot((querySnapshot) => {
      const pagos = [];
      querySnapshot.docs.forEach((doc) => {
        const { nombre, valor, paga, fechapagar, cuota, cobrador, fechacobro } = doc.data();
        pagos.push({
          id: doc.id,
          nombre,
          valor,
          paga,
          fechapagar,
          cuota,
          cobrador,
          fechacobro
        });
      });
      setPagos(pagos);
      setLoading(false);
    });
  }, []);

  const pagarCuota =  async (cuota) => {

    const cuotaRef= firebase.db.collection("pagos").doc(cuota);
    const doc = await cuotaRef.get();
    const cuo = doc.data();
    const prest = cuo.idPrestamo;


    if(cuo.paga === "SI"){
      setLoading(false);
      Alert.alert("Error.", "La Cuota ya se ecuentra paga.")
      return;
    }
    Alert.alert(
        "Pagar Cuota de $"+ cuo.valor + " de "+ cuo.nombre,
        "Estás Seguro?",
        [
          { text: "Si", onPress: () => confirmaCuota(cuo.valor, cuotaRef, prest)}
          ,
          { text: "No", onPress: () => console.log("canceled") },
        ],
        {
          cancelable: true,
        }
      );

}

const confirmaCuota = async (cuotaVal, cuotaRef, prestamo) => {      

    setLoading(true);

    //console.log(cuota)
    await cuotaRef.update({
      paga: "SI",
      cobrador: "Bruno",
      fechacobro: date.toString()
    }).then(pagarPrestamo(cuotaVal, prestamo)) 



    setLoading(false);
    Alert.alert("Cuota Actualizada.", "La Cuota fue actualizada.")
    return false;
  };


  const pagarPrestamo = async (valor, prest) => {

    const dbRef = firebase.db.collection("prestamos").doc(prest);
    const doc = await dbRef.get();
    const pres = doc.data();


    await dbRef.update({

      deuda: (parseInt(pres.deuda) - parseInt(valor)),
      fechacobro: date.toString()

    })
    
    //const prest = doc.data();
    //setUser({ ...user, id: doc.id });
    
  };

  
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

      {pagos.map((pago) => {
        return (
          <ListItem
            key={pago.id}
            bottomDivider
            onPress= {()=> pagarCuota(pago.id)}
            
          >
          <ListItem.Chevron />
         {(() => {
        if (pago.paga === "NO") {
          return (
            <Avatar 
              size={30}
              source={{
                uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAACm0lEQVR4nO3dP08TcRzH8c+vUSPqgJ1adEIXw2a7AY/Af8XEB+IA0bgwGYGHYgyt4COgTFA3XFQWTelUjUElkvB1qNPdtdehvX7l3q/xd9fkm75z/yAcEgAAAAAAAAAAAID8CsPsdPBk7lLxZLpmZ6EWgu5Kuinp6nhH++/9lPTVTO9Dwerdy9/rc68P/qR9KDVI+9784xDChqTZUUyZW0GfzbQ8s93cHLxbH7aqQmd//pUUlkc/Xa6tl6rN52FVZ0kbC/0+1dlbXCPGWKx0Wgsv+21MPEL+nabejG8mWAhLM1s79eh6LEjvAn79g0y3shkttw67U9/uRC/0sVNW8WS6RoxMzBZ/Fx9GF+PXEAtLmYwDBakWXYsFMamSzTgwWTW6FgsSpHI240DSjehC0m3vtQwGQU/su+77HILJIIgzBHHmQtoO5e3mUD8RxnCO7i/YoO0cIc4QxBmCOEMQZwjiDEGcIYgzBHGGIM6kPqmnPVlitDhCnCGIMwRxhiDOEMSZ1LusYU369ybn5W6QI8QZgjhDEGdGdg05L+fwSeMIcYYgzhDEGYI4QxBnCOIMQZwhiDMEcYYgzhDEGYI4QxBnCOIMQZwhiDMEcYYgzhDEmaQgx5lPkV8/ogtJQdoZDIKe2Hed9L6s/WxmgaS96EL8fVnBGtnMAim8ja7EgpTaJ5tS+JTNQLl22J3qpgcJrdapyVaymSm3LJg9TXr1eOJtb+912LYx/rnyyaS10rvd2NEhDXgOKVV3n0laH9tU+WQKWitXmy/67ZD+Mv4Hi7Vg2pDs9mhnyxeTPhZCWC5t7Qy8aRrqj2ysUrnYKV95FKSaySrq/bsKXpY52LGkLyFYy6zQKB39aoRW63TSQwEAAAAAAAAAAADw7C8AT48lXC4g3AAAAABJRU5ErkJggg==" }}
             
            />
          ) 
        } else {
          return (
            <Avatar 
            size={30}
            source={{
              uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAACn0lEQVR4nO3dP09TcRSH8e8pYBSNdTU6oYshQkLL29Dii3CGAaJx6WQEEuvMezCAb8PWBAguKovGmRJAIsJxwOn2trdDezlyn8/4621y0if3H6S3EgAAAAAAAAAAAIDisn42mtytXxs9adfcrSb5jKT7km4Od7T/3pGkH5J9MvONP9fLG7uT9d9Zb8oMMt2af+Zuq5ImBjFlcfk3M1vcqjTWe23VPYjXS1PN9huZFgc+W4GZ2crWzO2Xsvp52uulbm+cah0sE2Pw3H1putV+3e311D3k32Hq/fDGgsvndqrvNpLrHUEmd+vXRn7tf5bsQT6jFdbe2Y3yo+SJvuOQNXrSrhEjFxMjx/tPkosdQVyay2cemJVqybXOk7qrkss0kMurybW0q6y7OcyCC/eSC2lBbuUwCC50fNZd70NwOQgSDEGCGc3aYLva6OsvwujPVHPBe73OHhIMQYIhSDAECYYgwRAkGIIEQ5BgCBJM5p161p0lBos9JBiCBEOQYAgSDEGCybzK6tdl/9/kqlwNsocEQ5BgCBLMwM4hV+UYftnYQ4IhSDAECYYgwRAkGIIEQ5BgCBIMQYIhSDAECYYgwRAkGIIEQ5BgCBIMQYIhSDAECSYtyGHuUxSUSwfJtbQgP3OYBZIs5bNOC9LMYRZIkuljcqkjiJk285kGOvcPyaXOZy760bpJX/OZqND2zsbvZAdpVddOZVrKZ6bCcrktpD16PPWyd6vSWJdrdfhzFZNLy9uzbzv2DqnHfch2tfzCzFaGN1YhuUnLO5Xyq24bZH6n43FzvlaSrbr0cLCzFc4Xdy3uzDZ6XjT19SWbSvP52KmPPzUr1Vxe0cXPVfCwzN4OJX13V8vkm2N2vNmqrp1e9lAAAAAAAAAAAAAAIvsLDiuR0t0HvNsAAAAASUVORK5CYII="
            }}
            
          />
          )
        }
      })()}
            <ListItem.Content>

              <ListItem.Title>Cliente: {pago.nombre} - Cuota: {pago.cuota}</ListItem.Title>
              <ListItem.Subtitle>Valor de la Cuota: ${pago.valor}</ListItem.Subtitle>
              <ListItem.Subtitle>Cuota Paga: {pago.paga}</ListItem.Subtitle>
              <ListItem.Subtitle>Fecha a Pagar: {pago.fechapagar}</ListItem.Subtitle>
              <ListItem.Subtitle>Cobrador: {pago.cobrador}</ListItem.Subtitle>
              <ListItem.Subtitle>Fecha de Cobro: {pago.fechacobro}</ListItem.Subtitle>

            </ListItem.Content>
          </ListItem>
        );
      })}   
    </ScrollView>


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
    avatar: {
      marginLeft:0,
      paddingLeft:0,
      backgroundColor: 'red'

    },
    

  });

export default CobrosDelDia;