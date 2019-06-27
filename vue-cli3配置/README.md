## css 引用资源

- 使用相对路径，eg:

```
.image {
  background: url(../../assets/common/img/kefu.png) no-repeat center/cover;
}
```

- 使用绝对路径,eg:
  绝对路径分两种，一种是"https://xxx.xx.png"，不推荐这种；
  另外一种，借助 vue-cli3 自身提供 ~ + webpack alias，这种，eg:

```
.image{
  background-image: url(~@assets/common/img/icon13.png);
}
```

如果相对路径过于复杂，可以使用下面这种，很方便！
