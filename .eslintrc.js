module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    jest: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    camelcase: 'off',
    'import/extensions': ['error', 'ignorePackages', {
      js: 'off',
    }],
  },
};
