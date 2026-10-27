// 설치형 웹앱(PWA)에서 iOS가 쓰는 실행 화면(apple-touch-startup-image) 목록.
// iOS는 manifest의 배경색으로 실행 화면을 그리지 않고, 기기 화면 크기와 정확히 맞는 그림만 쓴다.
// 그림은 scripts/make-icons.mjs가 이 목록으로 만든다(public/splash/). 새 iPhone이 나오면 여기에 더한다.

export interface AppleScreen {
  /** CSS 픽셀 너비와 높이(세로 방향) */
  w: number;
  h: number;
  /** 기기 픽셀 비율 */
  r: number;
}

export const APPLE_SPLASH: AppleScreen[] = [
  { w: 440, h: 956, r: 3 }, // iPhone 16 Pro Max, 17 Pro Max
  { w: 402, h: 874, r: 3 }, // iPhone 16 Pro, 17, 17 Pro
  { w: 430, h: 932, r: 3 }, // iPhone 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus
  { w: 393, h: 852, r: 3 }, // iPhone 14 Pro, 15, 15 Pro, 16
  { w: 428, h: 926, r: 3 }, // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  { w: 390, h: 844, r: 3 }, // iPhone 12, 12 Pro, 13, 13 Pro, 14, 16e
  { w: 375, h: 812, r: 3 }, // iPhone X, XS, 11 Pro, 12 mini, 13 mini
  { w: 414, h: 896, r: 3 }, // iPhone XS Max, 11 Pro Max
  { w: 414, h: 896, r: 2 }, // iPhone XR, 11
  { w: 375, h: 667, r: 2 }, // iPhone SE (2·3세대), 8
];

export const splashName = (s: AppleScreen, mode: 'light' | 'dark') => `apple-${s.w * s.r}x${s.h * s.r}-${mode}.png`;
