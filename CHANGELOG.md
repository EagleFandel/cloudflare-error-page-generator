# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-12

### Added

- 新增 `CHANGELOG.md`，记录版本变更历史。
- 新增 `LICENSE`（MIT）文件，与 `package.json` 保持一致。
- 新增基础 CI 工作流 `.github/workflows/ci.yml`，在 push/PR 上执行 `npm ci` + `npm test`。
- 新增配置稳定性和边界测试：
  - `getConfig()` 重复读取稳定性验证。
  - `updateConfig({ rayId: '' })` 自动回填并持久化验证。
  - 非法错误码回退验证。
  - 非法时间戳兜底格式验证。

### Changed

- 重写 `README.md` 为更完整的中文主文档，补齐功能矩阵、字段说明、FAQ、安全说明与发布流程。
- 版本号从 `1.0.0` 升级到 `1.0.1`。

### Fixed

- 修复 `configManager` 在 `getConfig()` 读取时动态生成默认值导致的状态漂移问题。
- 统一配置规范化流程（初始化、更新、重置时写入稳定默认值）。
- 修复非法时间戳导致 `NaN:NaN:NaN UTC` 的显示问题。
- 清理未使用导入和调试输出，提高代码整洁度。
- 更新页面页脚 GitHub 链接为项目仓库地址。

## [1.0.0] - 2025-12-10

### Added

- 初始版本发布。
- 支持 Cloudflare 常见 5xx 错误码生成（`500`、`502`、`503`、`504`、`520`~`527`）。
- 提供 Cloudflare 风格错误页 HTML 生成与实时预览。
- 支持自定义域名、Ray ID、节点位置与自定义消息。
- 支持复制完整 HTML 到剪贴板与导出独立 HTML 文件。
- 引入 Vitest 与属性测试，覆盖核心生成逻辑。
