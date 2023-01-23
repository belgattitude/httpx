// @ts-check

/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  api.cache(false);

  return {
    comments: false,
    presets: [
      [
        '@babel/preset-env',
        {
          // https://babeljs.io/docs/en/babel-preset-env.html#bugfixes
          bugfixes: true,
          exclude: [
            // '@babel/plugin-transform-regenerator',
            // '@babel/plugin-transform-parameters',
          ],
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-classes',
    ],
    assumptions: {
      // for class transform
      constantSuper: true, // @link https://babeljs.io/docs/en/assumptions#constantsuper
      noClassCalls: true,
      setClassMethods: true, // @link https://babeljs.io/docs/en/assumptions#setclassmethods
      superIsCallableConstructor: true,
      setPublicClassFields: true,
      // for spread
      iterableIsArray: true, // @link https://babeljs.io/docs/en/assumptions#iterableisarray
    },
  };
};
