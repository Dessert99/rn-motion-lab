import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "메인 홈",
          headerShown: false,
        }}
      />

      <Stack.Screen name="skia-demo" options={{ title: " 예제 1" }} />
      <Stack.Screen name="gradient-clock" options={{ title: " 예제 2" }} />
    </Stack>
  );
}
