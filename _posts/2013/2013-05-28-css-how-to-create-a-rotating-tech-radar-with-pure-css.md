---
layout: post
title: "如何使用‘纯CSS’来实现动态的技术雷达效果"

published: true

tags:
- css
- css3
- animation
- keyframes
- transform
- tech radar
- clip
- rect

type: post
status: publish
---

### 背景

ThoughtWorks 公司定期会发布 Tech Radar，以一个雷达图表的方式来展示当前技术趋势。比如 2013 年 5 月的技术雷达： [Tech Radar May 2013](http://www.thoughtworks.com/radar)

我们尝试用 html/css 来创建一个酷一点儿 Tech Radar。

### 产出

![html/css Tech Radar]({{ Configr.site['static_url'] }}/images/2013/0528-tech-radar.png)

移步 [这里](http://flanker.github.io/h5c3/radar/) 可以看到当前的结果。

移步 [这里](https://github.com/flanker/h5c3/tree/master/radar) 可以看到源码

** 注意： ** 由于只是为了验证 DEMO，所以目前只支持 Chrome 浏览器（只用了 chrome 的特有 CSS property）。理论上是可以扩展到 Firefox 和 Safari 的。

### 实现技术点

这个 Tech Radar 的实现是基于纯粹的 CSS（唯一的一点 javascript 是为了控制雷达旋转的启动与暂停，和样式没有关系）。Tech Radar 的 html 基本没有多余的 DOM element，是一个有意义的完好结构的文档。

<!-- more -->

然后通过多种 CSS 手段，包括 `transform`、 `rotate`、 `border-radius`、 `background gradient`、 `z-index`、 `animation`、 `box-sizing`、 `clip` 和 `rect`，来实现了雷达的 圆圈、 渐变色、 覆盖、 旋转 等各个要素。由于目标是不要给 DOM 带来额外操作，所以很多东西都是通过 `:before` `:after` 伪元素来实现的。

* transform / rotate 让雷达扫描轴选择特定的角度
* border-radius 把 element 做成圆圈
* gradient 背景渐变色
* z-index / absolute position 布局各个元素、元素之间的覆盖
* animation 动画效果
* box-sizing 简化盒模型长宽的处理
* clip rect 裁减 element（制作出扇面）

这里就不对每一条 CSS rule 做详解了，有兴趣的同学可以直接查看源码。以后有时间会对一些常用的实践写一下分享。
