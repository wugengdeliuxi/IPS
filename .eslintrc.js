module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    'plugin:prettier/recommended' // 添加 prettier 插件
  ],
  plugins: ['vue', 'html'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  rules: {
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'prefer-destructuring': 'off',
    eqeqeq: 'off',
    'consistent-return': 'off',
    'no-shadow': 'off',
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off',
    'vue/no-multiple-template-root': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state', 'config']
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
