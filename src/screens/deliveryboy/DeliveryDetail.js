import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Button } from "react-native-paper";
import { RadioButton, Divider } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

const DeliveryDetail = ({ route }) => {
  const { cakeOrder } = route.params;

  return (
    <ScrollView>
    <Header title="Deliveries" />
      <Image
        source={{
          uri: cakeOrder.image
            ? cakeOrder?.image
            : "https://ovenfresh.in/wp-content/uploads/2024/01/20240109_142246-1.jpg",
        }} // Replace with your image URL
        style={styles.cakeImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Order ID:</Text> {cakeOrder.orderId}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Sender Name:</Text> {cakeOrder.senderName}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Sender Phone:</Text>{" "}
          {cakeOrder.senderPhoneNumber}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Receiver Name:</Text>{" "}
          {cakeOrder.receiverName}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Receiver Phone:</Text>{" "}
          {cakeOrder.receiverPhoneNumber}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Shipping Address:</Text>{" "}
          {cakeOrder.shippingAddress}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Cake Name:</Text> {cakeOrder.cakeName}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Flavor:</Text> {cakeOrder.flavor}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Weight:</Text> {cakeOrder.weight}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Message on Card:</Text>{" "}
          {cakeOrder.messageOnCard}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Quantity:</Text> {cakeOrder.quantity}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Balance Payment:</Text> ₹
          {cakeOrder.balance_payment}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Order Date:</Text> {cakeOrder.order_date}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Delivery Date:</Text>{" "}
          {cakeOrder.deliveryDate}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Delivery Status:</Text> {cakeOrder.status}
        </Text>
        <Divider />
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Agent Name:</Text> {cakeOrder.agentName}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DeliveryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cakeImage: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 16,
    gap: 6,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
});
