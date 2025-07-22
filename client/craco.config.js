module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Remove react-refresh plugin to disable Fast Refresh
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) =>
            plugin.constructor.name !== 'ReactRefreshPlugin'
        );
        return webpackConfig;
      },
    },
  };
  