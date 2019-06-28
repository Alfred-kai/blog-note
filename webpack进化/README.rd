## webpack在bundle文件中报错，无法准确定位源文件位置
```
module.exports = {
  devtool: 'inline-source-map'
}
```
按上述配置后，即可显示源文件位置