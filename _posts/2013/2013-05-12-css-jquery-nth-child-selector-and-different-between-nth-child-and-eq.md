---
layout: post
title: "CSS nth-child 选择符，以及 jQuery 中 nth-child 和 eq() 的区别"

published: true

tags:
- css
- jquery
- selector
- "nth-child"
- eq

type: post
status: publish
---

### 背景

了解 css 选择符的同学估计都知道 `nth-child` 选择符，在 jQuery 的选择符中，也有对应的 `nth-child`，并且 jQuery 还有自己一个 `eq()` 方法。

如果要问问 css/jQuery 中 nth-child 是如何筛选元素，以及 nth-child 和 eq 在 jQuery 中有什么区别？可能很多同学都会回答，“nth-child 就是选择第 n 个子元素”，“nth-child 在 css/jQuery 中都是从 1 开始计数，而 eq 是从 0 开始计数”。

这个回答只能说是还不够完整不够准确。

### 最简单的情况

给出一个最简单的 html/css：

    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </ul>

    ul li:nth-child(3) {
      color: red;
    }

[在线演示](http://flanker.github.io/h5c3/nth-child/1.html)

按照最简单的理解，`<li>3</li>` 应该会被设置成为红色，事实上也确实如此。这是不是可以理解成为，nth-child 选择了第三个子元素呢？我们再看一个复杂点儿的情况

### 复杂点儿

再看看这段 html/css：

    <ul>
      <li class="mango">mango 1</li>
      <li class="mango">mango 2</li>
      <li class="apple">apple 1</li>
      <li class="apple">apple 2</li>
      <li class="apple">apple 3</li>
      <li class="apple">apple 4</li>
      <li class="apple">apple 5</li>
    </ul>

    ul .apple:nth-child(3) {
      color: red;
    }

[在线演示](http://flanker.github.io/h5c3/nth-child/2.html)

如果只按最简单的“选择第三个元素”可能会认为 `apple 3` 被设置成红色，其实是错误的，结果是 `apple 1` 被设置成为了红色。

nth-child 并不是从前面的选择符筛选后的结果中选择第 n 个。它的定义是，选择在其 parent 中，第 n 个子元素。而这个“第 n 个”的计算，是把它 parent 下所有的子元素都包括在内的（任何 tagName/class/id 都会在内）。比如说下面这样子：

    <ul>
      <a>link</a>
      <p>some text</p>
      <li>apple 1</li>
      <li>apple 2</li>
      <li>apple 3</li>
      <li>apple 4</li>
      <li>apple 5</li>
    </ul>

    ul li:nth-child(3) {
      color: red;
    }

[在线演示](http://flanker.github.io/h5c3/nth-child/3.html)

这个的结果，还是 `apple 1` 会被设置成为红色，即使选择符中是选择 `li`的。`li` 的 parent 是 `ul`，`ul` 的第一个 child 是 `<a>`，第二个 child 是 `p`，第三个 child 就是 `<li>apple 1</li>`，所以它会被选中。

### 标准 （an + b）

如果你看看标准里对 nth-child 的语法定义：

    selector:nth-child(an + b){ properties }

它是这么解释的：

    The :nth-child() pseudo-class represents an element that has an+b siblings before it in the document tree, for any positive integer or zero value of n, and has a parent element.

其实就是说，将 selector 的父元素的所有子元素每 a 个分成一组，在每组中挑选第 b 个元素。

例如：

    <ul>
      <li>apple 1</li>
      <li>apple 2</li>
      <li>apple 3</li>
      <li>apple 4</li>
      <li>apple 5</li>
      <li>apple 6</li>
      <li>apple 7</li>
      <li>apple 8</li>
      <li>apple 9</li>
    </ul>

    ul li:nth-child(3n+2) {
      color: red;
    }

[在线演示](http://flanker.github.io/h5c3/nth-child/4.html)

就会选择 `apple 2`，  `apple 5`， `apple 8`。

### jQuery 的 eq() 方法

jQuery 的 nth-child 是完全按照 css 中 nth-child 的定义来的。但是 jQuery 还有一个 `eq()` 方法。他们之间有些差别。这个方法是选择匹配结果中的第 n 个元素，并且是从 0 开始计数的。

    <ul>
      <li class="mango">mango 1</li>
      <li class="mango">mango 2</li>
      <li class="apple">apple 1</li>
      <li class="apple">apple 2</li>
      <li class="apple">apple 3</li>
      <li class="apple">apple 4</li>
      <li class="apple">apple 5</li>
    </ul>

    $(function () {
      $('.apple:nth-child(3)').css('color', 'red');
      $('.apple').eq(3).css('color', 'blue');
    });

[在线演示](http://flanker.github.io/h5c3/nth-child/5.html)

这个结果是 `apple 1` 被 `nth-child` 设置成为红色，`apple 4` 被 `eq()` 设置成为蓝色。

### 总结

本文简介了 css 和 jQuery 的 `nth-child` 选择符，以及 jQuery 中的 `eq()` 方法。

