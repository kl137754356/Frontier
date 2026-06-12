Frontier Skills
===============

此目录存放预设的 Skills（技能）。
首次启动 Frontier 时，这些 skills 会被复制到用户工作区。

目录结构：
  skills/
  ├── skill-name/
  │   ├── SKILL.md          ← 技能定义文件（必需）
  │   └── references/       ← 参考文件目录（可选）
  │       ├── api-docs.md
  │       └── examples.md
  └── another-skill/
      └── SKILL.md

如何添加新 Skill：
1. 在此目录下创建新文件夹（文件夹名即为 skill 名称）
2. 在文件夹内创建 SKILL.md 文件
3. 重启 Frontier（或删除用户工作区中的对应 skill 以触发重新复制）

如何替换 Skill：
1. 直接修改用户工作区中的 skill 文件：
   %APPDATA%/frontier-desktop/.claw/skills/
2. 或者修改此目录的文件后删除用户工作区副本，重启时会重新复制

SKILL.md 格式示例：
---
name: my-skill
description: 这个 skill 做什么
---

# 技能说明

当用户问到相关问题时，按以下步骤操作...
