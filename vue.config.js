// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const HappyPack = require('happypack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
const packageInfo = require('./package.json');
const mockData = require('./mock/index');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// 是否启用mock数据
const isMock = true;
const Timestamp = new Date().getTime();

module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production', // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。
  // 默认引入地址
  baseUrl: process.env.VUE_APP_PUBLIC_BASE_URL,
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 部署应用包时的基本 URL
  // webpack配置，值位对象时会合并配置，为方法时会改写配置
  configureWebpack: {
    plugins: [
      new ParallelUglifyPlugin({
        // cacheDir: '.cache/',
        uglifyJS: {
          output: {
            /* 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，可以设置为false */
            beautify: false,
            /* 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false */
            comments: false,
          },
          warnings: false,
          compress: {
            drop_debugger: true, // 是否删除代码中得debugger语句
            drop_console: true, // 是否删除代码中得console语句
          },
        },
      }),
      new HappyPack({
        id: 'babel',
        loaders: ['babel-loader?cacheDirectory=true'],
        threadPool: happyThreadPool,
      }),
      // 告诉 webpack 公共库文件已经编译好了，减少 webpack 对公共库的编译时间
      // new webpack.DllReferencePlugin({
      //   context: process.cwd(),
      //   manifest: require('./public/vendor/vendor-manifest.json'),
      // }),
      // 将 dll 注入到 生成的 html 模板中
      // new AddAssetHtmlPlugin({
      //   // dll文件位置
      //   filepath: path.resolve(__dirname, './public/vendor/*.js'),
      //   // dll 引用路径
      //   publicPath: './vendor',
      //   // dll最终输出的目录
      //   outputPath: './vendor',
      // }),
    ],
    output: {
      // 每次构建打包时给文件名加上时间戳，确保每次版本更新的文件名不一样
      filename: `js/[name].${Timestamp}.js`,
      chunkFilename: `js/[name].${Timestamp}.js`,
    },
  },
  chainWebpack: (config) => {
    const jsRule = config.module.rule('js');
    jsRule.uses.clear();
    jsRule.use('happypack/loader?id=babel')
      .loader('happypack/loader?id=babel')
      .end();
    // 创建引入的别名
    config.resolve.alias
      .set('@$', resolve('src'));
    config
      .plugin('html')
      .tap((args) => {
        Object.assign(args[0], {
          title: packageInfo.version,
        });
        return args;
      });
    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('./src/customTheme/custom.less'),
      ],
    },
  },
  devServer: {
    // mock数据
    before: isMock ? (app) => {
      mockData.forEach((item) => {
        app[item.method](item.url, (req, res) => {
          res.json({
            success: true,
            code: 0,
            data: item.data,
          });
        });
      });
    } : null,
    host: '0.0.0.0',
    port: 9088, // 端口号
    hot: true, // 热更新
    https: false,
    open: false, // 当服务启动时自动打开浏览器 默认是false
    proxy: {
      '/api-v1': {
        // target: 'http://122.144.215.83:8088/', // 生产环境 服务器代理地址
        target: 'http://122.144.215.83:9071/', // 测试环境
        // target: 'http://192.168.0.50:8088/', // 开发环境
        // target: 'http://192.168.0.105:9088', // 张阳
        // target: 'http://192.168.0.179:9088', // 张晓芮
        // target: 'http://192.168.0.170:8088', // 王雷
        ws: false, // ws为true时可进行websocket通信
        changeOrigin: true,
        // 路径重写
        pathRewrite: {
          '^/api-v1': '/',
        },
      },
      '/api-v2': { // 针对 o-trial呼叫 做代理
        // target: 'http://192.168.0.253:9808/', // 开发环境
        target: 'http://test2.o-trial.com:9008/', // 测试环境
        // target: 'http://192.168.0.134:9808/', // 白魁元环境
        ws: false, // ws为true时可进行websocket通信
        changeOrigin: true,
        // 路径重写
        pathRewrite: {
          '^/api-v2': '/',
        },
      },
      '/api-v4': { // 针对 普瑞斯 呼叫做代理
        // target: 'http://192.168.0.253:9808/', // 开发环境
        target: 'http://test2.o-trial.com:9008/', // 测试环境
        // target: 'http://192.168.0.134:9808/', // 白魁元环境
        ws: false, // ws为true时可进行websocket通信
        changeOrigin: true,
        // 路径重写
        pathRewrite: {
          '^/api-v4': '/',
        },
      },
    },
  },
};
