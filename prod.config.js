const path = require('path');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

const version = process.env.BUILD_VERSION || 'dev';

console.log('Building version', version);

const outputDir = './dist';

/**
 * @param {string} relativeName "resources/foo/goo"
 * @return {string[]}
 *
 * This generates an array of all the component entry points for the combined build.
 */
const listCombinedComponentEntry = (relativeName) => {
  try {
    const folderPath = path.join(process.cwd(), ...relativeName.split("/"));
    return fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => `./components/${dirent.name.split(".")[0]}/${dirent.name.split(".")[0]}.js`);
  }
  catch (err) {
    console.log('Combined Entry Failed', err);
  }
};

const combinedEntry = listCombinedComponentEntry('components');
console.log(combinedEntry);

/**
 * @param {string} relativeName "resources/foo/goo"
 * @return {string[]}
 *
 * This generates an array of each component for creating the individual
 */
const listComponentNames = (relativeName) => {
  try {
    const folderPath = path.join(process.cwd(), ...relativeName.split("/"));
    return fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => `${dirent.name.split(".")[0]}`);
  }
  catch (err) {
    console.log('Component List Failed', err);
  }
};

const components = listComponentNames('components');
console.log(components);

const compiledComponents = async (entry, filenamePrefix) => {
  return {
    mode: 'production',
    entry: entry,
    optimization: {
      minimizer: [
        new HtmlMinimizerPlugin({
          minimizerOptions: {
            collapseWhitespace: true,
          },
        }),
        new UglifyJSPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
            }
          }
        })
      ]
    },
    output: {
      path: path.join(__dirname, outputDir),
      filename: `${filenamePrefix}.${version}.js`,
      publicPath: '/dist/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              'exclude': 'node_modules/**',
              presets: [
                ['@babel/preset-env', {
                  'useBuiltIns': false
                }]
              ],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    'regenerator': true,
                    'corejs': 3
                  }
                ],
                ['@babel/plugin-proposal-private-property-in-object', { 'loose': true }],
                ['@babel/plugin-proposal-private-methods', { 'loose': true }],
                ['@babel/plugin-proposal-class-properties', { 'loose': true }],
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: ['raw-loader']
        },
        {
          test: /\.s[ca]ss$/,
          use: ['raw-loader', 'sass-loader']
        },
        {
          test: /\.html$/,
          use: ['html-loader']
        }
      ]
    },
    resolve: {
      modules: [ 'node_modules' ],
    }
  };
};

const fullBuild = async () => {
  var builds = [];
  for (const component of components) {
    console.log(component);
    builds.push(await compiledComponents(`./components/${component}/${component}.js`, `${component}`));
  }

  builds.push(await compiledComponents(combinedEntry, 'fullComponents'));

  return builds;
};

module.exports = async () => {
  return await fullBuild();
};
