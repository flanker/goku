---
layout: post
title: "CSS 水平对齐，当 vertical-align: baseline 遇上 empty inline-block"

published: true

tags:
- css
- vertical-align
- baseline
- inline-block

type: post
status: publish
---

### 背景

在 CSS 中，vertical-align 水平对齐是一个容易出错的地方。今天我们谈谈我遇到的一个小问题，有一个空元素 （empty element） 无法和其他元素水平对齐。

代码和在线 demo [可以看这里](http://codepen.io/flanker/pen/dBFEf)

截图如下：

![空元素水平对齐问题]({{ site.static_url }}/images/2013/0625-css-vertical-align-baseline-empty-inline-element.png)

<!-- more -->

### 代码

第一段代码片段中，`.part` 元素有两个子元素，其中一个子元素是空的。

    <div class="part">
      <div class="foo"></div>
      <div class="bar">bar</div>
    </div>

第二段代码片段中，`.part` 元素有两个子元素，都不是空的。

    <div class="part">
      <div class="foo">foo</div>
      <div class="bar">bar</div>
    </div>

通过 CSS， 我们给子元素设置了同样的属性：

    .foo,
    .bar {
      display: inline-block;
      width: 100px;
      height: 80px;
      line-height: 80px;
    }

这样两者都是 inline-block 元素，会水平布置在一行里。并且两者都同样的 height 和 line-height。

但是从 [demo](http://codepen.io/flanker/pen/dBFEf) 和 截图中都能看到。当两个子元素都不为空时，布局是我们所期望的。但是当其中一个子元素为空时，貌似布局乱掉了。这是为何？

### 原因

原因其实就是本文的标题： `vertical-align: baseline`。

1. 首先，对于一个 element 中的 inline 元素们，他们的水平方向上的对齐，是通过 vertical-align，这个属性来确定的；

2. 其次，在 CSS 中，vertical-align 的默认值，是 baseline。对于文字内容来说，baseline 是和它的 line-height 相关的。

        Align the baseline of the box with the baseline of the parent box.

3. 最后，对于空元素来说

        If the box doesn't have a baseline, align the bottom of the box with the parent's baseline.

    所以，空元素是以 bottom 来作为其 baseline 的，这也就是为什么在 demo 中，红色的空元素的 bottom 和 绿色的元素中间对齐着的。

### 解决办法

知道了原因，我们就可以很容易解决了。这里有两种方法：

* 不使用默认的 baseline 对齐。可以给子元素，设置 `vertical-align: bottom` 或者 `vertical-align: middle` 等属性，让他们以底对底这样子的对齐。由于高度都是一样的，所以是可以对齐的。

        .foo,
        .bar {
          display: inline-block;
          width: 100px;
          height: 80px;
          line-height: 80px;
          vertical-align: bottom;
        }

* 其次，不要使用空元素，在这里，我们可以给空元素内添加一个“空白”，可以使用 `&nbsp;` 不换行空格。

        <div class="part">
          <div class="foo">&nbsp;</div>
          <div class="bar">bar</div>
        </div>

### 参考

* [w3c 标准 line-height 和 vertical-align](http://www.w3.org/TR/2008/REC-CSS2-20080411/visudet.html#line-height)

* [Difference between baseline of empty and non-empty inline blocks](http://stackoverflow.com/questions/8215638/difference-between-baseline-of-empty-and-non-empty-inline-blocks)

* [Demo 动手试试](http://codepen.io/flanker/pen/dBFEf)
