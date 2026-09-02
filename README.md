# 墨境 · 网文创作工作台

「墨境」是一个面向中文网文作者的本地创作工作台，围绕作品、章节、正文、大纲和写作目标构建创作流程。

项目同时提供：

- **可直接在浏览器打开的网站版**：无需手机或模拟器即可查看和操作。
- **React Native 移动端界面**：可继续构建 Android / iOS 应用。

## 立即查看网站版

网站版没有第三方依赖。使用 Python 3 启动本地服务器：

```bash
npm run web
```

然后访问 [http://localhost:4173](http://localhost:4173)。网站版不依赖后端，打开后即可：

- 创建、切换和删除作品与章节；
- 在正文和大纲之间切换，编辑作品总纲与章节提要；
- 实时查看章节字数、目标进度和完成状态；
- 自动保存到当前浏览器，刷新或重新打开后恢复；
- 将整部作品导出为 Markdown，或用 JSON 备份和导入项目；
- 使用 `Ctrl/Command + S` 保存，`Ctrl/Command + 1/2` 切换正文与大纲。

也可以直接双击 `web/index.html` 使用。网站版不依赖后端；内容只保存在当前浏览器，换设备前请先备份项目。

## 移动端运行

Android 需要 Android Studio / SDK；iOS 需要 macOS、Xcode 与 CocoaPods。

```bash
npm start
npm run android
# 或在 macOS 上
cd ios && bundle exec pod install && cd ..
npm run ios
```

## 代码结构

- `web/index.html`：网站版工作台语义结构与编辑界面。
- `web/styles.css`：桌面、平板和手机浏览器响应式视觉系统。
- `web/app.js`：作品与章节管理、正文和大纲编辑、本地自动保存及导入导出。
- `App.tsx`：React Native 移动端创作首页。
- `src/`：早期原型保留的状态与组件模块。

## 检查

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
node --check web/app.js
```
