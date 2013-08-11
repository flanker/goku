---
layout: post
title: "使用 background-size 和 background-position 制作全景图片浏览"

published: true

tags:
- css
- javascript
- panorama image
- background-size
- background-position
- cover
- contain

type: post
status: publish
---

### 背景

做了一个很简单的全景图片效果效果。

[在 github page 上直接查看页面效果](http://flanker.github.io/h5c3/panorama/)

[在 codepen 上查看实现代码和效果](http://codepen.io/flanker/pen/Boiwc)

全景图一般是一个宽高比（width/height）很大的图片。我这里使用了一个弹性的固定的宽高比（100/30）的显示框，默认显示图片正中，多出的图片会被隐藏掉。当鼠标在图片上移动时，会根据鼠标的位置（偏左或者偏右）来动态的移动图片，已达到可以查看图片全景的目的。

以下为实现中几个小技巧的解释：

<!-- more -->

### 固定宽高比、大小自适应的 box

首先，有一个 `div` 的 box。这个 box 的 `width` 宽度为 60%，可以随着浏览器或者它的父元素宽度的变化，而自动的适应。

`height` 高度稍微麻烦一些，有些要求不多的可能直接写为固定数值，比如 200px 之类的。但是，很多时候，都希望 box 有一个固定的宽高比，比如 4:3 或者 14:9。

实现这个，在这里，给 `height` 设置为 0，给 `padding-bottom` 设置为期望的比率（比如 40%）。padding-bottm 百分比数值的计算，是以 width 来基数的，所以这样间接的实现了固定宽高比，自适应的 box 布局。

### 铺满的图片

有了 box，我们希望图片能够铺满它。这里使用了 `background-size` 这个 CSS 属性。

[background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) 这个属性可以灵活的设置背景的大小。可以给出具体的数值、或者比率。

同时，background-size 有两个关键字： `cover`, `contain`。以下是其解释：

* cover: 在同时保证，图片的宽度大于等于图片的定位区域宽度、图片的高度大于等于图片的定位区域高度时，保持比例的缩放图片使其尽量小。

* contain: 在同时保证，图片的宽度小于等于图片的定位区域宽度、图片的高度小于等于图片的定位区域高度时，保持比例的缩放使其尽量大。

这里使用 `background-size: cover`，由于我们的全景图片宽高比明显大于其定位区域，所以，高度会 100% 的占满区域，而宽度会保持图片原有宽高比自适应设置。

### 鼠标控制移动

让全景图片动起来，是通过 `background-position` 来实现的。

首先，给 background-position 默认值 `50% 0`，使其 x 轴上居中显示。

然后需要使用到 Javascript，监听图片所在 box 的 `mousemove` 事件，获取鼠标的 x 坐标，以计算出需要设置 background-position 的比率，范围为 0% 到 100%。

其次给 box 加上一个 `background-position 1s linear` 效果，这样子图片移动时，会有一个动画效果。

注：本来只用修改 background-position-x 即可，但 Firefox 不支持。

### 总结

这里通过简单的 background-size 和 background-position 制作了一个全景图片查看器。

需要说明的是，这里使用的是 background-image 背景图片，在语义上，并不适合于真正的显示图片的网页。如果用 `<img>` 标签来实现，下次再做一个。

对于 background，以后也会再写一些更多的解释。
