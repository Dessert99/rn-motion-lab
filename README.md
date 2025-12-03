# 🎨 RN Motion Lab
- React Native Skia와 Reanimated를 활용한 고성능 2D 그래픽 및 인터랙티브 애니메이션 실험

## 🛠️ Tech Stack

| Technology | Version | Description |
| :--- | :--- | :--- |
| **Expo** | `~54.0.0` | React Native 개발 및 빌드 프레임워크 (Managed Workflow) |
| **React Native Skia** | `~2.x.x` | Google Skia 그래픽 엔진을 사용하는 고성능 2D 그래픽 라이브러리 |
| **Reanimated** | `~4.x.x` | UI 스레드에서 자바스크립트 브릿지를 거치지 않고 애니메이션을 구동하는 라이브러리 |

## 📂 Examples

### 1. [Iridescence (박막 간섭 효과)](https://github.com/Dessert99/rn-motion-lab/blob/main/components/iridescence.tsx)

| Feature Details | Preview |
| :--- | :---: |
| **📝 Description**<br>비눗방울이나 기름막 표면에서 볼 수 있는, 시각에 따라 색이 변하는 영롱한 무지개빛(Iridescence)을 시뮬레이션한 예제<br><br>**🛠 Implementation**<br> - **Core API**: `Skia.RuntimeEffect.Make`<br>&nbsp;&nbsp;(GLSL 문자열 컴파일)<br>- **Shader Logic (GLSL)**<br>&nbsp;&nbsp;• **Processing**: `main` 함수 픽셀 단위 병렬 연산<br>&nbsp;&nbsp;• **Algorithm**: `sin`/`cos` 8회 중첩으로 파동 패턴 생성<br>- **Animation Bridge**<br>&nbsp;&nbsp;• **Reanimated**: `useClock()`으로 `uTime` 측정<br>&nbsp;&nbsp;• **Uniforms**: `useDerivedValue`로 값 실시간 주입 | <img src="https://github.com/user-attachments/assets/53d89e51-d10a-40d1-b1ed-e5974be08b22" width="200" alt="Iridescence Demo"> |
