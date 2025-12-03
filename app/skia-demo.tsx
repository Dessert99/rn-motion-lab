import Iridescence from "@/components/iridescence";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SkiaDemoScreen() {
  return (
    <View style={styles.container}>
      {/* 배경 레이어 */}
      {/* position: "absolute" -> 일반적인 레이아웃 흐름에서 벗어나 부모(전체 컨테이너)를 기준으로 위치를 잡습니다. */}
      {/* top/left/right/bottom: 0 -> 상하좌우 여백을 0으로 설정해 부모 크기만큼 꽉 채웁니다. (StyleSheet.absoluteFill과 같음) */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Iridescence speed={1} />
      </View>

      {/* 전경 콘텐츠 */}
      {/* Absolute View(배경)보다 코드상 뒤에 위치하므로, 화면상에서는 배경 '위'에 그려집니다 (Z-index가 더 높음). */}
      <Text style={styles.mainText}>Welcome to Expo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
});
