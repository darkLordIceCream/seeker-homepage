# 开发环境配置

本项目已配置完整的现代开发工具链，包括代码质量检查、格式化、Git
hooks 和 TypeScript 支持。

## 🛠️ 已配置的工具

### ESLint

- **配置文件**: `eslint.config.js`
- **支持**: JavaScript, TypeScript, Astro 文件
- **规则**:
  - 基础代码质量规则
  - TypeScript 特定规则
  - Astro 组件规则
- **运行命令**:
  ```bash
  pnpm run lint        # 检查代码
  pnpm run lint:fix    # 自动修复问题
  ```

### Prettier

- **配置文件**: `.prettierrc.mjs`
- **忽略文件**: `.prettierignore`
- **插件**: `prettier-plugin-astro`
- **特性**:
  - 统一的代码格式化
  - 对 Astro 文件的特殊支持
  - 针对不同文件类型的自定义配置
- **运行命令**:
  ```bash
  pnpm run format       # 格式化所有文件
  pnpm run format:check # 检查格式是否正确
  ```

### TypeScript

- **配置文件**: `tsconfig.json`
- **特性**:
  - 严格类型检查
  - 路径映射支持 (`@/*` -> `./src/*`)
  - 现代 ES 模块支持
  - Astro 特定配置
- **运行命令**:
  ```bash
  pnpm run astro:check  # Astro 类型检查
  pnpm run type-check   # 完整类型检查
  ```

### Husky + lint-staged

- **配置文件**:
  - `.husky/pre-commit` - Git pre-commit hook
  - `.lintstagedrc.json` - lint-staged 配置
- **功能**:
  - 提交前自动检查和格式化代码
  - 只对暂存的文件运行检查
  - 类型检查确保代码质量
- **自动执行**: 每次 `git commit` 时自动运行

### VS Code 集成

- **配置文件**:
  - `.vscode/settings.json` - 编辑器设置
  - `.vscode/extensions.json` - 推荐扩展
- **功能**:
  - 保存时自动格式化
  - ESLint 实时检查
  - Astro 文件支持
- **推荐扩展**:
  - Astro
  - Prettier
  - ESLint
  - Tailwind CSS
  - TypeScript

## 📁 新增/修改的文件

```
seeker-homepage/
├── .husky/
│   └── pre-commit              # Git pre-commit hook
├── .vscode/
│   ├── settings.json           # VS Code 工作区设置
│   └── extensions.json         # 推荐扩展列表
├── .lintstagedrc.json          # lint-staged 配置
├── .prettierrc.mjs             # Prettier 配置
├── .prettierignore             # Prettier 忽略文件
├── eslint.config.js            # ESLint 配置 (新格式)
├── tsconfig.json               # 增强的 TypeScript 配置
├── package.json                # 新增脚本命令
└── .gitignore                  # 更新忽略规则
```

## 🚀 开发工作流

1. **开发时**:
   - VS Code 会实时显示 ESLint 错误
   - 保存文件时自动格式化

2. **提交代码时**:

   ```bash
   git add .
   git commit -m "your message"
   # 自动运行：
   # - lint-staged (ESLint + Prettier)
   # - astro check (类型检查)
   ```

3. **手动运行检查**:
   ```bash
   pnpm run lint           # ESLint 检查
   pnpm run format         # Prettier 格式化
   pnpm run astro:check    # 类型检查
   ```

## ⚙️ 配置特性

### ESLint 规则亮点

- 🚫 禁止使用 `var`，强制使用 `const`/`let`
- ⚠️ 未使用变量警告
- 🔒 Astro 特定安全规则（防止 XSS）
- 📝 属性排序建议

### Prettier 配置亮点

- 🎯 100 字符行宽
- 🔸 2 空格缩进
- 💫 单引号优先
- 🎨 Astro 文件专用解析器

### TypeScript 配置亮点

- 🔥 严格模式启用
- 🎯 路径映射 (`@/components/*`)
- 🚀 现代模块解析
- 🛡️ 全面的类型检查

## 🎯 最佳实践

1. **提交前**: 确保所有检查通过
2. **代码风格**: 遵循 Prettier 配置
3. **类型安全**: 利用 TypeScript 严格检查
4. **Astro 组件**: 使用推荐的属性和指令规范

这套配置确保了代码质量、一致性和类型安全，为 Astro 项目提供了现代化的开发体验。
