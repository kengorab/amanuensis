// Override some babel and webpack configs to allow for less files to be loaded
// for the ant-design lib. This allows theme variables to be modified, which are
// located in ./src/theme-override.js.
// https://github.com/harrysolovay/rescripts/issues/18#issuecomment-454889312
const lessConfig = [
  [
    'use-babel-config', {
    presets: ['react-app'],
    plugins: [
      ['import', {
        libraryName: 'antd',
        style: true
      }]
    ]
  }
  ],
  config => {
    const rule = config.module.rules.find(rule => rule.oneOf)
    rule.oneOf.unshift(
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: require('./src/theme-override').scss
            }
          }]
      }
    )

    return config
  }
]

// Configure rescripts, which augments react-scripts and adds additional functionality
module.exports = [
  // See the comment above, which explains why lessConfig is needed
  ...lessConfig,

  // This is necessary to prevent webpack from stripping out node packages, like fs
  // and others (which are accessible to us by nature of running in an electron environment).
  // The `electron` package itself makes assumptions about these modules being accessible, so
  // this is needed even if we don't explicitly import node packages ourselves.
  config => {
    config.target = 'electron-renderer'
    return config
  }
]
