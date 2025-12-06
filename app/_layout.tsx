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

      <Stack.Screen name="skia-demo" options={{ title: "skia-domo" }} />
      <Stack.Screen
        name="gradient-clock"
        options={{ title: "gradient-clock" }}
      />
      <Stack.Screen
        name="chasing-bubble"
        options={{
          title: "chasing-bubble",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="arcSlider"
        options={{
          title: "arcSlider",
        }}
      />
    </Stack>
  );
}
