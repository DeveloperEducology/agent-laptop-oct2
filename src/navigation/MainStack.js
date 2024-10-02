import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon library
import CakeBookingList from "../screens/cake/CakeBookingList";
import Settings from "../screens/admin/Settings";
import DispatchNoteForm from "../screens/agent/DispatchNoteForm";
import CakeBookingForm from "../screens/cake/CakeBookingForm";
import CreateAgent from "../screens/admin/CreateAgent";
import PrintToPdf from "../screens/print/PrintToPdf";
import CakeOrderDetails from "../screens/cake/CakeOrderDetails";
import ListAgents from "../screens/admin/ListAgents";
import { useSelector } from "react-redux";
import DeliveryScreen from "../screens/deliveryboy/DeliveryScreen";
import DeliveryDetail from "../screens/deliveryboy/DeliveryDetail";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Delivery = createNativeStackNavigator();

function DeliveryStacks() {
  return (
    <Delivery.Navigator initialRouteName="Home">
      <Delivery.Screen
        name="Home"
        component={DeliveryScreen}
        options={{ headerShown: false }}
      />
      <Delivery.Screen name="delivery-detail" component={DeliveryDetail} />
    </Delivery.Navigator>
  );
}
function MyStacks() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="dispatch-form" component={DispatchNoteForm} />
      <Stack.Screen
        name="Home"
        component={CakeBookingList}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="form" component={CakeBookingForm} />
      <Stack.Screen name="CreateAgent" component={CreateAgent} />
      <Stack.Screen name="print" component={PrintToPdf} />
      <Stack.Screen name="ListAgents" component={ListAgents} />
      <Stack.Screen name="delivery-detail" component={DeliveryDetail} />
      <Stack.Screen
        name="details"
        component={CakeOrderDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MyTabs() {
  const userData = useSelector((state) => state?.auth?.userData);
  return (
    <Tab.Navigator
      initialRouteName="Orders"
      activeColor="#3e2465"
      inactiveColor="#3e2465"
      screenOptions={{
        headerShown: false,
      }}
      barStyle={{
        backgroundColor: "#FFF",
        height: 50, // Adjust this value to set the height
      }}
    >
      <Tab.Screen
        name="Odrers"
        component={
          userData?.userType === "deliveryBoy" ? DeliveryStacks : MyStacks
        }
        options={{
          tabBarLabel: "Orders",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="list-outline" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Icon name="settings-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return <MyTabs />;
}

export default MainStack;
