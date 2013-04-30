---
layout: post
title: "如何使用‘纯CSS’来实现秒表时钟效果"

published: true

tags:
- css
- animation
- keyframes
- transform
- stopwatch
- clock
- clip
- rect

type: post
status: publish
---

### 背景

朋友的一个网页上，用 javascript 和 html canvas 实现了一个走动的时钟秒表效果。我们这次尝试用纯 CSS 来实现。

最终的期望效果如下图：

(图片为 gif 截图，实际效果请看 [这里](http://flanker.github.io/h5c3/time-circle/))

![秒表时钟效果]({{ site.static_url }}/images/2013/0430-stopwatcher.gif)

### 第一步

首先我们需要画一个圆圈。这个需要给外层 box 加上一个 `border-radius: 100%;` 即可。效果如下图：

![实心圆]({{ site.static_url }}/images/2013/0430-circle.png)

通过 `position: absolute` 在其内部使用 `:before` 伪元素再画一个内部的圆圈，设置其为白色，让我们的圆圈达到镂空效果。如下图：

![空心圆]({{ site.static_url }}/images/2013/0430-doughnut-circle.png)

这一步的 html DOM 如下：

    <div class="time-circle">
    </div>

css 实现简略如下：

    .time-circle {
      width: 280px;
      height: 280px;
      left: 0;
      top: 0;
      border-radius: 100%;
      position: absolute;
      background-color: #f15a2a;
    }

    .time-circle:before {
      content: ' ';
      border-radius: 100%;
      left: 20px;
      top: 20px;
      position: absolute;
      width: 240px;
      height: 240px;
      background-color: white;
    }

### 第二步

第二步我们给空心圆添加上动画效果。

熟悉 css 的同学可能知道 transform 中 有一个 `rotate(_SOME_deg)` 的属性可以让元素旋转。但是圆圈再怎么旋转，都不会有剪切的效果。所以仅仅通过旋转是不够的。

这里我们要用到 css 的另一个功能： [clip](https://developer.mozilla.org/en-US/docs/CSS/clip)。 clip 可以定义元素显示的部分，其会隐藏不现实的部分。

根据 clip，我们再画一个白色的大圆覆盖在最上面，但是 clip 它使其显示一半儿，再通过 css 的 animation，让它旋转起来。效果如下图：

![动画转动的半空心圆]({{ site.static_url }}/images/2013/0430-half-circle-animation.gif)

这一步的额外 css 如下：

    @keyframes outmove {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .time-circle:after {
      content: ' ';
      border-radius: 100%;
      left: -10px;
      top: -10px;
      position: absolute;
      width: 300px;
      height: 300px;
      background-color: white;

      clip: rect(0, 300px, 300px, 150px);
      animation: outmove 5s linear infinite;
    }

如果讲现在的转动圆环，遮住左半部，仅仅看右半部分，已经有些效果了。右半部分是逐渐出来，但是转动半圈后，又会逐渐消失。我们必须让它在转动的后半圈保持住不变。

这个可以通过修改 keyframes 时间轴的设定来实现，修改后的为：

    @keyframes outmove {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(180deg); }
      100% { transform: rotate(180deg); }
    }

这样子半圆从 0 到 50% 是旋转 180度的，然后 50% 到 100% 是不动的。

### 第三步

为了实现最终转动效果，我们还需要在左半部分实现一个同样的半圆。

由于 `.time-circle`， `.time-circle:before`, `.time-circle:after` 三个元素/伪元素我们都已经使用了，所以还得加一个 DOM 元素：

    <div class="time-circle">
      <div class="time-circle-inner">
      </div>
    </div>

给 `.time-circle-inner` 也加上类似的效果：

    @keyframes inmove {
      0% { transform: rotate(0); }
      50% { transform: rotate(0); }
      100% { transform: rotate(180deg); }
    }

    .time-circle-inner {
      content: ' ';
      border-radius: 100%;
      left: 0;
      top: 0;
      position: absolute;
      width: 280px;
      height: 280px;
      background-color: #f15a2a;

      clip: rect(0, 140px, 280px, 0);
    }
    .time-circle-inner:after {
      content: ' ';
      border-radius: 100%;
      left: -10px;
      top: -10px;
      position: absolute;
      width: 300px;
      height: 300px;
      background-color: white;

      clip: rect(0,150px,300px,0);
      animation: inmove 5s linear infinite;
    }

这样子 .time-circle-inner 只会在 50% ~ 100% 的时间段内，在左半部分画一个动画的半圆。效果如下：（动画前半段是空白的，需要等待下）

![动画转动的左半圆]({{ site.static_url }}/images/2013/0430-left-half-circle.gif)

### 第四步

将两个结合起来，需要对几个圆圈、半圆的 z-index 做细微设置，能够正确的互相覆盖。最终，我们的"如何使用‘纯CSS’来实现秒表时钟效果"就大功告成了。

再看一下我们的最终效果：

![秒表时钟效果]({{ site.static_url }}/images/2013/0430-stopwatcher.gif)

github 代码地址： [https://github.com/flanker/h5c3/tree/master/time-circle](https://github.com/flanker/h5c3/tree/master/time-circle)

实际效果： [http://flanker.github.io/h5c3/time-circle/](http://flanker.github.io/h5c3/time-circle/)

完。

