import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <Link href="/skia-demo" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Skia 예제 1 보러가기</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/gradient-clock" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Skia 예제 2 보러가기</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 16,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
