import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { otpVerify } from "../../redux/actions/auth";
import { showError } from "../../utils/helperFunctions";

const OTPScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const onVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      showError("Please enter a 4-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await otpVerify({
        otp: enteredOtp,
        phoneNumber,
      });
      // Handle successful verification
      setLoading(false);
      Alert.alert("Success", "OTP verified successfully", [
        { text: "OK" },
      ]);
    } catch (error) {
      console.log("error in login api", error);
      showError(error?.error || "Failed to verify OTP.");
      setLoading(false);
    }
  };

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleResend = () => {
    // Implement resend OTP functionality here
    Alert.alert("OTP Resent", "A new OTP has been sent to your phone.");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{uri: "https://pbs.twimg.com/profile_images/378800000676854536/af8e304449ad7edd4b46954adabb2732_400x400.png"}} // Replace with your logo
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Verify Your Phone Number</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {phoneNumber}
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
            autoFocus={index === 0 ? true : false}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={onVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendContainer} onPress={handleResend}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        {/* Implement a countdown timer if needed */}
        <Text style={styles.resendLink}> Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2f3640",
  },
  subtitle: {
    fontSize: 16,
    color: "#718093",
    textAlign: "center",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
  },
  verifyButton: {
    width: "80%",
    backgroundColor: "#4cd137",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
  },
  resendText: {
    color: "#718093",
    fontSize: 14,
  },
  resendLink: {
    color: "#273c75",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default OTPScreen;
