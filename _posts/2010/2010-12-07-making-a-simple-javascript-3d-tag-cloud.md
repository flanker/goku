---
layout: post
title: 制作一个简单的 Javascript 3D Tag Cloud 旋转标签云

published: true
meta:
  _edit_last: "1"
tags:
- javascript
- tag cloud
- development

type: post
status: publish
---
很多人的博客都有一个 flash 的 3D Tag Cloud 标签云在转啊转（[Wordpress WP-Cumulus 插件](http://wordpress.org/extend/plugins/wp-cumulus/ "WP-Cumulus 插件主页")），看起来挺帅，这里我们用 Javascript 实现一个简单的 3D Tag Cloud 标签云。

> [猛击进入 demo 演示地址](http://chaojiwudi.com/demo/javascript-simple-3d-tag-cloud "Javascript 3D Tag Cloud 标签云 DEMO 演示")

首先给出 Html，比较简单，就是一个 div 里面包含了一个 ul，有一些超链接项目：

    <div id="tagCloud">
        <ul>
            <li><a href="#">javascript</a></li>
            <li><a href="#">html</a></li>
            <li><a href="#">css</a></li>
            <!-- 省略若干 -->
        </ul>
    </div>

其次我们给页面加上 CSS 样式，因为超链接作为标签云将会在页面内旋转漂浮，所以需要给 a 标签设置为 `position: absolute` ，而 #tagCloud 作为标签云的容器，需要设置高度宽度，以及 `position: relative` 。主要的几个 CSS 如下，比较简单：

<!--more-->
    #tagCloud {
        height: 300px;
        width: 600px;
        position: relative;
        margin: 0;
        overflow: hidden;
    }
    #tagCloud a {
        position: absolute;
        text-decoration: none;
        color: #0B61A4;
        text-shadow: #66A3D2 1px -1px 1px;
    }

![Html 加上 CSS 后的样子](/images/2010/html-with-css.png)

Html 加上 CSS 后的效果就如上图所示，所有的超链接因为 position 设置为了 absolute 并且又没有设置 left/top，所以全都挤到了一起。下面就需要 Javascript 出场了，简单来讲就是通过 Javascript 不断的设置每一个 超链接的 left/top，来让所有的超链接不断的移动位置，看起来就好象成为了标签云在飘动。

![Javascript 3D 标签云](/images/2010/javascript-simple-3d-tag-cloud.png)

首先给出我们预期的 3D 标签云的样子。

这里我只是准备用 Javascript 制作一个简单 3D 标签元，而没有使用到 canvas 画布等 Html5 新的东西，所以其实我们的 3D 是一个非常“伪”的 3D。把所有的超链接元素放在一个圆环上，一些元素字体设置较大、透明度较低，这样子就感觉离我们近一些，另一些元素字体设置较小、透明度较高，这样子就会感觉离我们远一些，从而形成了 3D 的效果。

至于超链接元素的 left/top 值，在这里就对应了我们的 x、y 坐标轴。一个圆上的点在 x、y 坐标轴上的投影，等等，这不就是中学数学里的 三角函数吗（单位圆上各种线段的长度）？

我们把整个圆周 360 度按照超链接元素的个数等分，然后得到每个元素对应的角度，该角度对应的正弦/余弦值也就是元素位置的 x、y 坐标了。同样也可以根据这个来给元素设置字体和透明度。

假设某一个元素的角度是 α，那么其对应的各项值应该为：

    left: ( sin ( α) * 宽度半径 ) + 宽度半径
    top: ( cos ( α) * 高度半径 ) + 高度半径
    fontSize: ( cos( α) * 10 ) + 普通字号大小
    zIndex: ( cos( α) * 系数 ) + 固定值      注：正值，放大的越大越好
    opacity: ( cos( α) / 系数 ) + ( 1 / ( 1- 系数 ) )      注：比例换算到 0 ～ 1

最终我们通过 Javascript 的 `setInterval ( fn, ms)` 这个方法，不断的循环调用设置元素的各项 style，从而实现元素的移动。我们把代码写到一个简单的类型封装起来：

    // Js 标签云
    function JsTagCloud(config) {
        // 对应的 Div 标签
        var cloud = document.getElementById(config.CloudId);
        this._cloud = cloud;
        // w, h 是 Div 的高宽
        var w = parseInt(this._getStyle(cloud, 'width'));
        var h = parseInt(this._getStyle(cloud, 'height'));
        this.width = (w - 100) / 2;
        this.height = (h - 50) / 2;
        // 初始化
        this._items = cloud.getElementsByTagName('a');
        this._count = this._items.length;
        this._angle = 360 / (this._count);
        this._radian = this._angle * (2 * Math.PI / 360);
        this.step = 0;
    }
    // 获取对象 Style
    JsTagCloud.prototype._getStyle = function(elem, name) {
        return window.getComputedStyle ? window.getComputedStyle(elem, null)[name] :
                elem.currentStyle[name];
    }
    // 渲染标签云
    JsTagCloud.prototype._render = function() {
        for (var i = 0; i < this._count; i++) {
            var item = this._items[i];
            var thisRadian = (this._radian * i) + this.step;
            var sinV = Math.sin(thisRadian);
            var cosV = Math.cos(thisRadian);
            // 设置 CSS 内联样式
            item.style.left = (sinV * this.width) + this.width + 'px';
            item.style.top = this.height + (cosV * 50) + 'px';
            item.style.fontSize = cosV * 10 + 20 + 'pt';
            item.style.zIndex = cosV * 1000 + 2000;
            item.style.opacity = (cosV / 2.5) + 0.6;
            item.style.filter = " alpha(opacity=" + ((cosV / 2.5) + 0.6) * 100 + ")";
        }
        this.step += 0.007;
    }
    // 开始
    JsTagCloud.prototype.start = function() {
        setInterval (function(who) {
            return function() {
                who._render();
            };
        } (this), 20);
    }

上面的代码需要注意的几点是：

* 获取DOM 元素的 Style 属性值。这里需要获取 #tag 的 width/height，IE 是通过 `elem.currentStyle.AttributeName` 来获取的，而其他标准浏览器是通过 `window.getComputedStyle()` 函数来获取的。这里写了一个 _getStyle() 函数来获取。
* `Math.sin()` 和 `Math.cos()` 函数的参数是弧度（<a title="弧度 - 维基百科" href="http://zh.wikipedia.org/zh-cn/%E5%BC%A7%E5%BA%A6">忘记了？</a>），所以需要先把角度转换为弧度。
* 设置 CSS Style 内联样式时，需要考虑浏览器兼容性。比如透明度 标准浏览器直接使用 `style.opacity` 赋值，而 IE 需要使用 filter 来设置。

好了，我们的小类库完成后，只需要

    var tagCloud = new JsTagCloud({ CloudId: 'tagCloud' });
    tagCloud.start();

就可以跑起来了。

> [猛击进入 demo 演示地址](http://chaojiwudi.com/demo/javascript-simple-3d-tag-cloud "Javascript 3D Tag Cloud 标签云 DEMO 演示") （Chrome 和 IE8 下测试过）

又及：貌似这个很费 CPU 啊，看来得用 Html5 画布 试试。
