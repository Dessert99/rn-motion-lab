# 🎨 RN Motion Lab
- React Native Skia와 Reanimated를 활용한 고성능 2D 그래픽 및 인터랙티브 애니메이션 실험

## 🛠️ Tech Stack

| Technology | Version | Description |
| :--- | :--- | :--- |
| **Expo** | `~54.0.0` | React Native 개발 및 빌드 프레임워크 (Managed Workflow) |
| **React Native Skia** | `~2.x.x` | Google Skia 그래픽 엔진을 사용하는 고성능 2D 그래픽 라이브러리 |
| **Reanimated** | `~4.x.x` | UI 스레드에서 자바스크립트 브릿지를 거치지 않고 애니메이션을 구동하는 라이브러리 |

## 📂 Examples

### 1. Iridescence (박막 간섭 효과)

- 비눗방울이나 기름막 표면에서 볼 수 있는, 시각에 따라 색이 변하는 영롱한 무지개빛(Iridescence)을 시뮬레이션한 예제

- **Core API**: `Skia.RuntimeEffect.Make` (GLSL 문자열 컴파일)
- **Shader Logic (GLSL)**
  - **Fragment Processing**: `main(vec2 fragCoord)` 함수를 통해 픽셀 단위 병렬 연산
  - **Algorithm**: `sin`/`cos` 함수를 8회 중첩(`for loop`)하여 유기적인 파동 패턴 생성
- **Animation Bridge**
  - **Reanimated**: `useClock()`으로 매 프레임 시간(`uTime`) 측정
  - **Uniforms**: `useDerivedValue`를 사용하여 CPU(Time) → GPU(Shader)로 값 실시간 주입