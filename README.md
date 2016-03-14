
##extra-css-webpack-plugin
extra-css-webpack-plugin 目的是实现和 [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) 

差不多的功能，目前只是把同步或者异步的css文件打包到一个css文件里，



##使用方法

    

```javascript

webpack.config.js:
{
    module :    {
        noParse: /\.css$/,
    },
    plugins: [
        new ExtraCssPlugin()
    ] 
}

 
```




