import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Component } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import NewWork from "./components/NewWork";
import Works from "./components/Works";
import styles from "./styles";

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.state = {
      loggedIn: false,
      authLoading: false,
      emailInput: "",
      passwordInput: "",
    };
    this.styles = StyleSheet.create(styles);
  }
  componentDidMount() {
    this.auth();
  }
  async auth() {
    let email = await AsyncStorage.getItem("@email");
    let password = await AsyncStorage.getItem("@password");
    if (email && password) {
      this.setState({ authLoading: true });
      fetch("https://school-server.herokuapp.com/auth", {
        headers: {
          email: email,
          password: password,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.auth) {
            this.setState({ loggedIn: true });
          }
        })
        .finally(() => {
          this.setState({ authLoading: false });
        });
    }
  }
  login() {
    
    if (this.state.emailInput && this.state.passwordInput) {
      this.setState({authLoading:true})
      fetch("https://school-server.herokuapp.com/auth", {
        headers: {
          email: this.state.emailInput,
          password: this.state.passwordInput,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.auth) {
            this.setState({ loggedIn: true }, () => {
              AsyncStorage.setItem("@email", this.state.emailInput);
              AsyncStorage.setItem("@password", this.state.passwordInput);
            });
          }
        });
    }
  }
  render() {
    return (
      <>
        {this.state.loggedIn ? (
          <>
            <NavigationContainer>
              <Tab.Navigator>
                <Tab.Screen
                  name="Works"
                  component={Works}
                  options={{
                    tabBarLabel: "Works",
                    tabBarIcon: () => (
                      <Icon name="book" size={25} color="#0c9c88" />
                    ),
                  }}
                />
                <Tab.Screen
                  name="New Work"
                  component={NewWork}
                  options={{
                    tabBarLabel: "New work",
                    tabBarIcon: () => (
                      <Icon name="addfile" size={25} color="#0c9c88" />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Status"
                  component={NewWork}
                  options={{
                    tabBarLabel: "Works",
                    tabBarIcon: () => (
                      <Icon name="user" size={25} color="#0c9c88" />
                    ),
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </>
        ) : (
          <>
            <View style={styles.container}>
              {this.state.authLoading ? (
                <Text>Loading</Text>
              ) : (
                <Text>Login</Text>
              )}
              <TextInput
                placeholder="Email"
                style={styles.loginInput}
                value={this.state.emailInput}
                onChangeText={(t) => {
                  this.setState({ emailInput: t });
                }}
              />
              <TextInput
                placeholder="Password"
                style={styles.loginInput}
                value={this.state.paswordInput}
                onChangeText={(t) => {
                  this.setState({ passwordInput: t });
                }}
                secureTextEntry
              />
              <Button title="Login" onPress={this.login} />
            </View>
          </>
        )}
      </>
    );
  }
}
