import { Canvas, Circle, Path, Rect, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const ghost = require("@/assets/images/ghost.png");
// Worklet 함수 (redash 대체)
const polar2Canvas = (
  { theta, radius }: { theta: number; radius: number },
  center: { x: number; y: number },
) => {
  "worklet";
  return {
    x: center.x + radius * Math.cos(theta),
    y: center.y + radius * Math.sin(theta),
  };
};

const { width, height } = Dimensions.get("window");
// [중요] 슬라이더의 중심점을 화면 하단으로 내립니다. (전체 높이의 85% 지점)
const CENTER_Y = height * 0.85;
const CENTER_X = width / 2;

export default function ArcSlider() {
  const strokeWidth = 20;
  const r = (width - strokeWidth) / 2 - 40;

  // 각도 설정: 왼쪽(PI) -> 오른쪽(0)
  const startAngle = Math.PI;
  const endAngle = 0;

  // 좌표 계산 (중심점 CENTER_X, CENTER_Y 사용)
  const x1 = CENTER_X + r * Math.cos(startAngle);
  const y1 = CENTER_Y + r * Math.sin(startAngle);
  const x2 = CENTER_X + r * Math.cos(endAngle);
  const y2 = CENTER_Y + r * Math.sin(endAngle);

  // Path 생성
  const rawPath = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  const skiaBackgroundPath = useMemo(
    () => Skia.Path.MakeFromSVGString(rawPath),
    [rawPath],
  );

  // Shared Values
  const percentComplete = useSharedValue(0);
  const movableCx = useSharedValue(x1);
  const movableCy = useSharedValue(y1);

  const gesture = Gesture.Pan().onUpdate(({ absoluteX, absoluteY }) => {
    // [수정됨] 좌표 계산 시 조정된 중심점(CENTER_X, CENTER_Y)을 사용합니다.
    const xPrime = absoluteX - CENTER_X;
    const yPrime = absoluteY - CENTER_Y;

    let theta = Math.atan2(yPrime, xPrime);

    // 상단 반원 범위를 벗어난 경우 처리
    if (theta > 0) {
      theta = absoluteX < CENTER_X ? Math.PI : 0;
    }

    // 진행률 계산
    let percent = 0;
    if (theta < 0) {
      percent = 1 - theta / -Math.PI;
    } else {
      percent = absoluteX < CENTER_X ? 0 : 1;
    }

    percentComplete.value = Math.max(0, Math.min(1, percent));

    // 노브 좌표 업데이트
    let constrainedTheta = theta;
    if (constrainedTheta > 0)
      constrainedTheta = absoluteX < CENTER_X ? -Math.PI : 0;

    const newCoords = polar2Canvas(
      { theta: constrainedTheta, radius: r },
      { x: CENTER_X, y: CENTER_Y },
    );

    movableCx.value = newCoords.x;
    movableCy.value = newCoords.y;
  });

  const style = useAnimatedStyle(() => {
    return {
      height: 200,
      width: 300,
      opacity: percentComplete.value,
    };
  }, []);

  if (!skiaBackgroundPath) return <View />;

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          {/* 1. Canvas를 전체 화면으로 깔아버립니다 */}
          <Canvas style={styles.canvas}>
            <Rect x={0} y={0} width={width} height={height} color="black" />
            <Path
              path={skiaBackgroundPath}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
              color={"#333"}
            />
            <Path
              path={skiaBackgroundPath} // 같은 경로를 사용하되 trim으로 자릅니다
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
              color={"orange"}
              start={0}
              end={percentComplete}
            />
            <Circle
              cx={movableCx}
              cy={movableCy}
              r={20}
              color="orange"
              style="fill"
            />
            <Circle
              cx={movableCx}
              cy={movableCy}
              r={15}
              color="white"
              style="fill"
            />
          </Canvas>

          {/* 2. Ghost 이미지는 Canvas 위에 띄우되 터치를 방해하지 않게 설정합니다 */}
          <View style={styles.ghostContainer} pointerEvents="none">
            <Animated.Image source={ghost} style={style} resizeMode="center" />
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  canvas: {
    flex: 1, // 이제 Canvas가 전체 화면을 차지합니다.
  },
  ghostContainer: {
    ...StyleSheet.absoluteFillObject, // 화면 전체를 덮지만
    justifyContent: "center", // 내용은 중앙 정렬
    alignItems: "center",
    paddingBottom: 200, // 슬라이더와 겹치지 않게 위로 조금 올림
  },
});
