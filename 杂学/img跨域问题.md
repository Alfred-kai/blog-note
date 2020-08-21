## img 跨域问题

- [一个关于 image 访问图片跨域的问题](https://www.jianshu.com/p/8fa0fb53c183)

### 问题描述：

在 JavaScript 中,使用 `new Image()`创建 img 元素，引用外部链接图片，报跨域问题；

在 html 中 `img` 元素引用相同的地址，没有问题；

### 跨域介绍：

JavaScript 同源策略，要求 协议、域名、端口一致，才能获取对方数据，否则不行；

但是有几个特殊标签，允许跨域访问外部资源；如 `<script>`、`<img>`、`<iframe>`,即在 html 元素中拥有 `src` 属性的元素是可以跨域访问资源的；

### 初步解决

通过对 跨域介绍 这块的了解，明白了为什么 html 中 img 引用没有问题；但是对于 JS 中 img 跨域问题还未解决

### 测试 JS 中 img 引用外部链接

```
<div>
	<img src="https:/test.alfred.cn/aa.png">
	<div id="test">

	</div>
 </div>

  <script>
	var testEle=document.getElementById('test');

	var a = new Image();
	//a.crossOrigin="anonymous";
	a.src="https:/test.alfred.cn/bb.jpg";
	a.onload=function(){
		testEle.appendChild(a);
	}
	a.onerror=function(e){
		console.log(e);
	}
  </script>
```

经过测试发现：

- 当阿里云 oss 不设置跨域白名单时：
  1. 当不设置 `crossOrigin` 属性时，可以跨域拿到 oss 上图片(本人测试服务器 `http://192.168.1.1:5000`);
  2. 设置 `crossOrigin` 属性为`anonymous`时，报跨域问题，图片拿不到；
- 当阿里云 oss 设置跨域白名单时（设置时，需注意 除了将相应的域名设置进去，还要设置`允许 Headers`，其值为`*`才可以）
  1. 无论是否设置了 `crossOrigin`，都可以获取到图片；

### 疑问点

- 首先明确一点，`img`元素不论是 html 中还是 JS 中，通过 src 获取资源，都是通过 http 请求；
- 当不设置`crossOrigin`属性时，不管服务器端是否允许了跨域，都可以获取到资源(这个结论目前只针对阿里 oss);
- 当设置了`crossOrigin`属性时，服务器端必须需要设置跨域(这个结论目前只针对阿里 oss);

1. 为什么不设置`crossOrigin`时，JS 中 img 可以拿到图片，不会报跨域问题？
2. 设置`crossOrigin`有什么用？

查看了[mdn img](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-crossorigin)文档：

> 这个枚举属性表明是否必须使用 CORS 完成相关图像的抓取。

而什么是`CORS`呢?[mdn CORS](https://developer.mozilla.org/zh-CN/docs/Glossary/CORS)

> CORS （Cross-Origin Resource Sharing，跨域资源共享）是一个系统，它由一系列传输的 HTTP 头组成，这些 HTTP 头决定浏览器是否阻止前端 JavaScript 代码获取跨域请求的响应。

通过上述，我们明白了 CORS 就相当于一个验证机制，当 img 使用了 crossOrigin 属性，就一定开启了 CORS，即开启了是否允许跨域请求验证；如果不设置，就不会发起 CORS 请求。。而这个是否允许的权限在服务器端。这样就能解释了 当 img 设置 crossOrigin 后，oss 服务器必须也要设置跨域的原因。

但是为什么 img 不设置 crossOrigin 且服务器端也没有设置允许跨域时，为什么能拿到？这个疑问，本人暂时没有解决。后面资料足够后，再来解决这个问题。

### 延伸

canvas 中使用 未设置 crossorigin 的 img，会怎样？

TML 规范中图片有一个 crossorigin 属性，结合合适的 CORS 响应头，就可以实现在画布中使用跨域 <img> 元素的图像。

尽管不通过 CORS 就可以在画布中使用图片，但是这会污染画布。一旦画布被污染，你就无法读取其数据。例如，你不能再使用画布的 toBlob(), toDataURL() 或 getImageData() 方法，调用它们会抛出安全错误。

### canvas 跨域解决

加时间戳

### 资料

[HTTP 访问控制(CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

[启用了 cors 的图片](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image)
