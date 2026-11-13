import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // Global ignores - these files/folders will be ignored for all rules
  {
    ignores: [
      '.astro/**',
      // 自动生成（scripts/welfare-gallery/import.py）：引号风格与生成器绑定
      'src/data/welfare-gallery.ts',
      '.husky/**',
      '.agents/**',
      'dist/**',
      'node_modules/**',
      '*.min.js',
      '*.min.css',
      'coverage/**',
      'build/**',
      'public/**/*.js',
      '.env*',
      '*.log',
    ],
  },

  // Base configuration for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        es2022: true,
        node: true,
      },
    },
    rules: {
      // Code Quality Rules
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-alert': 'warn',

      // Best Practices
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',

      // Style Rules (basic ones that work across ESLint versions)
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'space-before-blocks': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',

      // ES6+ Rules
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-duplicate-imports': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: false },
        },
      ],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
    },
  },

  // TypeScript specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // Disable base rules that conflict with TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-use-before-define': 'off',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
    },
  },

  // Astro configuration
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      // Astro specific rules - Security
      'astro/no-set-html-directive': 'error',
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/no-deprecated-astro-canonicalurl': 'error',
      'astro/no-deprecated-astro-fetchcontent': 'error',
      'astro/no-deprecated-astro-resolve': 'error',
      'astro/no-deprecated-getentrybyslug': 'error',
      'astro/valid-compile': 'error',
      'astro/missing-client-only-directive-value': 'error',

      // Astro style rules
      'astro/prefer-class-list-directive': 'warn',
      'astro/prefer-split-class-list': 'warn',
      'astro/prefer-object-class-list': 'warn',
      'astro/sort-attributes': [
        'warn',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
        },
      ],

      // Disable conflicting rules for Astro files
      'no-undef': 'off', // Astro global variables
      'no-unused-vars': 'off', // Astro props might appear unused
    },
  },

  // Configuration files
  {
    files: ['*.config.{js,mjs,ts}', '.eslintrc.{js,cjs}'],
    languageOptions: {
      globals: {
        process: true,
        __dirname: true,
        __filename: true,
        module: true,
        require: true,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Test files (if you add tests later)
  {
    files: ['**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        vi: true,
        vitest: true,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 《时间的故事》画廊模板：set:html 仅用于输出构建期常量（JSON-LD 结构化数据，非用户输入）
  {
    files: ['src/components/activities/GalleryStory.astro'],
    rules: {
      'astro/no-set-html-directive': 'off',
    },
  },
  // 七周年地图墙：set:html 仅用于输出构建期常量（标记数据 JSON 岛，非用户输入）
  {
    files: ['src/components/anniversary/MapGlobe.astro'],
    rules: {
      'astro/no-set-html-directive': 'off',
    },
  },
  // 追光之旅年度页与历届门户：set:html 仅用于输出构建期常量（JSON-LD 结构化数据，非用户输入）
  {
    files: [
      'src/components/light-chasing/LightChasingYear.astro',
      'src/pages/activities/chasing-light.astro',
    ],
    rules: {
      'astro/no-set-html-directive': 'off',
    },
  },
];
