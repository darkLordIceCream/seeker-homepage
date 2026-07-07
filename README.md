# Seeker Light Chasers - Photography Group Website

![License](https://img.shields.io/badge/license-MIT-blue)
![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

> Take a photo, make a friend

A modern photography group website built with Astro, featuring TypeScript +
Tailwind CSS + React tech stack.

English | [简体中文](./README-zh.md)

## ✨ Features

- 🚀 **Astro 7.x** - Modern static site generator
- ⚛️ **React 19** - UI component library
- 🎨 **Tailwind CSS 4.x** - Atomic CSS framework
- 🧩 **shadcn/ui** - Re-usable component library
- 📝 **TypeScript 6** - Type-safe JavaScript
- 🛠️ **Complete dev toolchain** - ESLint + Prettier + Husky
- 📦 **Commitizen** - Standardized Git commit messages
- 🎯 **Responsive design** - Mobile-friendly
- 🤖 **Agent Harness** - AI-assisted development workflow

## 🚀 Quick Start

### Requirements

- Node.js 22.12.0+ (recommended using nvm)
- pnpm 9.0+

### Installation

```bash
# Clone the project
git clone https://github.com/darkLordIceCream/seeker-homepage.git
cd seeker-homepage

# Use specified Node.js version
nvm use

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 📋 Available Commands

| Command           | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `pnpm dev`        | Start development server                                |
| `pnpm build`      | Build for production                                    |
| `pnpm preview`    | Preview build                                           |
| `pnpm lint`       | Lint code                                               |
| `pnpm lint:fix`   | Auto-fix code issues                                    |
| `pnpm format`     | Format code                                             |
| `pnpm type-check` | TypeScript type checking                                |
| `pnpm commit`     | Interactive commit (recommended)                        |
| `./init.sh`       | Full verification (install + type-check + lint + build) |

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
| ⚡️    | `perf`     | Performance      |
| ✅    | `test`     | Tests            |
| 📦️    | `build`    | Build system     |
| 👷    | `ci`       | CI configuration |
| 🔧    | `chore`    | Maintenance      |

## 🛠️ Development Toolchain

### Code Quality

- **ESLint 10.x** - Static code analysis for JavaScript/TypeScript/Astro
- **Prettier** - Code formatting with Astro plugin
- **TypeScript 6** - Strict type checking with path mapping

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
│   ├── components/        # Astro & React components
│   │   └── ui/            # shadcn/ui components
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page files
│   ├── styles/            # Style files
│   │   └── global.css     # Global styles + shadcn theme
│   └── lib/               # Utility functions
├── .agents/               # Agent skills (Matt Pocock)
├── .husky/                # Git hooks
├── .vscode/               # VS Code configuration
├── AGENTS.md              # Agent working manual
├── feature_list.json      # Feature state tracker
├── progress.md            # Session continuity log
├── init.sh                # Verification script
├── eslint.config.js       # ESLint configuration
├── commitlint.config.js   # Commitlint configuration
├── components.json        # shadcn/ui configuration
├── tsconfig.json          # TypeScript configuration
└── astro.config.mjs       # Astro configuration
```

## 🎨 Style System

### Tailwind CSS

Using Tailwind CSS 4.x as the main styling framework with:

- Responsive design breakpoints
- Custom color system
- Unified spacing and typography

### shadcn/ui

Using shadcn/ui (New York style, Zinc base) for:

- Pre-built accessible components
- CSS variables for theming
- Dark/light mode support

### Design System

```css
/* Color system (CSS variables) */
--primary: oklch(0.21 0.006 285.885);
--accent: oklch(0.967 0.001 286.375);

/* Custom colors */
#4ecdc4 (teal) + #ff6b6b (coral) gradient
```

## 🤖 Agent Harness

This project includes a harness for reliable AI-assisted development:

- **AGENTS.md** - Agent working manual with startup workflow
- **feature_list.json** - Feature state tracker
- **progress.md** - Session continuity log
- **init.sh** - Verification script

Run `./init.sh` before starting any agent session to verify environment health.

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
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [TypeScript](https://www.typescriptlang.org/) - JavaScript superset

---

**Seeker Light Chasers Photography Group** - Capturing beauty through lens,
sharing joy through technology
