### XMLHttpRequest

```
  //1 创建xhr
  var xhr = new XMLHttpRequest();
  //2 监听状态改变
  xhr.onreadystatechange = function(){
    if(xhr.readyState===4){
      if(xhr.status===200){
        doResponse(xhr);//响应完成且成功
      }else{
        alert('响应完成但有问题');
      }
    }
  }
  //3 打开连接
  xhr.open('GET','9_i18n.php', true);
  //4 发送请求
  xhr.send( null );

  function doResponse(xhr){
    console.log('开始处理响应结果');
    console.log(xhr);
    eval( xhr.responseText ); //执行服务器端返回的JS字符串
  }
```

15.ajax 过程？
1，创建 XMLHttpRequest 对象,也就是创建一个异步调用对象；
2，创建一个新的 HTTP 请求,并指定该 HTTP 请求的方法、URL 及验证信息；
3，设置响应 HTTP 请求状态变化的函数；
4，发送 HTTP 请求；
5，获取异步调用返回的数据；
6，使用 JavaScript 和 DOM 实现局部刷新；
