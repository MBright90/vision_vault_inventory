const prod = process.env.NODE_ENV === 'production'
const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'main.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  module: {
    rules: [
      {   
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: { 
              presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
            }
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        use: 'ts-loader',
      },
      {
				test: /\.s(a|c)ss?$/,
				use: [ 'style-loader', 'css-loader', 'sass-loader' ],
			},
    ]
  },
  devtool: prod ? undefined : 'source-map',
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@style': path.resolve(__dirname, 'src/style')
    }
  }
}
