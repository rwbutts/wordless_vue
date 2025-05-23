const path = require('path')

module.exports = {
     pages:{
          index: {
               entry: 'src/main.ts',
          }
     },
   runtimeCompiler: true,
   lintOnSave :'default',   // true|'warning': lint emits errors as warnings; 'default' lint emits errors; 'eror' emits even warnings as errors
   devServer : {
       disableHostCheck : true,
       host: '0.0.0.0',
       allowedHosts: ['all'],
       headers: {
       },
  },
  configureWebpack: {
       devtool: 'source-map',
       resolve : {
            alias: {
                 '@utils': path.resolve(__dirname, 'src/utils'),
                 '@': path.resolve(__dirname, 'src'),
            }
       },   
       output: {
          filename: '[name].[hash].js'
        },    
  },

}          