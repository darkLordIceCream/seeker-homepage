# Seeker Light Chasers - Photography Group Website

> Take a photo, make a friend

A modern photography group website built with Astro, featuring TypeScript +
Tailwind CSS + Less tech stack.

English | [简体中文](./README-zh.md)

## ✨ Features

- 🚀 **Astro 5.x** - Modern static site generator
- 🎨 **Tailwind CSS 4.x** - Atomic CSS framework
- 💎 **Less** - CSS preprocessor with variables and mixins
- 📝 **TypeScript** - Type-safe JavaScript
- 🛠️ **Complete dev toolchain** - ESLint + Prettier + Husky
- 📦 **Commitizen** - Standardized Git commit messages
- 🎯 **Responsive design** - Mobile-friendly

## 🚀 Quick Start

### Requirements

- Node.js 22.17.1+ (recommended using nvm)
- pnpm 9.0+

### Installation

```bash
# Clone the project
git clone <repository-url>
cd seeker-homepage

# Use specified Node.js version
nvm use 22.17.1

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 📋 Available Commands

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `pnpm dev`        | Start development server         |
| `pnpm build`      | Build for production             |
| `pnpm preview`    | Preview build                    |
| `pnpm lint`       | Lint code                        |
| `pnpm lint:fix`   | Auto-fix code issues             |
| `pnpm format`     | Format code                      |
| `pnpm type-check` | TypeScript type checking         |
| `pnpm commit`     | Interactive commit (recommended) |

## 🎯 Git Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/)
with emoji prefixes:

```bash
# Use interactive commit (recommended)
pnpm commit

# Manual commit examples
git commit -m "✨ feat: add user login feature"
git commit -m "🐛 fix(auth): fix login validation error"
git commit -m "📝 docs: update README documentation"
```

### Commit Types

| Emoji | Type       | Description      |
| ----- | ---------- | ---------------- |
| ✨    | `feat`     | New feature      |
| 🐛    | `fix`      | Bug fix          |
| 📝    | `docs`     | Documentation    |
| 💄    | `style`    | Code style       |
| ♻️    | `refactor` | Code refactoring |
| ⚡️   | `perf`     | Performance      |
| ✅    | `test`     | Tests            |
| 📦️   | `build`    | Build system     |
| 👷    | `ci`       | CI configuration |
| 🔧    | `chore`    | Maintenance      |

## 🛠️ Development Toolchain

### Code Quality

- **ESLint 9.x** - Static code analysis for JavaScript/TypeScript/Astro
- **Prettier** - Code formatting with Astro plugin
- **TypeScript** - Strict type checking with path mapping

### Git Hooks

- **pre-commit** - Check and format staged files before commit
- **commit-msg** - Validate commit message format
- **pre-push** - Run full checks before push

### VS Code Integration

Complete VS Code configuration included:

- Auto-format and error checking
- Recommended extensions
- Unified editor settings

## 📁 Project Structure

```
seeker-homepage/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, videos, etc.
│   ├── components/        # Astro components
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page files
│   ├── styles/            # Style files
│   │   ├── global.less    # Global styles
│   │   └── variables.less # Design system variables
│   └── lib/               # Utility functions
├── .husky/                # Git hooks
├── .vscode/               # VS Code configuration
├── eslint.config.js       # ESLint configuration
├── commitlint.config.js   # Commitlint configuration
├── tsconfig.json          # TypeScript configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## 🎨 Style System

### Tailwind CSS

Using Tailwind CSS 4.x as the main styling framework with:

- Responsive design breakpoints
- Custom color system
- Unified spacing and typography

### Less Preprocessor

- **Global styles**: `src/styles/global.less`
- **Design variables**: `src/styles/variables.less`
- Support for nesting, variables, mixins, and more

### Design System

```less
// Color system
@color-primary: #000;
@color-accent: #007acc;

// Typography system
@font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;

// Spacing system (8px grid-based)
@spacing-4: 1rem; // 16px
@spacing-8: 2rem; // 32px
```

## 🚀 Deployment

### Build

```bash
pnpm build
```

Build output is in the `dist/` directory, ready to deploy to any static hosting
service.

### Supported Platforms

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `pnpm commit`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit a Pull Request

### Development Standards

- Follow ESLint rules
- Use Prettier for code formatting
- Write semantic commit messages
- Ensure type checking passes

## 📄 License

[MIT License](./LICENSE)

## 🙏 Acknowledgments

- [Astro](https://astro.build/) - Modern static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Atomic CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript superset

---

**Seeker Light Chasers Photography Group** - Capturing beauty through lens,
sharing joy through technology
