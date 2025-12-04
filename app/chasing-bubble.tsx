import { Canvas, Circle } from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

//상수
const COLUMNS = 12; // 가로 열 개수
const ROW_SPACING = 30; // 한 줄에서 다음 줄까지 세로 간격(px)
const COLUMN_SPACING = 30; // 가로 점 간 간격
const LEFT_PADDING = 30; // 왼쪽에서 첫 점까지의 여백
const TOP_PADDING = 30; // 위에서 첫 줄까지 여백
const ROW_STEP_FOR_COUNT = 40; // "줄 하나당 높이" (간격 + 여유)

const TOUCH_INACTIVE = -1; // 터치 안 하는 상태를 나타내는 값
const ACTIVE_DISTANCE = 70; // 터치 영향 반경(px)
const ACTIVE_RADIUS = 10; // 터치 범위 안에서의 점 크기
const INACTIVE_RADIUS = 3; // 기본 점 크기

// 타입
interface DotProps {
  index: number;
  xPosition: SharedValue<number>; // Reanimated에서 관리하는 "애니메이션 가능한 값" 타입
  yPosition: SharedValue<number>;
}

// Dot 컴포넌트
export function Dot({ index, xPosition, yPosition }: DotProps) {
  const currentRow = Math.floor(index / COLUMNS) * ROW_SPACING; // 이 점이 그리드 상에서 어느 행에 위치하는지 계산
  const currentColumn =
    Math.floor(index % COLUMNS) * COLUMN_SPACING + LEFT_PADDING; // 이 점이 그리드 상에서 어느 열에 위치하는지 계산

  // 점의 반지름 크기
  const radius = useDerivedValue(() => {
    // 사용자의 터치 위치(xPosition, yPosition)와 이 점의 위치(currentColumn, currentRow) 사이의 거리
    const distance = Math.hypot(
      // 이 값들이 바뀔 때마다 콜백이 다시 실행되어 새로운 반지름을 계산
      xPosition.value - currentColumn,
      // 여기도 30 대신 TOP_PADDING 쓰면 의미가 더 명확해짐
      yPosition.value - TOP_PADDING - currentRow,
    );

    // 거리 범위 이하이고, "터치 중"일 때
    const isActive =
      xPosition.value !== TOUCH_INACTIVE && distance <= ACTIVE_DISTANCE;

    // 클릭 범위 안에 있는지에 따라 점 크기가 다르다
    return withSpring(isActive ? ACTIVE_RADIUS : INACTIVE_RADIUS, {
      overshootClamping: true,
    });
  }, [xPosition, yPosition]);

  return (
    <Circle
      cx={currentColumn}
      cy={currentRow + TOP_PADDING}
      r={radius} // Circle컴포넌트 r속성에 SharedValue/DerivedValue를 넘기면 radius가 애니메이션으로 변할 때마다 Skia가 자동으로 다시 그려주면서 부드럽게 크기가 변하는 효과 연출한다.
      color={"blue"}
    />
  );
}

// Canvas 페이지
export default function ChasingBubbles() {
  const [nums, setNums] = useState<number[]>([]);
  const { height } = useWindowDimensions();

  // 점 배열 나열하기
  useEffect(() => {
    const dotsForHeight = Math.round(height / ROW_STEP_FOR_COUNT);
    const numsArray = Array.from(Array(COLUMNS * dotsForHeight).keys());
    setNums(numsArray);
  }, [height]); // height 변하면 다시 계산

  // xPosition / yPosition은 "현재 손가락(포인터)의 위치"를 나타내는 애니메이션 값
  const xPosition = useSharedValue(TOUCH_INACTIVE); // 초기값 -1은 "아직 터치되지 않음" 상태를 표현
  const yPosition = useSharedValue(TOUCH_INACTIVE);

  // 손가락 이동을 추적
  const gesture = Gesture.Pan()
    //제스처가 시작될 때 한 번 호출
    .onBegin(({ x, y }) => {
      // 제스처가 시작된 위치를 SharedValue에 저장
      xPosition.value = x;
      yPosition.value = y;
    })

    // 손가락이 이동할 때마다 계속 호출
    .onChange(({ x, y }) => {
      // 손가락이 이동할 때마다 SharedValue 갱신하여 이를 참조하는 radius(useDerivedValue)가 다시 계산되고, Circle의 반지름 애니메이션이 실시간으로 반응
      xPosition.value = x;
      yPosition.value = y;
    })
    // 정상적으로 제스처가 종료될 때 호출
    .onEnd(() => {
      // 제스처가 정상 종료되면, "터치 없음" 상태로 리셋
      xPosition.value = TOUCH_INACTIVE;
      yPosition.value = TOUCH_INACTIVE;
    })
    // cancel, fail, end 등 "모든 종료 케이스"에서 마지막에 한 번 더 호출
    .onFinalize(() => {
      // cancel / fail 등 모든 종료 케이스까지 포함해서 최종적으로 한 번 더 리셋
      xPosition.value = TOUCH_INACTIVE;
      yPosition.value = TOUCH_INACTIVE;
    });

  return (
    // 제스처 핸들러들이 제대로 동작하기 위한 최상위 컨테이너: 일반적으로 앱 루트 수준에서 한 번 감싸는 것이 권장되지만,여기서는 데모 용도로 이 컴포넌트에서 바로 사용
    <GestureHandlerRootView style={styles.container}>
      {/*위에서 정의한 gesture(Pan)를 자식 뷰에 연결 */}
      <GestureDetector gesture={gesture}>
        <Canvas style={{ height: "100%", width: "100%" }}>
          {nums.map((dotIndex) => {
            return (
              <Dot
                key={dotIndex}
                index={dotIndex}
                xPosition={xPosition}
                yPosition={yPosition}
              />
            );
          })}
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

/*
## 내부 동작
1. 처음 렌더링 시점
  - useEffect실행 -> Canvas와 Dot 컴포넌트들 렌더링
  - 이후에는 터치 때문에 React가 다시 렌더링되는 일은 없음
2. 터치 중
  - 이 SharedValue를 참조하는 useDerivedValue(radius)가 UI 스레드에서 다시 계산됨
  - 중요한 포인트: React 렌더는 안 돈다
3. 핵심
  - JS/React 쪽은 렌더링 + diff + 브리지까지 다 타야 해서 비싸고,
  - Skia + Reanimated 쪽은 이미 있는 네이티브 뷰 안에서 숫자만 바꿔서 바로 그림이라 싸다.
*/
