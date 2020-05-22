const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => { // opt에 개발용인지 배포용인지 변수가 숨어있다.
  const config = {
    // 중복되는 옵션들... 을 여기다가 적을거임
    resolve: { // 생량 확장자 명시하기
      extensions: ['.vue', '.js'],
      alias: {// 절대경로별칭 셋팅
        '~': path.join(__dirname), // ~ 경로를 통해 절대경로를 만들수있다.
        'scss': path.join(__dirname, './scss')
      }
    },
    entry: {
      // app: path.join(__dirname, 'main.js') //__dirname 현재파일의위치를 알려주는 nodejs 기능
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // --> app.js  entry 이름이 [name]에 자동바인딩된다.
      path: path.join(__dirname, 'dist') // app.js 를 저장할 위치
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.js$/, // .js로끝나는 파일을 찾아주세요 정규표현식으로 $는 찾아주세요 라는 의미 작성
          exclude: /node_modules/, // node_modules로 시작하는 폴더는 바벨이 해석하지않겠다.
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [ // 순서중요... 처음 형식부터 읽겠다.
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [ // 순서중요... 처음 형식부터 읽겠다.
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      // make sure to include the plugin for the magic
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html') // 해당 플러그인이 index.html을 가지고 dist에다가 넣을거다
      }),
      new CopyPlugin({// 특정 파일과 디렉토리를 카피해서 어딘가에 넣어주는 플러그인
        patterns: [
          { from: 'assets/', to: '' }// assets 라는 폴더안에 모든것을 복사하여to로 넣는다 to가 비여있을경우 output 셋팅에 넣는다.
        ]
      })
    ]
  }

  if (opts.mode === 'development') { // 개발용
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: true,
        hot: true
      }
    })
  } else { // 배포용
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
