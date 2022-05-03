import AsyncStorage from "@react-native-async-storage/async-storage";
import { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import styles from "../styles";

class NewWork extends Component {
  constructor() {
    super();
    this.postWork = this.postWork.bind(this);
    this.state = {
      todayWork: false,
      email: "",
      loading: false,
      password: "",
      work: [{ name: "", hw: "", cw: "" }],
    };
    this.periods = ["First", "Second", "Third", "Forth", "Fifth"];
    this.styles = StyleSheet.create(styles);
  }
  componentDidMount() {
    this.setEmail().then(() => {
      this.checkTodayWork();
    });
  }
  async setEmail() {
    let email = await AsyncStorage.getItem("@email");
    let password = await AsyncStorage.getItem("@password");
    this.setState({ email: email, password: password });
  }
  checkTodayWork() {
    this.setState({ loading: true });
    fetch("https://school-server.herokuapp.com/onDayWork", {
      headers: { email: this.state.email, date: new Date().toDateString() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.todayWork) {
          this.setState({ todayWork: true });
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }
  postWork() {
    let date = new Date();
    console.log( `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
    fetch("https://school-server.herokuapp.com/uploadWork", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        work: this.state.work,
        date: date.toDateString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          this.setState({ todayWork: true });
        }
      });
  }
  render() {
    return (
      <View>
        {this.state.loading ? (
          <Text style={this.styles.loadingFlag}>Loading</Text>
        ) : (
          <>
            {this.state.todayWork ? (
              <Text style = {this.styles.work}>Today's work has already been uploaded !</Text>
            ) : (
              <ScrollView>
                {this.state.work.map((work, index) => (
                  <View key={index}>
                    <Text style={{ margin: 5 }}>
                      {this.periods[index] ? this.periods[index] : "Extra"}{" "}
                      Period
                    </Text>
                    <TextInput
                      value={this.state.work[index].name}
                      onChangeText={(text) => {
                        this.state.work[index].name = text;
                        this.setState(this.state);
                      }}
                      style={this.styles.workInput}
                      placeholder="Subject"
                    />
                    <TextInput
                      value={this.state.work[index].cw}
                      onChangeText={(text) => {
                        this.state.work[index].cw = text;
                        this.setState(this.state);
                      }}
                      style={this.styles.workInput}
                      placeholder="Class Work"
                    />
                    <TextInput
                      value={this.state.work[index].hw}
                      onChangeText={(text) => {
                        this.state.work[index].hw = text;
                        this.setState(this.state);
                      }}
                      style={this.styles.workInput}
                      placeholder="Home Work"
                    />
                  </View>
                ))}
                <View style={this.styles.workUploadAction}>
                  <TouchableOpacity
                    style={this.styles.workAddButton}
                    onPress={() => {
                      this.setState({
                        work: [
                          ...this.state.work,
                          { name: "", hw: "", cw: "" },
                        ],
                      });
                    }}
                  >
                    <Icon name="pluscircleo" size={30} color="#0c9c88" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={this.styles.workAddButton}
                    onPress={this.postWork}
                  >
                    <Icon name="check" size={30} color="#0c9c88" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </>
        )}
      </View>
    );
  }
}

export default NewWork;
