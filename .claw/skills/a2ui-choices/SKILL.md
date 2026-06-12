---
name: a2ui-choices
description: 【强制】用户需要选择时必须调用 mcp__a2ui__present_choices 工具渲染UI，禁止纯文本列选项，禁止假装已渲染
---

# A2UI 选择交互 Skill

## 强制规则（无例外）

1. **必须调用** `mcp__a2ui__present_choices` 工具来渲染交互式选择 UI
2. **绝对禁止**用纯文本列出编号选项
3. **绝对禁止**假装 UI 已经渲染（如"已经为你渲染了选择界面"）
4. 如果工具调用失败，告知用户具体失败原因

## 触发条件

以下情况**必须**调用工具：
- 用户说"选择界面"、"让我选"、"给我选项"、"selection interface"、"prompt me"、"next step" 等
- 用户需要表达偏好 → `mode="multiple"`
- 用户需要选择下一步 → `mode="single"`
- 任何需要用户从多个选项中选择的场景

## 工具调用

工具名：`mcp__a2ui__present_choices`

参数：
- `question`: string — 简洁的问题文本
- `options`: array — 选项数组，每个 `{ "id": "唯一ID", "label": "显示文本", "description": "可选描述" }`
- `mode`: "single" 或 "multiple"
- `description`: string（可选）— 问题下方的补充说明
- `submitLabel`: string（可选）— 提交按钮文字

## 事件处理

用户提交选择后，你会收到 `[A2UI Event] business_choices_confirmed: {...}`。读取 `selectedIds` 和 `selectedOptions` 继续下一步。
