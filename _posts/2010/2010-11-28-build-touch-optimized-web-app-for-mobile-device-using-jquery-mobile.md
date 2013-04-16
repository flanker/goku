---
layout: post
title: 使用 jQuery Mobile 开发针对移动设备触摸屏优化的 Web 应用

published: true
meta:
  _edit_last: "1"
  _wp_old_slug: build-touch-optimized-web-app-for-mobile-device-using-jquery-mobile-tablets
tags:
- jQuery Mobile
- mobile
- webDev
- development

type: post
status: publish
---
随着 iOS/Android 等移动设备最近的超级火热, 以及业界齐呼移动互联网时代的到来, 给自己的网站开发一个适用于移动设备的版本, 尤其是针对使用触摸屏的设备, 看起来应该是必须的了.

[jQuery](http://jquery.com/ "jQuery 官方网站") 作为 Web 开发中 Javascript 库的佼佼者, 其开发团队自然也没有放过移动设备. 近期他们推出了 [jQuery Mobile](http://jquerymobile.com/ "jQuery Mobile 官方网站") 项目, 并于 [11月发出了 Alpha 2 版](http://jquerymobile.com/2010/11/jquery-mobile-alpha-2-released/ "jQuery Mobile Alpha 2 发布"). jQuery Mobile 给移动设备 Web 应用提供了一个 jQuery 核心库, 并且提供了一个统一的 UI 框架. jQuery Mobile 的其他优势有:

基于 jQuery 核心库; 兼容所有主流移动设备; 小巧(12KB); 基于 HTML5/CSS3; 可用性和可访问性; 以及强大的 UI 框架;

使用 jQuery Mobile 搭建针对移动设备的 Web 应用, 开发者只需要负责 HTML 页面即可, 并且 jQuery Mobile 对 HTML 无侵害, 完全使用符合标准的 HTML5.

上面的话ms很官方很客套很无聊~, 我们还是看实际开发吧. 我的个人小站 超级无敌 [http://chaojiwudi.com/m](http://chaojiwudi.com/m "超级无敌") 已经使用 jQeury Mobile 完成了改造(用 Chrome 浏览器打开也可以看到效果). 下面简单介绍一下如何使用 jQuery Mobile.

首先使用 jQuery Mobile 需要使用 HTML5 的页面, 并且需要引用 jQuery Mobile 相应的 CSS/js 文件. 如下代码所示, 具体的引用文件请换成相应文件.

    <!DOCTYPE html>
    <html>
    <head>
        <title>Page Title</title>
        <link rel="stylesheet" href="..../jquery.mobile.min.css" />
        <script src="..../jquery.min.js"></script>
        <script src="..../jquery.mobile.min.js"></script>
    </head>
    <body>
    </body>
    </html>

jQuery Mobile 把最终展示给移动设备屏幕的页面成为一个 [page](http://jquerymobile.com/demos/1.0a2/docs/pages/index.html "jQuery Mobile Page 文档"), 通常情况下一个 page 会包含一个 header/一个 content/一个 footer. 而我们的一个 HTML 文件可以包含一个或多个 page, 多个 page 可以用 id 来区别.  用户在点击链接/按钮时, jQuery Mobile 会使用 Ajax 发送 HTTP 请求 HTML 文件, 并将结果替换到当前的 DOM 上, 从而展示新的 page. 在 Ajax 请求处理过程中, jQuery Mobile 通过修改 location.hash 来更新浏览器地址栏信息, 从而实现浏览器 回退/前进 功能在不失效, 并且用户可以收藏保存该 URL 地址.

一个典型的 jQuery Mobile 页面 HTML 如下:

    <!DOCTYPE html>
    <html>
    <head>
        <title>页面</title>
        <link rel="stylesheet" href="..../jquery.mobile.min.css" />
        <script src="..../jquery.min.js"></script>
        <script src="..../jquery.mobile.min.js"></script>
    </head>
    <body>
    <div data-role="page">
        <div data-role="header">
            <h1>页面标题</h1>
            <a href="#">返回</a>
            <a href="#">选项</a>
        </div>
        <div data-role="content">
            <p>页面内容</p>
            <a href="#">一个链接</a>
            <a href="#" data-role="button" data-inline="true">一个按钮</a>
            <ul data-role="listview" data-inset="true">
                <li data-role="list-divider">一个列表</li>
                <li>一个列表项目</li>
                <li>两个列表项目</li>
            </ul>
        </div>
        <div data-role="footer">
            <h4>页面脚注</h4>
        </div>
    </body>
    </html>

然后... 然后没有了. 现在这个页面用移动设备浏览器打开, TA-DA, 就是一个很漂亮的移动版本了.

![jQuery Mobile 基本页面]({{ site.static_url }}/images/2010/jQueryMobileBasicPage.png)

什么? 我们的 Javascript 在哪里? 嗯. jQuery Mobile 的一个特性就是, 不需要写 Javascript 来配置页面, 而是通过 HTML Attribute 属性来搞定. (是不是让人想起了 Asp.NET) 但是请注意, jQuery Mobile 使用的 HTML5标准的 [自定义属性](http://ejohn.org/blog/html-5-data-attributes/ "John Resig 的 HTML5 自定义属性文章"). 即上个代码中的 "data-role", HTML5 运行页面开发者使用以 "data-" 开头的自定义属性. 所以在 jQuery Mobile 中大部分都是靠这个来实现的.

在 <body> 中, 首先引入了一个 div, 用 data-role="page" 将其定义为 page 元素. page 元素包含三个 div, 其 data-role 分别为 header/content/footer. 在 page 中的 HTML 元素, jQuery Mobile 都会按照移动设备触摸屏进行优化处理. 比如 header 里的  链接就会处理为左上角/右上角的按钮. 除了 jQuery Mobile 的默认处理样式, 还可以通过 data- 自定义属性来显式的告诉 jQuery Mobile 如何处理页面元素. jQuery Mobile UI 框架目前已经支持 page/dialog/toolbar/button/list 等很多 UI 组件, 以及页面动画与页面时间. [详细文档在此](http://jquerymobile.com/demos/1.0a2/ "jQuery Mobile 文档示例").

好了, jQuery Mobile 就简单介绍到这里, 目前他还是 Alpha 2版, 自己感觉相当不错, 未来还有很大的发展潜力 (估计主要在移动设备兼容性还有性能上)

下面是从我的 Android 机器访问我的超级无敌网站的实际效果截图: [http://chaojiwudi.com/m](http://chaojiwudi.com/m "超级无敌") (用 Chrome 浏览器打开也可以看到效果). 该页面在 W3C Validate 是 HTML5 标记验证通过的.

![Android手机访问效果截图]({{ site.static_url }}/images/2010/jQueryMobileOnAndroid.png)

这篇文章是使用 jQuery Mobile 开发针对移动设备的 Web 应用的一个简介. 目前 jQuery Mobile 还处于 Alpha 2, 虽然已经十分精彩, 但也有些不足, 未来还是有很大的发展潜力的. ( 估计首先集中在性能和移动设备的兼容性上 )
