import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

const localStylisticRules = {
  rules: {
    'compact-named-imports': {
      meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        messages: {
          compactNamedImports: 'Named imports should stay on one line.',
        },
      },
      create(context) {
        const sourceCode = context.sourceCode;

        function hasCommentsBetween(openBrace, closeBrace) {
          return sourceCode
            .getTokensBetween(
              openBrace,
              closeBrace,
              { includeComments: true },
            )
            .some((token) =>
              token.type === 'Block'
              || token.type === 'Line',
            );
        }

        return {
          ImportDeclaration(node) {
            const namedSpecifiers =
              node.specifiers.filter((specifier) =>
                specifier.type === 'ImportSpecifier',
              );

            if (!namedSpecifiers.length) {
              return;
            }

            const openBrace =
              sourceCode.getFirstToken(
                node,
                (token) => token.value === '{',
              );

            const closeBrace =
              sourceCode.getTokenAfter(
                namedSpecifiers[namedSpecifiers.length - 1],
                (token) => token.value === '}',
              );

            if (
              !openBrace
              || !closeBrace
              || !sourceCode.text
                .slice(openBrace.range[1], closeBrace.range[0])
                .includes('\n')
              || hasCommentsBetween(openBrace, closeBrace)
            ) {
              return;
            }

            context.report({
              node,
              loc: openBrace.loc,
              messageId: 'compactNamedImports',
              fix(fixer) {
                const importsText =
                  namedSpecifiers
                    .map((specifier) => sourceCode.getText(specifier))
                    .join(', ');

                return fixer.replaceTextRange(
                  [
                    openBrace.range[0],
                    closeBrace.range[1],
                  ],
                  `{ ${importsText} }`,
                );
              },
            });
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/android/**', '**/ios/**'],
  },
  {
    files: ['**/*.{js,ts,vue}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginVue.configs['flat/essential'],
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
        },
      ],
      '@stylistic/key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
        },
      ],
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'import',
          next: '*',
        },
        {
          blankLine: 'never',
          prev: 'import',
          next: 'import',
        },
      ],
      'local-stylistic/compact-named-imports': 'error',
      '@stylistic/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/template-curly-spacing': ['error', 'never'],
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
    plugins: {
      '@stylistic': stylistic,
      'local-stylistic': localStylisticRules,
    },
  },
);
