const Encore = require('@symfony/webpack-encore');
const { VuetifyPlugin } = require('webpack-plugin-vuetify');
const path = require('path');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addAliases({
        '@': path.resolve(__dirname, 'assets', 'js')
    })
    .addEntry('app', './assets/js/app.js')
    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })
    // ВКЛЮЧАЕМ VUE LOADER
    .enableVueLoader(() => {}, {
        version: 3,
        runtimeCompilerBuild: false,
    })
    // ДОБАВЛЯЕМ VUETIFY PLUGIN
    .addPlugin(new VuetifyPlugin())
    .enableTypeScriptLoader();

module.exports = Encore.getWebpackConfig();
