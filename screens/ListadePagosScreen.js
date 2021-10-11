import React, { useState, useEffect } from "react";
import { Button, StyleSheet,ActivityIndicator, View, Alert } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import firebase from "../database/firebase";
import Moment from 'moment';
import 'moment/locale/es';

const ListadePagosScreen = (props) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  Moment.locale('es');
  const [date, setDate] = useState(Moment(new Date()).format('dddd DD/MM/yyyy'))

  useEffect(() => {
    firebase.db.collection("pagos").where("idPrestamo", "==", props.route.params.prestamoId).orderBy("cuota","asc").onSnapshot((querySnapshot) => {
      const pagos = [];
      querySnapshot.docs.forEach((doc) => {
        const { nombre, valor, paga, fecha, cuota, cobrador, fechacobro } = doc.data();
        pagos.push({
          id: doc.id,
          nombre,
          valor,
          paga,
          fecha,
          cuota,
          cobrador,
          fechacobro
        });
      });
      setPagos(pagos);
      setLoading(false);
    });
  }, []);

  const pagarCuota = async (cuota) => {
    setLoading(true);

    const cuotaRef= firebase.db.collection("pagos").doc(cuota);
    const doc = await cuotaRef.get();
    const cuo = doc.data();


    if(cuo.paga === "SI"){
      setLoading(false);
      Alert.alert("Error.", "La Cuota ya se ecuentra paga.")
      return;
    }

    //console.log(cuota)
    await cuotaRef.update({
      paga: "SI",
      cobrador: "Bruno"
    })

    pagarPrestamo(cuo.valor)
    Alert.alert("Cuota Actualizada.", "La Cuota fue actualizada.")
    setLoading(false);
  };


  const pagarPrestamo = async (valor) => {

    const dbRef = firebase.db.collection("prestamos").doc(props.route.params.prestamoId);
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
            onPress={() => {
              setLoading(true);
              pagarCuota(pago.id);
              setLoading(false);
            }}
          >
          <ListItem.Chevron />
         {(() => {
        if (pago.paga === "SI") {
          return (
            <Avatar 
              size={30}
              source={{
                uri:
                  "data:image/png;base64,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",
              }}
              rounded
            />
          ) 
        } else {
          return (
            <Avatar 
            size={30}
            source={{
              uri:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX/AAD/////9/f/+vr/fX3/4+P/9fX/1NT//Pz/paX/jIz/6Oj/sbH/3t7/7Oz/0ND/nJz/wsL/KSn/NTX/29v/urr/YmL/x8f/Tk7/FBT/8PD/kJD/PT3/XFz/l5f/19f/QkL/LCz/Vlb/goL/aWn/IyP/SEj/dnb/rq7/h4f/Dw//vr7/oaH/Gxv/OTn/cHBfLDqvAAAIc0lEQVR4nO2diXaiMBRACcimIOCGivtWRe38/98NyHQqkECAhJC09wPad08keXnZJEAdQ5FlWVOd+9V1g37ExjUtTx9osqwoBvV/L9H849pQtX3zOFuFEpTnanY0HVsdahSDoGY40H2rvx7B1dKMDkfL11VKzUnFcOhb7mmMI/fNeLax/CGFYMgbqlb/9FnN7ovPU9+ckI6HsKHtnubnenoJz93JJStJ0lAzD3tEn1KFcH8wl+SiImYo3w/N5b45eAqhwMgYLicBgcZLc95MiLQkAUNDvX+Q1nsRftzVLhhuH0R/nmnWV5u14XYzp+f3cnw07FqbGW5vF7p+EeF8M2BluOxXzFvqOu4eDTK6BobmsxW/F89p64aat2rPL+bgyG0aKjqd8aGIRX9S67day1B1a6bWzbiYdeYedQzvMxZ+MR9OG4bLYM9KUJJWbuVMrrKhzqwBX4Qnna6hcWXYgAmja7UOp5qh2n4XCuFPpXy8iqHh08/RsPh0KjRjBUP5umCt9sXTwq8/4hsONqy93lhssIdGbEO7E5/gfxY93I8R13DLdpCAMMOcG2Ma6h3pY9654LUinqHf4kQJn+eWmKHXmU40zQInv8Ex9IhXCkkx9kkYGlPmiRqalVc69pcaGlMmc0Fcdl5jw3unBeNWbGjot1NOa8C+ZFZcYtjNYSJNSY9abOhwIBjNiguzm0JDu/M/0YRdUeG/yFBdsw4dl0OBYoHhsFuziUIKpv1oQ63f2VQmT3hD1uCQhkabyxLNCR+oVXGkoddoSwUD7hUN9Y6nMnlQwyLCcNi5KX05F3h1CmHYZx1uHYIKhlPWwdZiAU3CoYZ2y6ufpDjARkWYofKHdah1uUHmwzBDs6NlmXLOFpahw+lvNGaeL7/lDZccpaN5gtyQkTM0urP+UodzrvqWM7Qp7+KizSmbgmcN5YB1iE25lhjqHE2Z4JyXxYac/0ZjeoWGfKZrGSYFhkqHC/j4nAoMTdbBEWHkIw0HO9bBkeFDRhm63HekCWMPYTiguCW9XXoa3JDfOUWWkQc1VDmszaC4aTBDi3VYBBk5EMNlj3VYJHGVvKHDWwm4kM9BzlBxWQdFFitnONyxjoksOyNr6LEOiTROxtAQZrT/YpYxVFkHRB4lbch98SKPlTbkZE9CFdYpQwF/pNLefjfs0h5uUoTuu6EABag8pzfDiRD1mSw7/dtQwJ40YmF+G55YB0OH239DVcjPMBov1C/DKdZFOfzxKmZIoo4VL8x/hjLXa6JF9JaJ4VbQz1CSLpPEcCpMFTFL6CeGYqxWQJm+DLUb6zjoEcixIT+bnauzHsaGuoBzwy+eamzosw6DJpPYUIiVbRTTyJD//SVFBIbE5XZgfGaKBAYcb9Qr51OWgMrVqYPKRIY26xjospSAzjoGujiS2IOFJFmSIez0N2EjGdxuW8fjKCnCLaul6UlKB2+8IElPkrk7wlWNyFDQSuIXkaGwRZqEyJB1CJT5NeSfX0P++TXkn19D/vkRhuJnbQKvWsT8hPmhInTJOzY0hN2mkBAZCr0wI0muJPIqfownibdJP40qgQnrGOiiSUAV5FglAln09cOxLPoa8FqRgMblnVC4xOv4xpV1FDTxhd9PY8eGYh2tTLN/7YmyBV5fS/a1aUfWcdCjr/2M/aUC7xGW/u0RdnasA6HF3E4Mh4IemUmuVnidtxA2q7l+nSixBB0R9//PzNiC1tvWtuhn145v5w+FnAUnx2QTQ13ILSe77ds5YCE/xPdzwEKOF+mz3CJuFE6fxwcC7m47pG+NeLCOhzybtOGQdTzkGaYNDeEOsM1B2lC85Qs/ayjaPVFjJWtoCFbLeICsIdgKtWXhaecNZaHymu/bL9/uTbyLNA/+vvzyzZDv6+bTnAYwQ4GKGeHbGwnvhkthpvozFW4ILEEOWz5NgDCUBUnd1gOUoSCp2zP1Uknm1nkhqhlrpcDQYR0dCdLPdmbfRhCgO/0AhYY292PiYlhsaHBfznBBsSH3t9Wsh2WGYMr1sP/Mvb0Gee+J65vLMd57+gFvdgHw4HbnwjP7FBLCkN+383qQZyzh7x9yWuO/wB4+hr9hyelDEJC3AZHvkHLZn96gKghDlcNJxgr+rDPqPWCPv/7UgZugDPnbOTxFmCBfreZt+/dGRoig31YfcFU+7WUTbgxDMOFolnGykRoFhkDfsQ4cF0g6imUIdE461DHiWfVyQ14OKhQJlhiCO+vgccg9kFvFEEw7X5kaFQuWGhpWxx+GGN9LDMoMgXLt9L7FsQV5Tr2aIVC6vKw4nipl8ZcbAqO7d0eO7mUtiGXY4buUSzoZfEPgdXOXNGK+VMcQOB2s3KxgVZnahsDp3AsRh4JctI4h0Lu17hb+wWvBCoZA7dIxxfCmlkdc1RAsu/OOZ2jCq04NDaOxvyPpzdkrHwZrGUYfYyeODM/QE/rGhkALmK8uns3SRK2JYTT4sx02whnWMN/EEAyODDPx8Qa/i6ltGE0Zmd0VMsutYVMxjIZGl8mO6d0DexBsaghkh8Ei6nFbYYxoahh1qm2/t3fxUWV7SobR+N/mwdOFWav9mhlGvWqvnXYMV/k9JO0YAuB/tNDlXII6HQwhQ6B4R8rVxvkGcx5IyTDqVr2AYjuuzYZ+BAwjx+2VUkL+597o90nMMMpyhg6F5dTjtnKGBoOIYcxyQ7Rj3Vk1h78cxAwj1GA+IjFGnucucs26OiQNI/Rgtmq0rPrcnYKq86NiCBtG36Rj3k41e9f97GYWrnbWgbhhzMC3gkPFz3I/C64ega4zBxXDCNl2fOt2wJosPy+9q6+r1YoT2NAyfKEN1YlnHtfIJYHzvGf6tjpY1s6ry6FqmGAosqwNdH96dYNjr3frR7iWP1nKsqxQVPvHX/YDfR+C5epDAAAAAElFTkSuQmCC",
            }}
            rounded
          />
          )
        }
      })()}
            <ListItem.Content>

              <ListItem.Title>Número de Cuota: {pago.cuota}</ListItem.Title>
              <ListItem.Subtitle>Cliente: {pago.nombre}</ListItem.Subtitle>
              <ListItem.Subtitle>Valor de la Cuota: ${pago.valor}</ListItem.Subtitle>
              <ListItem.Subtitle>Cuota Paga: {pago.paga}</ListItem.Subtitle>
              <ListItem.Subtitle>Fecha de la cuota: {pago.fecha}</ListItem.Subtitle>
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

export default ListadePagosScreen;