// Based on shader https://reactbits.dev/backgrounds/iridescence
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import React from "react";
import { useWindowDimensions } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

// ---------------------------------------------------------
// [1] GLSL 쉐이더 코드 정의
// Skia.RuntimeEffect.Make는 문자열로 된 GLSL 코드를
// 실제로 그래픽 카드(GPU)가 실행할 수 있는 객체로 변환합니다.
// ---------------------------------------------------------
const source = Skia.RuntimeEffect.Make(`
// uniform: 자바스크립트(React)에서 넘겨받을 변수들입니다.
uniform vec3 uResolution; // 화면 크기 (너비, 높이 등)
uniform float uTime;      // 시간 (애니메이션 진행용)
uniform vec3 uColor;      // 기본 색상
uniform float uAmplitude; // 물결의 높이(진폭)
uniform float uSpeed;     // 물결 속도

// main 함수: 화면의 모든 픽셀마다 한 번씩 실행되어 색상을 결정합니다.
vec4 main(vec2 fragCoord) {
  // 현재 픽셀 좌표(fragCoord)를 0.0 ~ 1.0 사이 값으로 정규화합니다.
  vec2 vUv = fragCoord / uResolution.xy;
  
  // 화면 비율에 맞춰 좌표를 조정합니다. (찌그러짐 방지)
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;  

  // 시간에 따른 움직임을 계산합니다.
  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  
  // 8번 반복하며 여러 개의 물결(sin/cos)을 겹쳐서 복잡한 패턴을 만듭니다.
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  
  d += uTime * 0.5 * uSpeed;
  
  // 최종 색상을 계산하는 수식입니다. (빛의 굴절/반사 느낌 구현)
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  
  // 계산된 색상(RGBA)을 반환하여 화면에 그립니다.
  return vec4(col, 1.0);
}
`);

// ---------------------------------------------------------
// [2] 리액트 컴포넌트
// ---------------------------------------------------------
export default function Iridescence({
  color = [1, 1, 1], // 기본값: 흰색
  speed = 1.0, // 기본값: 속도 1
  amplitude = 0.1, // 기본값: 진폭 0.1
  ...props
}: {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  width?: number;
  height?: number;
}) {
  // Skia의 시계(Clock)를 가져옵니다. 애니메이션 프레임마다 값이 증가합니다.
  const clock = useClock();

  // 현재 디바이스 화면 크기를 가져옵니다.
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const width = props.width ?? screenWidth;
  const height = props.height ?? screenHeight;

  // ---------------------------------------------------------
  // [3] Uniforms 연결 (Bridge)
  // useDerivedValue: Reanimated 값(clock)이 변할 때마다
  // Skia 쉐이더에 넘겨줄 데이터(uniforms)를 실시간으로 업데이트합니다.
  // ---------------------------------------------------------
  const uniforms = useDerivedValue(() => {
    return {
      uResolution: [width, height, width / height], // 쉐이더의 uResolution 대응
      uTime: clock.value / 1000, // 쉐이더의 uTime 대응 (초 단위 변환)
      uColor: color, // 쉐이더의 uColor 대응
      uAmplitude: amplitude,
      uSpeed: speed,
    };
  }, [clock, width, height]);

  return (
    // Canvas: Skia 그래픽을 그릴 도화지
    <Canvas style={{ flex: 1 }}>
      {/* Fill: 도화지 전체를 채웁니다 */}
      <Fill>
        {/* Shader: 아까 만든 쉐이더 코드(source)에 데이터(uniforms)를 넣어서 그립니다 */}
        <Shader source={source!} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}

Iridescence.displayName = "Iridescence";
