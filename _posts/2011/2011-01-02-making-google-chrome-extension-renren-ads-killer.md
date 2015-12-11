---
layout: post
title: 人人网广告杀手 -- 制作 Google Chrome Extension 谷歌浏览器扩展

published: true
meta:
  _edit_last: "1"
tags:
- chrome
- chrome extension
- renren.com
- 人人网
- development
- 谷歌浏览器
- 谷歌浏览器扩展

type: post
status: publish
---
现在互联网上面免费的服务是越来越多了，但是广告也是越来越多了，打开 Gmail 邮件都快被广告包围了（Google 是一个广告公司啊）。前两天看到一个 Chrome 扩展—— [Better Gmail](https://chrome.google.com/webstore/detail/mgdnblnolcinnndenjnollpiplgkbjcn) 很帅，可以隐藏掉 Gmail 上的广告及其他小功能，觉得很有用，详细看了看其扩展内部发现原来 Chrome 谷歌浏览器扩展还是比较简单的，于是自己也照虎画猫的做了一个“人人网广告杀手”，用来隐藏掉人人网上的一下广告。

> [Demo 演示地址](http://chaojiwudi.com/demo/google-chrome-extension "人人网广告杀手 Chrome 谷歌浏览器扩展 DEMO")
> [扩展下载地址](http://chaojiwudi.com/download/renrenAdsKiller.crx "人人网广告杀手 Chrome 谷歌浏览器扩展 下载地址")

看一下 Chrome 谷歌浏览器扩展，其文件扩展名为 .crx，简单来讲就是一个 zip 压缩包，包含了一些文件（html、js、css、图片等等）。本质上扩展就是一个 html 页面，可以执行 javascript 及调用 Chrome 浏览器提供的 API。

<!--more-->
首先需要有一个 manifest.json 文件用来描述扩展（元数据）。其内部描述了扩展的基本信息，扩展包含的文件、功能，扩展需要调用的 API，扩展的权限等等。我们的“人人网广告杀手”只需要对匹配人人网地址 URL 的网页起作用，所以我们的 manifest.json 如下：

    {
      "name": "人人网广告杀手",
      "version": "0.1",
      "description": "清除掉人人网网页上的一些广告。",
      "permissions": ["tabs", "http://*.renren.com/*"],
      "content_scripts": [
        { "js": ["script.js"], "matches": [ "http://*.renren.com/*" ] }
      ]
    }

name、version、description 是扩展的描述信息。permissions 声明了扩展的权限，对 tabs 和 匹配人人网的网页有效，这个会在用户安装扩展时给用户提示。content_scripts 是在网页上下文中执行的 javascript，因为我们想在浏览器打开人人网的网页后执行我们的 javascript 脚本来去除广告，所以写入一条规则，在 matches 为 人人网时，执行 js 文件 script.js。在 Content Script 中，我们可以获取并修改页面的 DOM，其实就相当于我们的 Content Script 是原有页面的一部分一样。

对于我们修改页面去除广告的 javascript 如下：

(function() {
    var css = ' ';
    // 广告/投票
    css += ' #header-wide-banner { display: none !important } ';
    css += ' .sponsors { display: none !important } ';
    css += ' .wide-sponsors { display: none !important } ';
    css += ' .sales-poll { display: none !important } ';
    css += ' #webpager-ad-panel { display: none !important } ';
    css += ' .navigation .blank-holder { display: none !important } ';
    css += ' .downloadclient { display: none !important } ';
    css += ' .kfc-banner { display: none !important } ';

    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
    }
})();

这个javascript 很简单，首先写了一个 css 片段字符串（里面找了很多广告的 选择器，然后邪恶的把他们设置为 display: none）。然后修改 DOM，在 `<head>` 里把我们的 css 添加进去。

下面我们需要测试执行我们的扩展。将 manifest.json 和 script.js 两个文件放在同一目录，比如 /test，打开 chrome 谷歌浏览器，进入扩展页面（Tools -> Extentsions，或者 [chrome://extensions/](chrome://extensions/)），打开右侧的 Developer Mode，选择 Load unpacked extension... 找到我们的 /test 就可以加载我们的扩展了。对于扩展也可以像调试普通页面一样，使用 Chrome 谷歌浏览器的 Developer tools 来调试 javascript 啊等。测试通过后，可以继续在扩展页面 Developer Mode 下，使用 Pack extension 来将扩展打包成 .crx 格式（自己手动压缩成 zip包然后修改扩展名是不行的，crx还有别的信息）。还可以发布到 chrome web store 应用商店上，不过现在 web store 首次发布 app 需要交 $5.00 美元验证。

![使用 人人网广告杀手 之前]({{ Configr.site['static_url'] }}/images/2011/before-renrenAdsKiller.png)

Hooah，大功告成，打开人人网页面后，清爽了许多。

![使用了 人人网广告杀手 之后]({{ Configr.site['static_url'] }}/images/2011/using-renrenAdsKiller.png)

我们的扩展还很简单，比如没有设置页面等等，这些功能在 Google Chrome 谷歌浏览器扩展中也都很好实现，以后可以进一步优化，更详细的可以参考 [Google Chrome 谷歌浏览器扩展开发文档](http://code.google.com/chrome/extensions/getstarted.html "chrome 扩展文档")。

