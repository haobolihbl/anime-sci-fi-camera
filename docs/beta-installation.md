# 测试版生成与安装

## Android APK

工程包含 `.github/workflows/android-apk.yml`。代码推送到 GitHub 的 `main` 分支后，会自动执行测试、类型检查和 Android 构建；也可以在仓库的 **Actions → Build Android test APK → Run workflow** 手动触发。

构建成功后：

1. 打开对应的 Actions 运行记录。
2. 在页面底部下载 `AnimeSciFiCamera-Android-v0.2.0` 构建产物。
3. 解压后得到 `app-debug.apk`。
4. 把 APK 发送到 Android 手机并打开安装；系统提示时，仅为本次安装来源开启“允许安装未知应用”。

该 APK 是内部测试签名版本，只用于本人测试，不适合直接提交应用商店。正式发布要创建独立 release keystore，且不得把密钥或密码提交到仓库。

## iPhone / iPad

iOS 真机应用必须经过 Apple 签名。当前用户尚未加入 Apple Developer Program，因此本阶段保留完整 iOS 工程，但暂不生成 TestFlight 包。

加入 Apple Developer Program 后的流程：

1. 在 Mac 的 Xcode 中打开 `ios/AnimeSciFiCamera.xcworkspace`。
2. 选择自己的开发团队，确认唯一 Bundle Identifier。
3. 用真机检查相机、麦克风、横竖画幅和温控表现。
4. Archive 后上传到 App Store Connect。
5. 在 TestFlight 中添加内部测试人员。

Apple ID 密码、验证码、证书私钥和签名密码均不应发送到聊天或写入源码。

## 当前版本验收范围

- 可以安装和打开相机原型。
- 可以请求相机 / 麦克风权限、切换前后摄像头与目标画幅。
- 可以录制基础 MP4，并在退到后台时安全停录。
- 风格参数和 GPU 接口已经存在。
- 真正写入成片的动漫角色化与科幻数字光效仍属于下一开发阶段，当前 APK 不代表最终滤镜质量。
