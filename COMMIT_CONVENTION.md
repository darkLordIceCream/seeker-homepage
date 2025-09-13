# Git 提交规范

本项目使用 Conventional Commits 规范来标准化 Git 提交信息。

## 📝 提交信息格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type 类型

- **feat**: 新增功能
- **fix**: 修复缺陷
- **docs**: 文档变更
- **style**: 代码格式（不影响功能，例如空格、分号等格式修正）
- **refactor**: 代码重构（不包括 bug 修复、功能新增）
- **perf**: 性能优化
- **test**: 添加疏漏测试或已有测试改动
- **build**: 构建流程、外部依赖变更（如升级 npm 包、修改配置等）
- **ci**: 修改 CI 配置、脚本
- **chore**: 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
- **revert**: 回滚 commit

### 示例

```bash
feat: 添加用户登录功能
fix(auth): 修复登录验证错误
docs: 更新 README 文档
style: 修正代码缩进格式
refactor: 重构用户管理模块
```

## 🛠️ 使用方法

### 方法一：使用 Commitizen（推荐）

```bash
# 使用交互式提交
pnpm run commit
# 或
npx git-cz
```

这将启动一个交互式界面，引导你填写规范的提交信息。

### 方法二：手动编写

```bash
git add .
git commit -m "feat: 添加新功能"
```

⚠️
**注意**: 手动编写的提交信息会通过 commitlint 进行格式检查，不符合规范的提交会被拒绝。

## 🔧 配置文件

- **commitlint.config.js**: commitlint 配置文件
- **.czrc**: commitizen 配置文件
- **.husky/commit-msg**: Git commit-msg 钩子，自动运行 commitlint 检查

## 🚀 Git Hooks

项目配置了以下 Git 钩子：

- **pre-commit**: 运行 lint-staged 检查和格式化代码
- **commit-msg**: 运行 commitlint 检查提交信息格式
- **pre-push**: 运行构建、类型检查和代码检查

## 📚 相关链接

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Commitizen](https://github.com/commitizen/cz-cli)
