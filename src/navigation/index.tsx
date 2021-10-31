import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { CustomDrawerContent } from "../modules/drawerContent/drawerContent";
import { Login } from "../screens/login/Login";
import { Register } from "../screens/register/Register";
import { Home } from "../screens/home/Home";
import { ChatsList } from "../screens/chatsList/ChatsList";
import { createStackNavigator } from "@react-navigation/stack";
import { NotificationsButton } from "../modules/notificationsButton/notificationsButton";
import { Chat } from "../screens/chat/Chat";
import { Profile } from "../screens/profile/profile";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = ({ navigation, route }: any) => {
  const userId = route.params.userId;
  if (!userId) {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: "#008080" },
          headerTintColor: "white",
          drawerActiveBackgroundColor: "#319795",
          drawerActiveTintColor: "white",
        }}>
        <Drawer.Screen
          name="Home"
          component={Home}
          initialParams={{ userId }}
        />
        <Drawer.Screen
          name="Login"
          component={Login}
          initialParams={{ userId }}
        />
        <Drawer.Screen
          name="Register"
          component={Register}
          initialParams={{ userId }}
        />
      </Drawer.Navigator>
    );
  }
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#008080" },
        headerTintColor: "white",
        drawerStyle: {},
        drawerActiveBackgroundColor: "#319795",
        drawerActiveTintColor: "white",
        headerRight: () => (
          <NotificationsButton navigation={navigation} route={route} />
        ),
        headerRightContainerStyle: { paddingRight: 15 },
      }}>
      <Drawer.Screen name="Home" component={Home} initialParams={{ userId }} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen
        name="Chats"
        component={ChatsList}
        initialParams={{ userId }}
      />
    </Drawer.Navigator>
  );
};

export const Navigation = ({ userId }: any) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#008080" },
          headerTintColor: "white",
        }}>
        <Stack.Screen
          name="Home "
          component={HomeStack}
          options={{ headerShown: false }}
          initialParams={{ userId }}
        />
        <Stack.Screen
          name="Chat"
          options={{
            headerBackTitle: "",
            title: " ",
          }}
          component={Chat}
          initialParams={{ userId }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
