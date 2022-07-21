const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: '/',
	// productionSourceMap: true,
	filenameHashing: false,
	assetsDir: "spa_assets",
})
