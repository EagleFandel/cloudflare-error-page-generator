# 甩锅利器 - Cloudflare 错误页面生成器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

一个纯前端的 Cloudflare 5xx 错误页面生成工具。它可以基于配置生成可离线使用的单文件 HTML，适用于演示、故障兜底页、测试环境占位页等场景。

## 项目概览

- 项目名称：`cloudflare-error-page-generator`
- 技术栈：原生 HTML/CSS/JavaScript（ES Modules）
- 测试框架：`Vitest` + `fast-check`
- 运行方式：直接打开 `src/index.html` 或使用静态服务器
- 在线演示：<https://eaglefandel.github.io/cloudflare-error-page-generator/src/>

说明：在线演示方便快速体验，实际使用建议优先本地运行，避免网络环境导致的展示差异。

## 功能矩阵

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| 错误码选择 | 已支持 | `500`、`502`、`503`、`504`、`520`~`527` |
| 页面风格 | 已支持 | Cloudflare 风格布局与状态图 |
| 域名自定义 | 已支持 | 支持输入任意域名文本 |
| Ray ID | 已支持 | 可手动输入，也可自动生成 16 位十六进制 |
| 节点位置 | 已支持 | 支持选择常见 Cloudflare 节点城市 |
| 自定义消息 | 已支持 | 展示在 “What happened?” 区块 |
| 实时预览 | 已支持 | 表单变更会立即刷新右侧 iframe |
| 复制 HTML | 已支持 | 优先 Clipboard API，失败时回退 `execCommand` |
| 导出 HTML 文件 | 已支持 | 下载为独立、可离线打开的 HTML 文件 |
| XSS 基础防护 | 已支持 | 对用户输入进行 HTML 转义 |

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 本地运行（推荐）

方式 A：直接打开

```bash
# Windows
start src/index.html

# macOS
open src/index.html

# Linux
xdg-open src/index.html
```

方式 B：静态服务器

```bash
# Python
python -m http.server 8080 --directory src

# Node.js（无需全局安装）
npx serve src
```

启动后访问：`http://localhost:8080`

## 字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `errorCode` | string | 是 | `522` | Cloudflare 错误码；非法值会回退到 `522` |
| `domainName` | string | 否 | `example.com` | 右侧 Host 名称与标题域名 |
| `rayId` | string | 否 | 自动生成 | 16 位十六进制字符串；清空时自动回填 |
| `location` | string | 否 | `Frankfurt` | Cloudflare 节点显示名称 |
| `customMessage` | string | 否 | 空字符串 | 自定义附加错误说明 |
| `timestamp` | string | 否 | 自动生成 | 显示为 `HH:mm:ss UTC`；非法值自动兜底 |
| `visitorIp` | string | 否 | `Not available` | 当前版本仅用于配置层保留 |

## 使用流程

1. 选择错误码（例如 `502 Bad Gateway`）。
2. 输入域名（可选，不填会使用 `example.com`）。
3. 输入 Ray ID 或点击“生成”。
4. 选择 Cloudflare 节点位置。
5. 输入自定义消息（可选）。
6. 在预览区确认最终页面效果。
7. 点击“复制 HTML”或“导出文件”。

## 导出与复制说明

- `复制 HTML`：复制完整 HTML 文本到剪贴板，适合粘贴到后台模板或工单。
- `导出文件`：保存为 `cloudflare-error-{code}.html`，可直接离线打开。
- 导出文件特性：样式内联、无外部脚本依赖、可独立部署。

## 测试命令

```bash
# 单次执行测试
npm test

# 监听模式
npm run test:watch
```

## 常见问题

### Q1：为什么 Ray ID 会自动变化？

当 Ray ID 为空时，系统会自动生成合法的 16 位十六进制值并写回状态，避免预览、复制、导出之间不一致。

### Q2：页面为什么是英文内容？

生成目标是 Cloudflare 风格错误页，默认文案使用英文以贴近真实场景；工具 UI 为中文。

### Q3：能否直接部署到生产？

可以作为静态错误页模板使用，但建议先在预发布环境验证内容与品牌合规性。

## 已知限制

- 当前不包含后端服务或 API。
- `visitorIp` 尚未在页面模板中展示。
- 不自动同步 Cloudflare 官方设计更新（需手动维护）。

## 安全说明（XSS）

用户可输入字段（域名、自定义消息、Ray ID、位置）在插入模板前会经过 HTML 转义，避免将原始标签直接注入生成页面。

## 开发与发布流程

### 本地开发

```bash
npm install
npm test
```

### 发版检查清单（GitHub Release）

1. 确认测试通过：`npm ci && npm test`
2. 执行依赖审计：`npm audit --registry=https://registry.npmjs.org`
3. 更新版本号（示例：`1.0.1`）
4. 更新 `CHANGELOG.md`
5. 提交并创建标签：`git tag -a v1.0.1 -m "Release v1.0.1"`
6. 推送分支与标签：`git push origin main --follow-tags`
7. 在 GitHub 创建对应 Release 页面

## 贡献方式

1. Fork 仓库并新建分支。
2. 提交修改并补充测试。
3. 发起 Pull Request，说明改动动机与验证方式。

## 项目结构

```text
src/
├── index.html
├── styles.css
├── app.js
├── config/
│   ├── errorCodes.js
│   └── configManager.js
├── generators/
│   ├── html.js
│   └── rayId.js
└── utils/
    ├── clipboard.js
    └── download.js
```

## 许可证

本项目采用 MIT 协议，详见 `LICENSE`。
