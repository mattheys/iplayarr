import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{ts,vue}', 'frontend/src/**/*.{js}'] },
    { languageOptions: { globals: {...globals.node, ...globals.browser} } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    { ignores: ['**/dist/**', '**/node_modules/**'] },

    // Enable sorting and enforce single quotes
    {
        plugins: {
            import: importPlugin,
            'simple-import-sort': simpleImportSort
        },
        rules: {
            'indent' : [ 'error', 4 ],
            '@typescript-eslint/no-explicit-any': 'off',
            'no-useless-catch': 'off',
            'no-async-promise-executor': 'off',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'quotes': ['error', 'single'],
        }
    }
];
