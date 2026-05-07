import { Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../styles/global";

const Home = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>Deadline Radar</Text>
    </View>
  );
};

export default Home;
