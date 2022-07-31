module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'off',
      camelcase: 'off',
    }],
  },
};
