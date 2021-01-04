module.exports={
    // chainWebpack:config=>{
    //   //删除编译后的独立js文件上的预获取操作
    //   config.plugins.delete("prefetch")
    // }
  //   devServer:{//开发服务器程序。类似于Nodejs 服务器端搬到客户端。
  //     proxy:{
  //     "/api":{
  //     target:`http://127.0.0.1:3000`,
  //     changeOrigin :true,
  //     pathRewrite:{
  //     `^/api`:""
  //     }
  //     }
  //   }
  // }
  configureWebpack:{
    resolve:{
      alias:{
        "vue$":'vue/dist/vue.esm.js'
      }
    }
  }
}
