const webpack = require('webpack');

const cdn = '';

module.exports = {
  stories: [
    '../components/**/*.stories.js'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-a11y',
    '@storybook/preset-scss',
  ],
  webpackFinal: async (config) => {
    // get index of css rule
    const ruleScssIndex = config.module.rules.findIndex(
      (rule) => rule.test.toString() === '/\\.s[ca]ss$/'
    );

    config.module.rules[ruleScssIndex].use = [
      'raw-loader',
      'postcss-loader',
      {
        loader: 'sass-loader',
        options: {
          additionalData: '$cdn: "";'
        }
      }
    ];

    const ruleCssIndex = config.module.rules.findIndex(
      (rule) => rule.test.toString() === '/\\.css$/'
    );

    config.module.rules[ruleCssIndex].use = ['raw-loader'];

    config.module.rules.push({
      test: /\.html$/,
      use: ['html-loader']
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        __CDN__: JSON.stringify(cdn)
      })
    );

    return config;
  },
};

