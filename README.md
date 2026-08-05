# 墨境 · 网文创作工作台

「墨境」是一个面向中文网文作者的创作工作台原型，围绕灵感、故事大纲、人物设定、世界观、作品管理和写作目标构建创作流程。

项目同时提供：

- **可直接在浏览器打开的网站版**：无需手机或模拟器即可查看和操作。
- **React Native 移动端界面**：可继续构建 Android / iOS 应用。

## 立即查看网站版

需要 Node.js 22.11+ 和 Python 3。安装依赖后运行：

```bash
npm install
npm run web
```

然后访问 [http://localhost:4173](http://localhost:4173)。网站版不依赖后端，打开后即可：

- 选择侧边栏页面和正在创作的作品；
- 使用灵感构思、大纲、人物与世界观工具入口；
- 点击续写、查看大纲、新建作品等操作；
- 点击“创作助手”或按 `Ctrl/Command + K` 打开命令面板；
- 输入自己的创作需求，或使用数字键 `1`–`4` 选择推荐命令。

也可以直接双击 `web/index.html` 查看；通过本地服务器访问可以获得更一致的字体和资源加载效果。

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

- `web/index.html`：网站版工作台语义结构与命令选择界面。
- `web/styles.css`：桌面、平板和手机浏览器响应式视觉系统。
- `web/app.js`：项目选择、导航、快捷命令和操作反馈。
- `App.tsx`：React Native 移动端创作首页。
- `src/`：早期原型保留的状态与组件模块。

## 检查

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
node --check web/app.js
```
