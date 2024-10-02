import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Text,
  RefreshControl,
  Image,
} from "react-native";
import { FAB, Card, Paragraph, IconButton, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import OrderSummary from "../../components/OrderSummery";
import moment from "moment";
import DispatchNoteForm from "../agent/DispatchNoteForm";
import SplashScreen from "../../components/SplashScreen";

const CakeBookingList = ({ navigation }) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deliveryBoyId, setDeliveryBoyId] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [showNoOrders, setShowNoOrders] = useState(false); // Add state to manage no orders

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    userPosts().then(() => setRefreshing(false));
  }, []);

  const userId = userData?._id;

  useEffect(() => {
    userPosts();
  }, []);

  useEffect(() => {
    filterPostsByDate();
  }, [date, posts]);

  useEffect(() => {
    // Stop loading after 3 seconds and check if there are any orders
    const timer = setTimeout(() => {
      setLoading(false);
      if (filteredPosts.length === 0) {
        setShowNoOrders(true); // Show no orders message after delay
      }
    }, 3000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [filteredPosts]);

  const userPosts = async () => {
    try {
      const response = await fetch(`http://192.168.28.198:3001/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log("error raised", error);
    }
  };

  const filterPostsByDate = () => {
    const selectedDate = moment(date).format("DD-MM-YYYY");
    const filtered = posts?.filter((post) => post.order_date === selectedDate);
    setFilteredPosts(filtered);
  };

  if (loading) {
    // Show splash screen while loading
    return <SplashScreen />;
  }

  const handleDelete = async (bookingId) => {
    try {
      const response = await fetch(
        `http://192.168.28.198:3001/delete-order/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Booking deleted successfully");
        userPosts();
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const handleCreate = () => {
    setModalVisible1(true);
  };

  const handleFormSuccess = () => {
    setModalVisible1(false);
    userPosts();
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    console.log("Updated Booking:", formData);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title={"Hi, " + userData?.name + userData?.userType}
        isRightButton={true}
        onRightButtonPress={() => setShowDatePicker(true)}
        selectedDate={date}
      />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <OrderSummary orders={filteredPosts} />
      {showNoOrders && filteredPosts.length === 0 ? (
        <View>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>
            No Orders Today
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <Card
                style={styles.card}
                onPress={() =>
                  navigation.navigate("details", { cakeOrder: item })
                }
              >
                <Card.Title
                  title={`${item.senderName} ➔ ${item.receiverName}`}
                  right={() => (
                    <View style={styles.iconContainer}>
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => handleDelete(item._id)}
                      />
                    </View>
                  )}
                />
                <Card.Content>
                  <Paragraph>Order ID: {item.orderId}</Paragraph>
                  <Paragraph>Cake Name: {item.cakeName}</Paragraph>
                  <Paragraph>Weight/Quantity: {item.weight}</Paragraph>
                  <Paragraph>Delivery Date: {item.deliveryDate}</Paragraph>
                  <Paragraph>Time: {item.time || "6pm to 8pm"}</Paragraph>
                  <Paragraph>Status: {item.status}</Paragraph>
                  <Paragraph>Agent Name: {item.agentName}</Paragraph>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Paragraph>Advance: {item.advance_payment}</Paragraph>
                    <Paragraph>Balance: {item.balance_payment}</Paragraph>
                  </View>
                  <Card.Title title={moment(item.createdAt).fromNow()} />
                </Card.Content>
              </Card>
            </View>
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <FAB style={styles.fab} small icon="plus" onPress={handleCreate} />

      <Modal
        visible={isModalVisible1}
        animationType="slide"
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={styles.modalContainer}>
          <Header
            title="Create Booking"
            showBackButton={true}
            onBackPress={() => setModalVisible1(false)}
          />
          <DispatchNoteForm onFormSuccess={handleFormSuccess} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: "row",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
  modalContainer: {
    flex: 1,
    padding: 6,
    backgroundColor: "#fff",
  },
});

export default CakeBookingList;
