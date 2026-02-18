module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // React Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // React Hooks - Stricter Rules
    'react-hooks/exhaustive-deps': 'error', // Enforce dependency arrays
    'react-hooks/rules-of-hooks': 'error',

    // React Best Practices
    'react/prop-types': 'error', // Enforce PropTypes (you're already using them)
    'react/no-unused-prop-types': 'warn',
    'react/no-array-index-key': 'warn',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'off', // Not needed with new JSX transform
    'react/jsx-uses-vars': 'error',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'error',
    'react/no-unescaped-entities': 'warn',
    'react/require-render-return': 'error',

    // General Code Quality
    'no-console': 'warn', // Allow console but warn
    'no-debugger': 'error',
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'warn',
    'no-duplicate-imports': 'error',

    // JSDoc Enforcement
    'valid-jsdoc': ['warn', {
      requireReturn: false,
      requireReturnDescription: false,
      requireParamDescription: true,
      prefer: {
        arg: 'param',
        argument: 'param',
        class: 'constructor',
        return: 'returns',
        virtual: 'abstract'
      }
    }],
    'require-jsdoc': ['warn', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: false, // Too noisy for inline functions
        FunctionExpression: false
      }
    }],

    // Performance & Best Practices
    'no-nested-ternary': 'warn',
    'no-unneeded-ternary': 'error',
    'prefer-template': 'warn',
    'object-shorthand': 'warn',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',

    // Accessibility (if you want to add)
    // 'jsx-a11y/alt-text': 'warn',
    // 'jsx-a11y/anchor-has-content': 'warn',
  },
}
