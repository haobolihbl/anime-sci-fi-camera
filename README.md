# 霓格相机 / Anime Sci-Fi Camera

面向 iPhone 与 Android 的移动录像原型。产品目标是：保留本人辨识度，但降低“真人直面镜头”的压力，实时加入偏现代日系动画角色的质感、自然柔和的电影光影，以及更有空间层次的科幻数字光效。当前工程版本为 `0.2.0`。

> 风格方向是原创的“现代日系动画电影感”，不复制任何在世创作者或具体作品的独特画风。

## 这版已经做到

- iOS / Android 共用 React Native 0.86 界面与业务状态。
- VisionCamera 5 原生相机预览、前后摄像头切换、麦克风录像。
- `9:16`（1080×1920）与 `16:9`（1920×1080）两种目标画幅。
- 建议预设：本人相似 66、动漫化 72、柔光 78、数字感 84；四项可独立调节。
- 录像状态机；开始、停止、错误、后台切换时安全停录。
- 为 MediaPipe 人脸网格与原生 GPU 合成器定义了清晰接口。
- 纯逻辑测试覆盖参数边界、录像状态和画幅计算。

## 当前边界（务必阅读）

当前交付是第一版可继续开发的工程原型。相机与 MP4 录像链路已经接入；界面上的柔光、扫描线和 HUD 是轻量预览指引。真正逐帧的“本人 + 动漫化 + 科幻数字光效”尚需第二阶段的 iOS Metal / Android OpenGL 或 Vulkan 原生渲染器。完成后必须让同一张 GPU 输出纹理同时进入屏幕预览和视频编码器，成片才会与预览一致。

手机系统不允许第三方应用在后台修改系统相机的画面。因此正确产品形态是：用户在“霓格相机”内完成拍摄，然后保存或分享成片；切到系统相机时，本应用不能继续给系统相机叠滤镜。应用退到后台时，本原型会主动停止当前录像，避免文件损坏。

## 本机运行

需要 Node.js 22.11+；Android 需要 Android Studio / SDK；iOS 需要 macOS、Xcode 与 CocoaPods。

```bash
npm install
npm start
```

另开终端运行：

```bash
npm run android
# 或（macOS）
cd ios && bundle exec pod install && cd ..
npm run ios
```

首次打开会请求相机与麦克风权限。录像当前写入 VisionCamera 返回的应用临时文件路径；产品化时需要补充“保存到相册 / 分享”流程。

## 代码结构

- `App.tsx`：相机、权限、横竖画幅、录像与主界面。
- `src/filter/preset.ts`：已确认的风格参数与安全范围。
- `src/filter/engineContract.ts`：原生实时风格引擎协议。
- `src/state/cameraModel.ts`：可测试的相机 / 录像状态机。
- `src/components/`：权限页、风格控制与预览指引层。
- `docs/native-filter-roadmap.md`：把真正滤镜写入成片的实现路线。
- `docs/beta-installation.md`：Android 云端 APK 与 iPhone TestFlight 说明。

## Android 云端测试包

工程已经包含 GitHub Actions 构建流程。推送到 `main` 分支后将自动检查代码并生成 Android 测试 APK，详细步骤见 `docs/beta-installation.md`。iPhone TestFlight 需要 Apple Developer Program 会员与 Apple 签名，本工程不会收集或保存任何 Apple 账号凭证。

## 检查

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```

参考：[React Native](https://reactnative.dev/) · [VisionCamera](https://visioncamera.margelo.com/docs) · [MediaPipe Face Landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)
