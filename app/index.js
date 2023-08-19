import { useRouter } from "expo-router";
import { StyleSheet, Text, View, Button } from "react-native";

const WelcomeScreen = () => {
  const navigation = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transition</Text>
      <Text style={styles.subtitle}>Welcome</Text>
      <Button title="See your formations" onPress={() => navigation.push("/Projects")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default WelcomeScreen;