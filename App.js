import React from "react";
import { ActivityIndicator, ImageBackground, SafeAreaView, Text, TextInput, View } from "react-native";
import axios from "axios";
import { useState } from "react";
import { useCallback } from "react";
import  { useEffect } from "react";
const App = () => {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(require("./assets/images/arkaplan.png"))

  useEffect(() => {
    if (input === "") {
      fetchDataHandler("Izmir"); // Başlangıçta İzmir verilerini getir
    } else {
      fetchDataHandler(input);
    }
  }, [input]);

  useEffect(() => {
    if (data.main && data.main.temp > 20) {
      setBackgroundImage(require("./assets/images/günes.png")); // Sıcak arka plan resmini ayarla
    } else {
      setBackgroundImage(require("./assets/images/arkaplan.png")); // Varsayılan arka plan resmini ayarla
    }
  }, [data]);
  const fetchDataHandler = useCallback((city) => {
    setLoading(true);
    
    axios({
      method:"GET",
      url:`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api.key}`,
    })
    .then(res=> {
      console.log(res.data);
      setData(res.data);

    })
    .catch(e=> console.dir(e))
    .finally(()=> setLoading(false));
   }, [api.key,input]);
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={{ flex: 1, flexDirection: "column" }}>
        <View>
          <TextInput
            placeholder="Enter City Name and Press Return"
            onChangeText={text => setInput(text)}
            value={input}
            placeholderTextColor={"black"}
            style={{
              borderBottomWidth: 3,
              padding: 4,
              paddingVertical: 15,
              marginVertical: 25,
              marginHorizontal: 10,
              backgroundColor: "white",
              fontSize: 19,
              borderRadius: 30,
              borderBottomColor: "lightblue",
              alignSelf:"center"
            }}
            onSubmitEditing={fetchDataHandler} />
        </View>
        {loading && 
        <View>
          <ActivityIndicator size={"large"} color={"#A63A50"}/>
        </View>}
        {data && 
          <View 
            style={{
              alignItems:"center",
              }}>
            <Text 
              style={{
                  color:"white",
                  fontSize:40,
                  fontWeight:"bold",
                  marginVertical:20}}>
              {`${data?.name} / ${data?.sys?.country}`}
              
            </Text>
            <Text 
              style={{
                color:"white",
                fontSize:22,
                marginVertical:10,

              }}>
                {new Date().toLocaleString()}
            </Text>
            <Text 
              style={{
                fontSize:45,
                color:"white",
                marginVertical:10,

              }}>
                {`${Math.round(data?.main?.temp)}`} °C
            </Text>

            <Text 
              style={{
                fontSize:22,
                color:"white",
                marginVertical:10,
                fontWeight:"500"

              }}>
                {`Min ${Math.round(
                  data?.main?.temp_min,

                )} °C / Max ${Math.round(data?.main?.temp_max)}°C `}

            </Text>
            
          </View>}
      </ImageBackground>


    </SafeAreaView>

  )
}
export default App;