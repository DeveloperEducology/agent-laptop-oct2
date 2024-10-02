import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { getData, showError } from "../../utils/helperFunctions";
import validator from "../../utils/validations";
import { userPhoneLogin } from "../../redux/actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUserData } from "../../redux/reducers/auth";
import store from "../../redux/store";

const { dispatch } = store;

const PhoneLoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setLoading] = useState(false);

  React.useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    try {
      let data = await getData("userData");
      if (!!data) {
        dispatch(saveUserData(JSON.parse(data)));
      }
    } catch (error) {
      console.log("no data found");
    }
  };

  const isValidData = () => {
    const error = validator({
      // email,
      // password,
    });
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const onLogin = async () => {
    const checkValid = isValidData();
    if (checkValid) {
      setLoading(true);
      try {
        let fcmToken = await AsyncStorage.getItem("fcm_token");

        const res = await userPhoneLogin({
          phoneNumber,
          fcmToken,
        });
        console.log("login api res", res);
        setLoading(false);
        navigation.navigate("otp", { data: res.data });
      } catch (error) {
        console.log("error in login api", error);
        showError(error?.error);
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
      source={{uri: "https://pbs.twimg.com/profile_images/378800000676854536/af8e304449ad7edd4b46954adabb2732_400x400.png"}} // Replace with your logo
        style={styles.image}
      />
      <View style={styles.form}>
        <Text style={styles.header}>Welcome Agent</Text>
        <Text style={styles.subHeader}>
          Enter your Phone Number to login
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor="#888"
        />        

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={onLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

      
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f3e1f6",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#007bff",
  },
});

export default PhoneLoginScreen;
