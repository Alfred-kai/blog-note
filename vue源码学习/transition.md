## transition 学习

- 验证方法，vue/dist/vue.runtime.common.js 文件中

- question1：既然 transition 实现逻辑是 先动画，然后，再去控制 dom 元素显示、隐藏；那么 v-show 或者 v-if 是怎么样被劫持掉的（即不起作用，由 transition 来实现相应的功能）；

  应该是 vue.runtime.common.dev.js 8404 行 来获取对于 v-show 的控制权的

- nextFrame 函数实现原理，和 requestAnimFrame 有什么关系？
