# @craft/ui

跨平台 React UI 组件库。

`React` `TypeScript` `Tailwind v4` `Radix UI` `oklch`

[English](./README.md) | 中文

---

## 概述

`@craft/ui` 是从 Craft Agents 中提取的独立、可复用 UI 层。它提供了一整套用于构建开发者工具界面的组件——从语法高亮代码查看器、差异渲染器，到完整的对话轮次渲染和终端输出展示。

- 通过平台无关的 Context Provider 同时支持 Electron 和 Web 环境
- 基于 oklch 色彩系统，自动支持亮色/暗色主题切换
- 85+ 源文件，11 个子路径导出
- 不依赖 `@craft-agent/core`——所有类型定义完全自包含

## 安装

```bash
npm install @craft/ui
```

需要安装对等依赖。完整列表见[对等依赖](#对等依赖)。

## 模块索引

| 导入路径 | 模块 | 提供内容 |
|---|---|---|
| `@craft/ui` | 根模块 | 基础组件：Tooltip、Spinner、CopyButton、下拉菜单、PreviewHeader、图标 |
| `@craft/ui/ui` | 基础 UI | Shadcn-compatible + Craft 风格控件：Button/Input/Select/Dialog/Table/Calendar/Checkbox/RadioGroup/Slider/Progress/Card/Alert/Tooltip/Skeleton |
| `@craft/ui/styles` | 样式 | oklch 6 色设计系统、13 级前景色梯度、阴影、动画 |
| `@craft/ui/types` | 类型 | Message、Session、Activity 及相关 TypeScript 类型定义 |
| `@craft/ui/context` | 上下文 | PlatformProvider（Electron/Web 环境检测）、ShikiThemeProvider |
| `@craft/ui/lib` | 工具函数 | 布局常量、语言映射、表格导出、链接识别、文件分类、工具解析器、附件辅助函数 |
| `@craft/ui/code-viewer` | 代码查看器 | ShikiCodeViewer、ShikiDiffViewer（并排对比）、UnifiedDiffViewer、DiffViewerControls、主题注册 |
| `@craft/ui/markdown` | Markdown | Markdown/MemoizedMarkdown 渲染器、CodeBlock、CollapsibleSection、Diff/JSON/Mermaid/DataTable/Spreadsheet 块渲染器 |
| `@craft/ui/overlay` | 全屏预览 | 全屏预览系统——代码、终端、JSON、PDF、图片、Mermaid、多文件差异、数据表、文档预览 |
| `@craft/ui/terminal` | 终端 | ANSI 转义码解析器（parseAnsi、stripAnsi）、TerminalOutput 彩色渲染与 grep 高亮 |
| `@craft/ui/cards` | 卡片 | ActionCard，带主题色头部、可滚动内容区和操作栏 |
| `@craft/ui/chat` | 对话 | TurnCard、SessionViewer、UserMessageBubble、SystemMessage、InlineExecution、AcceptPlanDropdown |

## 快速开始

在应用根组件中引入设计系统 CSS：

```tsx
import '@craft/ui/styles'
```

### Markdown 渲染

```tsx
import { Markdown } from '@craft/ui/markdown'

<Markdown content="# Hello World" />
```

### 语法高亮代码查看器

```tsx
import { ShikiCodeViewer } from '@craft/ui/code-viewer'

<ShikiCodeViewer code={code} language="typescript" />
```

### 对话轮次渲染

```tsx
import { TurnCard } from '@craft/ui/chat'

<TurnCard turn={turn} />
```

### 终端输出

```tsx
import { TerminalOutput } from '@craft/ui/terminal'

<TerminalOutput command="npm test" output={ansiOutput} />
```

## 设计系统

样式系统定义在 `@craft/ui/styles` 中，全局使用 CSS 自定义属性。

- **oklch 色彩系统** — 6 个基础色（background、foreground、primary、secondary、muted、accent）在 oklch 色彩空间中定义，实现感知均匀的主题配色
- **13 级前景色梯度** — 从 `fg-0`（不可见）到 `fg-12`（完全对比度）的精细文本透明度层级
- **亮色/暗色主题** — 通过 CSS 自定义属性自动切换，无 JavaScript 运行时开销
- **阴影系统** — 基于层级的阴影 token
- **动画** — 共享关键帧和过渡 token
- **Tailwind v4** — 所有 token 均可作为 Tailwind 工具类使用

## 对等依赖

### 必需

| 包名 | 版本 |
|---|---|
| `react` | >= 18.0.0 |
| `react-dom` | >= 18.0.0 |
| `tailwindcss` | >= 4.0.0 |
| `shiki` | ^3.21.0 |
| `react-markdown` | >= 9.0.0 |
| `remark-gfm` | >= 4.0.0 |
| `rehype-raw` | >= 7.0.0 |
| `lucide-react` | >= 0.400.0 |
| `clsx` | >= 2.0.0 |
| `tailwind-merge` | >= 2.0.0 |
| `class-variance-authority` | >= 0.7.0 |
| `motion` | >= 11.0.0 |
| `@radix-ui/react-tooltip` | >= 1.0.0 |
| `@tailwindcss/typography` | >= 0.5.0 |

### 可选

| 包名 | 版本 | 用途 |
|---|---|---|
| `@radix-ui/react-dialog` | >= 1.0.0 | 全屏预览系统 |
| `@radix-ui/react-dropdown-menu` | >= 2.0.0 | 样式化下拉菜单 |
| `@radix-ui/react-context-menu` | >= 2.0.0 | 右键菜单 |
| `@craft-agent/mermaid` | >= 0.1.0 | Mermaid 图表渲染 |
| `react-pdf` | >= 7.0.0 | PDF 预览 |
| `@pierre/diffs` | >= 0.1.0 | 差异对比查看 |

## 项目结构

```
src/
├── types/            # TypeScript 类型定义（Message、Session、Activity）
├── utils/            # cn()、路径规范化辅助函数
├── styles/           # oklch 设计系统 CSS
├── context/          # PlatformProvider、ShikiThemeProvider
├── lib/              # 纯工具函数
├── hooks/            # React Hooks（useScrollFade）
└── components/
    ├── primitives/   # 原子组件：Tooltip、Spinner、CopyButton、下拉菜单、图标
    ├── code-viewer/  # Shiki 代码 + 差异查看器
    ├── markdown/     # Markdown 渲染器 + 块渲染器
    ├── overlay/      # 全屏预览浮层
    ├── terminal/     # ANSI 解析器 + 终端输出
    ├── cards/        # ActionCard
    └── chat/         # 对话轮次渲染系统
```

## 许可证

Apache-2.0
