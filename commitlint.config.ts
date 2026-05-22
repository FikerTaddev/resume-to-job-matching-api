export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'auth',
        'controller',
        'service',
        'model',
        'db',
        'middleware',
        'config',
        'deps',
        'gateway',
        'test',
      ],
    ],
    'header-max-length': [2, 'always', 72],
  },
};
