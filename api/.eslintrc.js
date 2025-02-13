module.exports = {
  extends: ['../.eslintrc.js', 'plugin:vitest-globals/recommended'],
  env: {
    'vitest-globals/env': true,
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { accessibility: 'explicit', overrides: { constructors: 'no-public', properties: 'no-public' } },
    ],
  },
}
