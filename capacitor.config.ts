import type { CapacitorConfig } from '@capacitor/cli';

// 같은 사이트를 앱으로 감싼다. 웹 빌드와 달리 페이지 링크에 index.html까지 적은 앱용 빌드(dist-app)를 쓴다(src/lib/make-paths.ts).
const config: CapacitorConfig = {
  // 스토어에 처음 올린 뒤에는 바꿀 수 없다. 출시 전에 소유한 도메인 기준으로 정한다.
  appId: 'io.github.hpotty36.sabermetrics',
  appName: '세이버메트릭스 핸드북',
  webDir: 'dist-app',
};

export default config;
