# 🎨 RN Motion Lab
- React Native Skia와 Reanimated를 활용한 고성능 2D 그래픽 및 인터랙티브 애니메이션 실험

## 🛠️ Tech Stack

| Technology | Version | Description |
| :--- | :--- | :--- |
| **Expo** | `~54.0.0` | React Native 개발 및 빌드 프레임워크 (Managed Workflow) |
| **React Native Skia** | `~2.x.x` | Google Skia 그래픽 엔진을 사용하는 고성능 2D 그래픽 라이브러리 |
| **Reanimated** | `~4.x.x` | UI 스레드에서 자바스크립트 브릿지를 거치지 않고 애니메이션을 구동하는 라이브러리 |

## 📂 Examples

### [1. Iridescence](https://github.com/Dessert99/rn-motion-lab/blob/main/components/iridescence.tsx)

| Feature Details | Preview |
| :--- | :---: |
| **📝 Description**<br>GLSL 기반 쉐이더로, 비눗방울/기름막처럼 각도에 따라 색이 바뀌는 박막 간섭(Iridescence) 효과를 구현한 예제.<br><br>**1) 주요 기능**<br>- `Skia.RuntimeEffect.Make`로 GLSL 문자열을 GPU 쉐이더로 컴파일<br>- `Shader` 컴포넌트에 `uniforms`를 연결해 전체 화면을 쉐이더로 채움 (`Fill`)<br>- `useClock` + `useDerivedValue`로 시간(`uTime`)·해상도(`uResolution`)·색상(`uColor`)을 실시간으로 쉐이더에 주입<br><br>**2) 원리**<br>- 픽셀 단위(`main(vec2 fragCoord)`)로 좌표를 정규화하고, 여러 번의 `sin`/`cos` 반복 루프로 파동 패턴 생성<br>- 시간(`uTime`)과 속도(`uSpeed`)를 이용해 패턴이 지속적으로 흐르도록 애니메이션<br>- 최종적으로 RGB 채널을 비선형 조합해 빛의 굴절/간섭처럼 보이는 색 패턴을 계산 후 화면 전체에 렌더링<br><br>**3) 주요 옵션**<br>- `color`: `uColor`에 매핑되는 기본 색상 (RGB, `[number, number, number]`)<br>- `speed`: `uSpeed`에 매핑되는 파동 애니메이션 속도<br>- `amplitude`: `uAmplitude`에 매핑되는 물결의 강도(진폭)<br>- `width` / `height`: `useWindowDimensions`를 기본으로 하되, 필요 시 외부에서 캔버스 크기 오버라이드 가능 | <img src="https://github.com/user-attachments/assets/53d89e51-d10a-40d1-b1ed-e5974be08b22" width="200" alt="Iridescence Demo"> |


### [2. GradientClock](https://github.com/Dessert99/rn-motion-lab/blob/main/app/gradient-clock.tsx)

| Feature Details | Preview |
| :--- | :---: |
| **📝 Description**<br>낮(DAY)↔밤(NIGHT)의 흐름을 회전하는 원형 그라디언트로 표현한 예제. 배경은 부드럽게 회전하고, 텍스트는 고정되어 있어 대비감 있는 모션 효과를 보여준다.<br><br>**1) 주요 기능**<br>- `useSharedValue`로 회전 상태(`rotation`)를 관리하고, `withTiming` + `withRepeat`로 무한 회전 애니메이션 구현<br>- `useDerivedValue`로 `rotation`을 Skia가 사용하는 `transform` 형식(`[{ rotate: ... }]`)으로 변환<br>- Skia `Canvas` + `Rect` + `SweepGradient`로 전체 화면 배경을 그라디언트로 채우고, RN `Text`로 DAY/NIGHT 오버레이<br><br>**2) 원리**<br>- `rotation.value`를 0 → 2까지 선형으로 증가시키고(`withTiming`), 이를 무한 반복(`withRepeat`)하여 라디안 각도(`Math.PI * rotation.value`)로 변환<br>- `SweepGradient`의 `transform`에 해당 회전 값을 적용해, 중심점(`centerVec`)을 기준으로 색상 배열이 계속 회전하도록 구현<br>- Skia 레이어 위에 RN `Text`를 절대 위치로 올려, 회전하는 배경 + 고정된 타이포그래피 대비 연출<br><br>**3) 주요 옵션**<br>- `duration`, `easing`: 회전 속도와 가속 곡선(`Easing.linear`) 설정<br>- `colors`: 낮→밤을 표현하는 그라디언트 색상 리스트 (`["white", "gray", "#222222", "black"]` 등)<br>- `origin`, `c`: 그라디언트 중심점(일반적으로 화면 중앙 `vec(width/2, height/2)`) | ![2](https://github.com/user-attachments/assets/3c29d2d3-247c-4129-ba48-3548225940fb) |



### [3. ChasingBubble](https://github.com/Dessert99/rn-motion-lab/blob/main/app/chasing-bubble.tsx)

| Feature Details | Preview |
| :--- | :---: |
| **📝 Description** <br>사용자 제스처(드래그)에 반응해 점들의 크기가 스프링 애니메이션으로 변화하는 효과. 격자 형태의 버블들이 손가락 주변에서 커졌다가 사라지며 동적인 배경처럼 사용 가능.<br><br>**1) 주요 기능**<br>- `Gesture.Pan` + `GestureDetector`로 손가락 위치 추적<br>- `useSharedValue`로 터치 좌표(x, y) 관리<br>- `useDerivedValue` + `withSpring`으로 각 점의 반지름(r) 애니메이션 처리<br>- Skia `Canvas` + `Circle`로 수십 개 점을 GPU 렌더링<br><br>**2) 원리**<br>- 고정된 격자(COLUMNS × rows)를 만든 뒤, 각 점의 좌표를 index 기반으로 계산<br>- 현재 터치 좌표와 각 점 사이의 거리(`Math.hypot`)를 계산해, 일정 반경(`ACTIVE_DISTANCE`) 안에 있으면 큰 반지름, 밖이면 작은 반지름으로 설정<br>- 반지름 변경을 `withSpring`으로 부드럽게 보간해, 손가락이 지나갈 때 버블이 살아났다 사라지는 느낌을 구현<br><br>**3) 주요 옵션**<br>- `COLUMNS`, `ROW_SPACING`, `COLUMN_SPACING` : 점 격자 밀도/배치 조절<br>- `ROW_STEP_FOR_COUNT` : 화면 높이 대비 세로 줄 수(점 개수) 결정<br>- `ACTIVE_DISTANCE` : 손가락 주변 몇 px까지 반응할지 (터치 범위)<br>- `ACTIVE_RADIUS` / `INACTIVE_RADIUS` : 활성/비활성 상태에서 점 크기 설정 | ![3](https://github.com/user-attachments/assets/41097ef9-0c67-4ea1-aa7e-5a0e979ccf5b) |
