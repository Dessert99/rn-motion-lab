import { Canvas, Rect, SweepGradient, vec } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function GradientClock() {
  // 회전 각도를 저장하는 "공유 값(shared value)".
  // Reanimated가 이 값을 추적하면서 값이 변할 때마다 자동으로 애니메이션을 갱신해 줌.
  const rotation = useSharedValue(0);

  // 기기 현재 화면 크기를 가져옴 (가로/세로)
  const { width, height } = useWindowDimensions();

  // 화면 중앙 좌표 계산
  const centerX = width / 2;
  const centerY = height / 2;

  // Skia에서 쓰이는 벡터 형태로 표현
  const centerVec = vec(centerX, centerY);

  // rotation 값이 바뀔 때마다 적용할 "변환(회전)" 값을 만들어 주는 파생값(derived value)
  const animatedRotation = useDerivedValue(() => {
    // rotation.value는 0 → 2까지 변함.
    // Math.PI * rotation.value 로 라디안 각도를 만들고,
    // Skia에 넘길 transform 형식(rotate 속성 배열)으로 반환.
    return [{ rotate: Math.PI * rotation.value }];
  }, [rotation]); // rotation이 변경될 때마다 다시 계산

  // 자동으로 돌기 시작하는 애니메이션은 useEffect로 첫 마운트에 withRepeat를 걸어준다.
  useEffect(() => {
    // rotation.value 에 애니메이션을 걸어 줌
    rotation.value = withRepeat(
      withTiming(
        2, // 최종 값: 0 → 2 까지 변화
        {
          duration: 4000, // 4초 동안
          easing: Easing.linear, // 일정한 속도로
        },
      ),
      -1, // -1: 무한 반복
      false, // 왕복(false) X, 0→2, 0→2 이렇게 반복
    );
  }, []); // 의존성 배열을 비워서 마운트 시 한 번만 실행

  return (
    <View style={styles.container}>
      {/* Skia가 그림을 그릴 영역. */}
      <Canvas style={[styles.container]}>
        {/* Rect: 캔버스 전체를 덮는 사각형(배경처럼 사용) */}
        <Rect
          // 사각형의 좌상단(top-left) 좌표
          x={0}
          y={0}
          // 사각형의 가로/세로 길이
          width={width}
          height={height}
        >
          {/* SweepGradient: 중심을 기준으로 시계 방향으로 색이 바뀌는 그라디언트 */}
          <SweepGradient
            origin={centerVec} // 기준점
            c={centerVec} // 그라디언트 중심
            start={0} // 시작 각도 (도 단위)
            end={360} // 끝 각도 (360도 = 한 바퀴)
            // 시간에 따라 회전하는 색상 리스트
            colors={["white", "gray", "#222222", "black"]}
            // 위에서 만든 animatedRotation을 transform으로 넣어 회전 애니메이션 적용
            transform={animatedRotation}
          />
        </Rect>
      </Canvas>

      <Text style={styles.dayText}>DAY</Text>
      <Text style={styles.nightText}>NIGHT</Text>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayText: {
    position: "absolute",
    top: 70,
    fontSize: 90,
    color: "black",
    alignSelf: "center",
    fontWeight: "100",
  },
  nightText: {
    position: "absolute",
    bottom: 70,
    fontSize: 90,
    color: "white",
    alignSelf: "center",
    fontWeight: "100",
  },
});

export default GradientClock;
