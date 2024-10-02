import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";

const DeliveryScreen = ({ navigation }) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = userData?._id;
  const userId = userData?._id;

  console.log("userData from Redux:", userData); // Check if userData is populated
  console.log("deliveryBoyId:", id); // Check if deliveryBoyId is correctly set
  console.log("oders", orders.length); // Check if deliveryBoyId is correctly set

  useEffect(() => {
    if (id) {
      fetchOrders();
    }
  }, [id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.102.198:3001/delivery-orders/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <View>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View>
      <Header title="Deliveries" />
      <View>
        <Text>Orders for Delivery Boy: {id}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                }}
                onPress={() =>
                  navigation.navigate("Odrers", {
                    screen: "delivery-detail", // Navigate directly to the 'delivery-detail' screen inside 'Orders'
                    params: {
                      cakeOrder: item,
                    },
                  })
                }
                St
              >
                <Text>Order ID: {item.orderId}</Text>
                <Text>Sender: {item.senderName}</Text>
                <Text>Receiver: {item.receiverName}</Text>
                <Text>Delivery Date: {item.deliveryDate}</Text>
                <Text>Status: {item.status}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default DeliveryScreen;

const styles = StyleSheet.create({});
  