# 🎨 RN Motion Lab
- React Native Skia와 Reanimated를 활용한 고성능 2D 그래픽 및 인터랙티브 애니메이션 실험

## 🛠️ Tech Stack

| Technology | Version | Description |
| :--- | :--- | :--- |
| **Expo** | `~54.0.0` | React Native 개발 및 빌드 프레임워크 (Managed Workflow) |
| **React Native Skia** | `~2.x.x` | Google Skia 그래픽 엔진을 사용하는 고성능 2D 그래픽 라이브러리 |
| **Reanimated** | `~4.x.x` | UI 스레드에서 자바스크립트 브릿지를 거치지 않고 애니메이션을 구동하는 라이브러리 |

## 📂 Examples

### [1. Iridescence (박막 간섭 효과)](https://github.com/Dessert99/rn-motion-lab/blob/main/components/iridescence.tsx)

| Feature Details | Preview |
| :--- | :---: |
| **📝 Description**<br>비눗방울이나 기름막 표면에서 볼 수 있는, 시각에 따라 색이 변하는 영롱한 무지개빛(Iridescence)을 시뮬레이션한 예제<br><br>**🛠 Implementation**<br> - **Core API**: `Skia.RuntimeEffect.Make`<br>&nbsp;&nbsp;(GLSL 문자열 컴파일)<br>- **Shader Logic (GLSL)**<br>&nbsp;&nbsp;• **Processing**: `main` 함수 픽셀 단위 병렬 연산<br>&nbsp;&nbsp;• **Algorithm**: `sin`/`cos` 8회 중첩으로 파동 패턴 생성<br>- **Animation Bridge**<br>&nbsp;&nbsp;• **Reanimated**: `useClock()`으로 `uTime` 측정<br>&nbsp;&nbsp;• **Uniforms**: `useDerivedValue`로 값 실시간 주입 | <img src="https://github.com/user-attachments/assets/53d89e51-d10a-40d1-b1ed-e5974be08b22" width="200" alt="Iridescence Demo"> |


### [2. GradientClock](https://github.com/Dessert99/rn-motion-lab/blob/main/app/gradient-clock.tsx)

| Feature Details | Preview |
| :--- | :---: |
| **📝 Description**<br>하루의 흐름(DAY ↔ NIGHT)을 상징적으로 표현한, 회전하는 원형 그라디언트 배경 예제.<br>Skia의 `SweepGradient`와 Reanimated의 `sharedValue`를 연결해, 시간에 따라 계속 회전하는 무한 루프 애니메이션을 구현한 데모.<br><br>**🛠 Implementation**<br>**1) Skia 레이어 구조**<br>- **`Canvas`**: Skia가 그리는 실제 캔버스. React Native의 `View`와 비슷한 컨테이너이지만, 내부 렌더링은 Skia 엔진으로 처리됨.<br>- **`Rect`**: 화면 전체를 덮는 직사각형 배경 레이어. `x=0`, `y=0`, `width=스크린 폭`, `height=스크린 높이`로 설정해 풀스크린 배경으로 사용.<br>- **`SweepGradient`**: 중심점을 기준으로 0°→360°에 걸쳐 색이 도는 원형 그라디언트.<br>&nbsp;&nbsp;• `origin`, `c`: 그라디언트의 중심 좌표. `vec(centerX, centerY)`로 기기 화면 중앙에 위치시킴.<br>&nbsp;&nbsp;• `start`, `end`: 각도 범위(0~360도) 설정으로 한 바퀴 전체를 커버.<br>&nbsp;&nbsp;• `colors`: `["white", "gray", "#222222", "black"]` 배열로 밝은 낮 → 어두운 밤으로 이어지는 색 흐름 구성.<br>&nbsp;&nbsp;• `transform`: Reanimated에서 계산한 회전 값(`[{ rotate: ... }]`)을 전달해, 그라디언트 자체를 회전시키는 핵심 속성.<br><br>**2) Reanimated 애니메이션 브리지**<br>- **`useSharedValue(0)`**: 회전 상태를 저장하는 애니메이션 값. 0 → 2 구간을 사용하며, UI 스레드에서 관리되어 프레임 드랍에 강함.<br>- **`withTiming(2, { duration: 8000, easing: Easing.linear })`**: `rotation`을 0에서 2까지 8초 동안, 일정한 속도로(linear) 변화시키는 타이밍 애니메이션.<br>- **`withRepeat(..., -1, false)`**: 위 타이밍 애니메이션을 무한 반복(-1), 왕복 없이 같은 방향으로만 반복하도록 설정.<br>- **`useDerivedValue`**: 원시 값인 `rotation.value`를 Skia가 이해할 수 있는 변환 형식으로 가공.<br>&nbsp;&nbsp;• `[{ rotate: Math.PI * rotation.value }]` 형태의 배열을 반환해 `SweepGradient`의 `transform`에 직접 연결.<br>&nbsp;&nbsp;• Reanimated shared value → Skia transform 사이의 “브리지 레이어” 역할 담당.<br>- **`useEffect`**: 컴포넌트 마운트 시점에 한 번만 애니메이션을 시작하기 위한 훅.<br>&nbsp;&nbsp;• 의존성 배열 `[]`로 설정해, 리렌더 시마다 애니메이션이 재시작되지 않도록 방지.  | ![2](https://github.com/user-attachments/assets/3c29d2d3-247c-4129-ba48-3548225940fb) |






