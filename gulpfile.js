
/* jshint node:true */
'use strict';

var webpack = require('webpack');
var karma = require('karma').server;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Create a Webpack compiler for development
var DevWebpackCompiler = (function() {
  var devCompiler;

  function createCompiler() {
    var conf = Object.create(webpackConfig);
    conf.devtool = 'source-map';
    conf.debug = true;
    conf.watch = true;
    conf.output.path = '.tmp/scripts';
    return webpack(conf);
  }

  return {
    getWebpack: function() {
      if (!devCompiler) {
        devCompiler = createCompiler();
      }
      return devCompiler;
    }
  }
})();

// Lint Javascript
gulp.task('jshint', function () {
  return gulp.src([
      'app/scripts/**/*.js',
      'server/src/**/*.js',
      '!app/scripts/vendor/**/*.js'
  ])
    .pipe($.jshint({ lookup: true }))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

// Optimize images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat(['app/{,styles/}fonts/**/*']))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
  return gulp.src('app/styles/main.less')
    .pipe($.changed('styles', { extension: '.less' }))
    .pipe($.less())
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest('.tmp/styles'));
});

// Scan your HTML for assets & optimize them
gulp.task('html', ['styles'], function () {
  var lazypipe = require('lazypipe');
  var minifyCSS = require('gulp-minify-css');
  var cssChannel = lazypipe()
    .pipe(minifyCSS)
    .pipe($.replace, /'fonts\/glyphicons[.a-z]*/g, '\'../fonts')
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/*.html')
    .pipe(assets)
    // Concatenate and minify JavaScript
    .pipe($.if('*.js', $.uglify()))
    // Concatenate and minify Styles
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory and cached images
gulp.task('clean', function (callback) {
  var del = require('del')
  del(['.tmp', 'dist', 'server/dist'], function () {
    $.cache.clearAll(callback);
  });
});

// Run connect server
gulp.task('connect', ['styles'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(DevWebpackCompiler.getWebpack())
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

// Compile express server to ECMAScript 5
gulp.task('server:build', function() {
  return gulp.src('server/src/**/*.js')
    .pipe($.babel({blacklist: ['useStrict'], modules: 'common'}))
    .pipe(gulp.dest('server/dist'));
});

// Minify and compile handlebars templates
// Handlebars can be loaded with a Webpack loader but without minification
gulp.task('templates', function () {
  return gulp.src('app/scripts/**/*.hbs')
    .pipe($.minifyHtml())
    .pipe($.handlebars())
    .pipe($.defineModule('commonjs'))
    .pipe(gulp.dest('.tmp/scripts'))
});

// Pack Javascripts
gulp.task('webpack', ['templates'], function(callback) {
  DevWebpackCompiler.getWebpack().run(function(err, stats) {
    if(err) throw new $.util.PluginError("webpack", err);
      $.util.log("[webpack]", stats.toString({colors: true}));
      callback();
  });
});

// Copy assets to distribution path
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

// Pack JavaScript modules for production
gulp.task('webpack:build', ['templates'], function(callback) {
  var conf = Object.create(webpackConfig);

  conf.plugins = conf.plugins.concat(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

  // run webpack
	webpack(conf, function(err, stats) {
		if(err) throw new $.util.PluginError("webpack:build", err);
		$.util.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// Run karma for development, will watch and reload
gulp.task('tdd', function(callback) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, callback);
});

// Run tests and report for ci
gulp.task('test', function(callback) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: ['dots', 'junit'],
    junitReporter: {
      outputFile: '.tmp/test-results.xml',
    }
  }, callback);
});

// Perform server tests
gulp.task('test:server', function() {
  var files = ['server/test/setup.js', 'server/test/unit/**/*.spec.js'];

  require('babel/register')({ modules: 'common' });
  return gulp.src(files, { read: false })
    .pipe($.mocha({ reporter: 'spec', growl: true }));
});
gulp.task('tdd:server', ['test:server'], function() {
  gulp.watch('server/src/**/*.js', ['test:server']);
  gulp.watch('server/test/**/*.js', ['test:server']);
});

// Run development server environmnet
gulp.task('serve', ['webpack', 'run:server', 'connect', 'watch']);

// Watch files for changes & reload
gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    '.tmp/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('server/src/**/*.js', ['server:build']);
  gulp.watch('app/scripts/**/*.js', ['webpack']);
  gulp.watch('app/scripts/**/*.hbs', ['webpack']);
  gulp.watch('app/styles/**/*.less', ['styles']);
});

// Watch for changes on server files
gulp.task('run:server', ['server:build'], function() {
  $.nodemon({
    script: 'server/dist/server.js',
    watch: ['server/dist'],
    ignore: ['node_modules']
  });
});

// Build the project for distribution
gulp.task('build', ['jshint', 'webpack:build', 'server:build', 'html', 'images', 'fonts', 'extras'], function () {
  var size = $.size({title: 'build', gzip: true })
  return gulp.src('dist/**/*.js')
    .pipe(size)
    .pipe($.notify({
      onLast: true,
      title: 'Build complete',
      message: function() {
        return 'Total scripts size (gzip) ' + size.prettySize;
      }
    }));
});

// Clean all and build from scratch
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
