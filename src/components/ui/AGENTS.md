# ui/
> L2 | 父级: /Users/henry/PARA/[01] Projects/Vibe/Craft/src/components/AGENTS.md

成员清单
index.ts: Shadcn 基础组件 barrel 导出。
alert.tsx: Alert 状态提示（default/destructive）。
button.tsx: Button 与 buttonVariants。
input.tsx: Input 单行输入框。
textarea.tsx: Textarea 多行输入框。
badge.tsx: Badge 状态标签。
avatar.tsx: Avatar 头像与 CrossfadeAvatar。
card.tsx: Card 容器与头/体/底结构基元。
checkbox.tsx: Checkbox 勾选框。
label.tsx: Label 表单标签。
dialog.tsx: Dialog 模态框。
popover.tsx: Popover 浮层。
dropdown-menu.tsx: Dropdown Menu 菜单。
context-menu.tsx: Context Menu 右键菜单。
progress.tsx: Progress 进度条。
radio-group.tsx: RadioGroup 单选组。
select.tsx: Select 选择器。
slider.tsx: Slider 连续滑块。
switch.tsx: Switch 开关。
tabs.tsx: Tabs 选项卡。
table.tsx: Table 表格包装。
separator.tsx: Separator 分割线。
skeleton.tsx: Skeleton 骨架屏占位。
scroll-area.tsx: ScrollArea 滚动容器。
tooltip.tsx: Tooltip 提示浮层。
section-header.tsx: 通用区块头（title/description/action）布局基元。
collapsible.tsx: Collapsible 折叠区与动画内容。
command.tsx: Command / CommandDialog 命令面板。
calendar.tsx: Calendar 日期选择器（react-day-picker）。
drawer.tsx: Drawer 抽屉。
resizable.tsx: Resizable 面板分割。
kbd.tsx: Kbd 键帽展示。
empty.tsx: Empty 空状态组件组。
tone-badge.tsx: 语义色徽标基元（success/warning/destructive/muted）。
styled-dropdown.tsx: Craft 风格 dropdown 预设组件（StyledDropdownMenu*）。
styled-context-menu.tsx: Craft 风格 context-menu 预设组件（StyledContextMenu*）。
data-table.tsx: TanStack Table 封装（排序/过滤/分页/列宽）。
rule-table.tsx: Craft 规则数据表（Access/Type/Pattern/Comment 列渲染）。
rule-set-card.tsx: Craft 规则卡片容器（复用 SectionHeader + RuleTable）。

开发规范
基础交互统一使用 Shadcn primitives（button/input/select/table 等）。
业务外观统一沉淀到 Craft recipes（例如 SectionHeader、RuleSetCard、ToneBadge）。
禁止在页面层直接拼接一套新的按钮/标题视觉，优先复用 ui/ 内现有抽象。
所有 ui/index.ts 的基础组件导出，必须在 preview UISection 里有可运行示例。

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
