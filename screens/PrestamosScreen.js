import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert,  ActivityIndicator} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import firebase from "../database/firebase";
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'apsl-react-native-button'
import Moment from 'moment';
import 'moment/locale/es';


const PrestamosScreen = (props) => {

  const initialStatePres = {
    id: props.route.params.userId,
    nombre: props.route.params.userName,
    monto: "",
    cuotas: "",
    interes: "",
    total: "",
    ganancia: "",
    fecha:"",
    valorcuota: "",
    deuda: "",
    descripcion: "",

  };

 
  Moment.locale('es');
  const [totalprestamo, setTotalPrestamo] = useState(0);
  const [ganancia, setGanacia] = useState(0);
  const [valorCuota, setValorCuota] = useState(0);
  
  const [state, setState] = useState(initialStatePres);
  
  const [date, setDate] = useState(Moment(new Date()).format('dddd DD/MM/yyyy'))
  const [loading, setLoading] = useState(false);

  const handleChangeText = (value, prop) => {
      setState({ ...state, [prop]: value.toString() });

    if (prop === "monto" && ( (state.interes) !== null )) {
      calculateTotal(value,state.interes,state.cuotas);    
      }
    if (prop === "interes" && ( (state.monto) !== null )) {
      calculateTotal(state.monto,value,state.cuotas);    
      }

      };

  
  const calculateTotal = (monto, interes, cuotas)=>{
    const total= parseInt(parseInt(monto)+(parseInt(monto)*(parseInt(interes)/100)));
    const gan= parseInt(total)-parseInt(monto);
    const cuota= parseInt(total)/parseInt(cuotas);


    if (isNaN(total)) {
      setTotalPrestamo("0");
      setGanacia("0");
      return;
    }
    setTotalPrestamo(total.toString())
    setGanacia(gan.toString())
    setValorCuota(cuota.toString())
  }


  const nuevoPrestamo = async () => {

    //console.log(parseInt(state.monto))
    //console.log(parseInt(state.cuotas))
    //console.log(parseInt(state.interes))
    

    let cou = /^\d+$/.test(state.cuotas);
    let mon = /^\d+$/.test(state.monto);
    let int = /^\d+$/.test(state.interes);

    if (!cou || !mon || !int ) {
      //console.log('No');
      Alert.alert("Error","Por favor, compruebe los datos.");
      return;
    }

    if(parseInt(state.monto) < 0 || parseInt(state.cuotas)  < 0 || parseInt(state.interes) < 0){
    Alert.alert("Error","Por favor, compruebe los datos.");
    return;
    }

    if (state.monto === "") {
      Alert.alert("Error","Por favor, ingrese un Monto.");
    } else if (state.cuotas === "") {
      Alert.alert("Error","Por favor, ingrese las Cuotas.");
    } else if (state.interes === "") {
      Alert.alert("Error","Por favor, ingrese el Interés.");
    } 
    else {
      setLoading(true)
      try {
        await firebase.db.collection("prestamos").add({
          idCliente: state.id,
          nombre: state.nombre,
          monto: state.monto,
          cuotas: state.cuotas,
          interes: state.interes,
          total: totalprestamo.toString(),
          ganancia: ganancia.toString(),
          fecha: date.toString(),
          valorcuota: valorCuota.toString(),
          deuda: totalprestamo.toString(),
          descripcion: state.descripcion
          
        }).then((snap) => {

          try {
            //Generar Pagos
           for(let i = 1; i <= state.cuotas; i++){
              
            firebase.db.collection("pagos").add({
                idCliente: state.id,
                idPrestamo: snap.id,
                nombre: state.nombre,
                cuota: i,
                valor: parseInt(totalprestamo/parseInt(state.cuotas)),
                paga: 'NO',
                cobrador: '',
                fechapagar: date.toString(),
                fechacobro: ''
              })
            }

              
            } catch (error) {
              console.log(error)
              setLoading(false)
            }

       })
     

      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    setLoading(false)
    Alert.alert("Prestamo Guardado.", "El nuevo préstamo se Guardó con Éxito.") 
    props.navigation.goBack(null);
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

      {/* Nombre y Apellido Input */}
      <View style={styles.searchSection}>
        <Icon style={styles.searchIcon} name="user" size={25} color="#000"/>
        <TextInput
            underlineColor ='transparent'
            label="Nombre y Apellido"
            style={styles.input}
            placeholder="Nombre y Apellido"
            editable={false}
            value={state.nombre}  
        />
      </View>  
      {/* Monto Input */}           
      <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="dollar" size={25} color="#000"/>
          <TextInput
              label="Monto"
              style={styles.input}
              placeholder="Monto"
              //numberOfLines={4}
              onChangeText={(value) => { 
                handleChangeText(value, "monto")
              }}
              value={state.monto}
              keyboardType="numeric"

              maxLength={15}     
          />
        </View>
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="list-ol" size={25} color="#000"/>
          <TextInput 
              label="Cuotas"
              style={styles.input}
              placeholder="Cuotas"
              //numberOfLines={4}
              onChangeText={(value) => { 
                handleChangeText(value, "cuotas")
              }}
              value={state.cuotas}
              keyboardType="numeric"
              maxLength={3}     
          />
        </View>        
      {/* Interes Input */}
      <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="percent" size={25} color="#000"/>
          <TextInput 
              label="Interés"
              style={styles.input}
              placeholder="Interés"
              //numberOfLines={4}
              onChangeText={(value) => { 
                handleChangeText(value, "interes")
              }}
              value={state.interes}
              keyboardType="numeric" 
              maxLength={3} 
          />
        </View>
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="usd" size={25} color="#000"/>
          <TextInput
              underlineColor ='transparent'
              label="Total a Pagar"
              style={styles.input}
              placeholder="Total a Pagar"
              //numberOfLines={4}
              onChangeText={(value) => handleChangeText(value, "total")} 
              value={totalprestamo.toString()} 
              editable={false}  
          />
        </View>  
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="usd" size={25} color="#000"/>
          <TextInput
              underlineColor ='transparent'
              label="Valor de la Cuota"
              style={styles.input}
              placeholder="Valor de la Cuota"
              //numberOfLines={4}
              onChangeText={(value) => handleChangeText(value, "valorcuota")}  
              value={valorCuota.toString()} 
              editable={false}  
          />
        </View> 
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="usd" size={25} color="#000"/>
          <TextInput 
              underlineColor ='transparent' 
              label="Deuda del Préstamo"
              style={styles.input}
              placeholder="Deuda del Préstamo"
              //numberOfLines={4}
              onChangeText={(value) => handleChangeText(value, "deuda")}  
              value={totalprestamo.toString()} 
              editable={false}  
          />
        </View> 
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="usd" size={25} color="#000"/>
          <TextInput
              underlineColor ='transparent'
              label="Ganancia"
              style={styles.input}
              placeholder="Ganancia"
              //numberOfLines={4}
              onChangeText={(value) => handleChangeText(value, "ganancia")}  
              value={ganancia.toString()} 
              editable={false}  
          />
        </View>       
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="calendar" size={25} color="#000"/>
          <TextInput
              underlineColor ='transparent'
              label="Fecha"
              style={styles.input}
              placeholder="Fecha"
              //numberOfLines={4}
              onChangeText={(value) => handleChangeText(value, "date")}  
              value={date.toString()} 
              editable={false}  
          />
        </View>    
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="clipboard" size={25} color="#000"/>
          <TextInput
              label="Descripción"
              style={styles.input}
              placeholder="Descripción"
              //numberOfLines={4}
              onChangeText={(value) => handleChangeText(value, "descripcion")}  
              value={state.descripcion} 

          />
        </View>         
        
        <Button style={styles.buttonGREEN} textStyle={{fontSize: 18,  fontWeight: 'bold', color: 'white',letterSpacing: 0.25,}}
        onPress={() => nuevoPrestamo()} 
        > Guardar Préstamo</Button>

      </ScrollView>
  );

  };

  const styles = StyleSheet.create({
  buttonGREEN: {
      flex: 1,
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: '#34DF70',
      borderColor: 'white',
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
  input: {
    height: 55,
    marginBottom: 0,
    marginTop: 0,
    marginRight: 20,
    flex: 1,
    paddingTop: 0,
    paddingRight: 10,
    paddingBottom: 0,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    fontSize: 18,
  }
  
  });

  export default PrestamosScreen;