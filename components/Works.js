import AsyncStorage from "@react-native-async-storage/async-storage";
import { Component } from "react";
import { ScrollView, StyleSheet,BackHandler, Text, View } from "react-native";
import styles from "../styles";

class Works extends Component {
  constructor() {
    super();
    this.state = {
      works: [],
      email: "",
      workDisplay: false,
      selectedWorkId: "",
      selectedWorkDate: "",
      selectedWork: [],
    };
    this.styles = StyleSheet.create(styles);
    BackHandler.addEventListener("hardwareBackPress",()=>{
        if (this.state.workDisplay){
          this.setState({workDisplay:false})
          return true;
        }
    });
  }
  componentDidMount() {
    this.setEmail().then(() => {
      this.loadWorks();
    });
  }
  async setEmail() {
    let email = await AsyncStorage.getItem("@email");
    this.setState({ email: email });
  }
  loadWorks() {
    fetch("https://school-server.herokuapp.com/works", {
      headers: {
        email: this.state.email,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.works) {
          this.setState({ works: data.works });
        }
      });
  }
  loadWorkDetais(id) {
    fetch("https://school-server.herokuapp.com/workById", {
      headers: { id: id },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          this.setState({
            workDisplay: true,
            selectedWorkId: id,
            selectedWork: data.work.work,
            selectedWorkDate: data.work.date,
          });
        }
      });
  }
  render() {
    return (
      <View>
        {this.state.workDisplay ? (
          <View>
            <Text style={this.styles.workDetailsDate}>
              {new Date(this.state.selectedWorkDate).toDateString()}
            </Text>
            {this.state.selectedWork.map((work, index) => (
              <View key={index} style={this.styles.workContainer}>
                <Text>Subject : {work.name}</Text>
                <Text>HW : {work.hw}</Text>
                <Text>CW : {work.cw}</Text>
              </View>
            ))}
          </View>
        ) : (
          <>
            {this.state.works.length === 0 ? (
              <Text>No Works</Text>
            ) : (
              <ScrollView style={styles.worksContainer}>
                {this.state.works.map((work) => (
                  <Text
                    key={work.id}
                    style={styles.work}
                    onPress={() => {
                      this.loadWorkDetais(work.id);
                    }}
                  >
                    {new Date(work.date).toDateString()}
                  </Text>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </View>
    );
  }
}
export default Works;
