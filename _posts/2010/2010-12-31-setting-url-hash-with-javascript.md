---
layout: post
title: javascript 控制浏览器地址栏 URL 的 Hash 值

published: true
meta:
  _edit_last: "2"
tags:
- javascript
- location.hash
- development

type: post
status: publish
---
[超级无敌](http://chaojiwudi.com "超级无敌 - 冯智超的个人网站") 的首页又做了一下小修改，主要是在给每一个幻灯片加上了一个对应的地址（利用 URL 里的 Hash 部分）。比如，高中那一页幻灯片就是 [http://chaojiwudi.com/#!/1998-2004-high-school](http://chaojiwudi.com/#!/1998-2004-high-school)。这样子对方便 URL 复制、收藏夹记录、搜索引擎友好等有帮助。貌似一些牛逼的站点比如 Gmail、twitter、facebook 等都这么搞了。（其实一个 # 就够了，我也不明白为什么要搞成 #!/，看起来很酷？）

浏览器对于地址栏的 hash 部分，如上面的 #!/1998-2004-high-school，是不发送请求给服务器端的，所以对于 hash 我们可以在客户端用 javascript 来处理。主要就是处理 location.hash 来获取和设置 hash 值。使得浏览器地址栏与我们的页面联动起来。

location.hash 值的改变，同样影响了浏览器的 history，所以浏览器的 back/forward 按钮也可以控制了。所以我们还需要监听 location 改变的事件。目前在 html5 有一个新增的 window.onhashchange 事件可以直接使用，Chrome/Firefox/IE8都是支持的，IE7/6估计不支持我也没有试过。

对于不支持 window.onhashchange 的浏览器，如果想实现很好的兼容，也有一些实现，一般都是通过 setInterval 不停的监视 location.hash 的值，或者通过添加一个 iframe 里面隐藏锚点（这个没有细看）（例如 [Really Simple History](http://code.google.com/p/reallysimplehistory/)、[jQuery History Plugin](http://tkyk.github.com/jquery-history-plugin/)等）。但是都觉得不是很完美，反正我的小站也没打算费力气去支持那些落后的浏览器，就用 onhashchange 事件来搞了。
