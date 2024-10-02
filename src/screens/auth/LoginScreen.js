import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { getData, showError } from "../../utils/helperFunctions";
import validator from "../../utils/validations";
import { userLogin } from "../../redux/actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUserData } from "../../redux/reducers/auth";
import store from "../../redux/store";
// import cxlogo from "../../../assets/cxlogo.png";

const { dispatch } = store;

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("agent1");
  const [password, setPassword] = useState("agent123");
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
      userName,
      password,
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

        const res = await userLogin({
          userName,
          password,
          fcmToken,
        });
        console.log("login api res", res);
        setLoading(false);
        navigation.navigate("Home", { data: res.data });
      } catch (error) {
        console.log("error in login api", error);
        showError(error?.error);
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.form}>
        <Text style={styles.header}>Welcome Agent</Text>
        <Text style={styles.subHeader}>Enter your credentials to login</Text>

        <TextInput
          style={styles.input}
          placeholder="userName"
          value={userName}
          onChangeText={setUserName}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
});

export default LoginScreen;
