module.exports = {
  comments: false,
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-classes',
  ],
  assumptions: {
    // for class transform
    constantSuper: true, // @link https://babeljs.io/docs/en/assumptions#constantsuper
    noClassCalls: true,
    setClassMethods: true, // @link beljs.io/docs/en/assumptions#setclassmethods
    superIsCallableConstructor: true,
    setPublicClassFields: true,
    // for spread
    iterableIsArray: true, // @link https://babeljs.io/docs/en/assumptions#iterableisarray
  },
};
