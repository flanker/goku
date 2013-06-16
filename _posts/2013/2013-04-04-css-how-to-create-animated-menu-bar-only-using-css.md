---
layout: post
title: "如何使用‘纯CSS’来实现菜单滑块效果"

published: true

tags:
- css
- hover
- sibling
- menu bar
- ":last-child"
- ":after"
- transition

type: post
status: publish
---

### 背景

很多网站的菜单栏都是一个 inline 布局的 ul/li 列表，为了突显，会在当前选择的菜单项目上加一个 background-color 或者 border 之类的，并且在用户 hover 到其他菜单项目上时，也会用一些样式来凸显。为了让这个效果更加好看，会使用一些技术来做成动画效果。如下图（gif）所示：

![菜单滑块动画效果]({{ site.static_url }}/images/2013/0404-animated-menu-bar.gif)

这个效果实现起来，使用 javascript 的话比较简单。我们可以通过处理 li 的 hover 事件，来动态的调整选择符的位置。

那么，可不可以通过纯 CSS 来实现这个菜单动态滑块效果呢？

### DOM 结构

菜单的 DOM 结构比较简单，就是一个 ul/li，通过一个 `selected` 来表示当前所选择的项目。如下代码：

<!-- more -->

    <ul>
      <li><a href="#">Goku</a></li>
      <li><a href="#">Krillin</a></li>
      <li><a href="#">Tien Shinhan</a></li>
      <li class="selected"><a href="#">Piccolo</a></li>
      <li><a href="#">Gohan</a></li>
      <li><a href="#">Vegeta</a></li>
      <li><a href="#">Frieza</a></li>
      <li><a href="#">Trunks</a></li>
      <li><a href="#">Cell</a></li>
    </ul>

我们可以在 css 的 `.selected` 上，和 `:hover` 上加上特殊的样式，来凸显他们。但是问题是，当 hover 的元素改变时，无法做到凸显样式在两个元素只见的滑动。

### 尝试一：CSS 的 sibling ~ 选择符

第一次尝试时，为了加入这个滑块效果，我修改了 DOM 元素。在 li 的最后添加了一个额外的 element 来用作滑块。

    <ul class="clearfix">
      <li><a href="#">Goku</a></li>
      <li><a href="#">Krillin</a></li>
      <li><a href="#">Tien Shinhan</a></li>
      <li class="selected"><a href="#">Piccolo</a></li>
      <li><a href="#">Gohan</a></li>
      <li><a href="#">Vegeta</a></li>
      <li><a href="#">Frieza</a></li>
      <li><a href="#">Trunks</a></li>
      <li><a href="#">Cell</a></li>
      <div class="bar"></div>
    </ul>

注意看上面多余的 `<div class="bar"></div>`。然后我们可以直接给 `.bar` 上来加样式。

    .bar {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 5px;
      width: 100px;
      background-color: red;
      transition: all 0.3s;
    }

这样子 bar 会是一个红色的边条。注意这里已经加上了 CSS3 的 `transition` 样式。这样子对 bar 的样式修改，会有一个 0.3秒的动画效果。

由于我们的动画是由 li 的 hover 来触发的，而需要修改样式的又是 bar，这个刚好可以使用 CSS 的 sibling `~`选择符号来实现。

    li:nth-child(2):hover~.bar { left: 100px; }

上面这句就是如果 hover 到了第二个项目时，给 bar 加一个 left 的偏移，使得 bar 移动到第二个菜单项目的下面。同时由于 bar 有 transition，所以这个就会以一个动态的效果完成。

同时，对于当前 selected 的项目，也通过 sibling `~` 选择符来完成：

    li:nth-child(4).selected~.bar { left: 300px; }

整个完整的效果可以看这里： [http://flanker.github.com/h5c3/01-menu/index.html](http://flanker.github.com/h5c3/01-menu/index.html)。可以看网页的源码和 CSS。

#### 尝试一的问题

这个方法的问题在于，它不是一个 ‘纯CSS’ 的实现。因为它修改了 DOM 元素，而这个修改仅仅是为了达到一个样式的的效果。

为了避免对 DOM 的直接影响，我们可以通过 Javascript，在 ul 中动态的插入这个 bar 元素。这样子避免弄脏 DOM，但是又引入了 Javascript 代码，也不是 ‘纯CSS’

### 尝试二：无 DOM 修改

还是得尝试下无 DOM 修改的方法。

在这次尝试中，我们不引入新的 bar 之类的额外元素，还是通过 li 元素自身的 background 或者 border 来加入选择效果。

首先，我们把最后一个 li 加上特殊的样式，让它绝对布局，并且具有一个红色的 border-bottom，以及 transition：

    li:last-child {
      position: absolute;
      right: 0;
      top: 0;
      margin-right: 0;
      border-bottom: 5px solid red;
      z-index: 99;
      transition: margin-right 0.3s;
    }

这样子对于 selected 或者 hover 的 li，我们依旧通过 sibling `~` 选择符，来修改最后一个项目 `li:last-child` 的 left，让红色 border 移动到选择的项目的对应位置：

    ul li:nth-child(2):hover~li:last-child { margin-right: 700px; }

上面的 css 通过给最后一个项目 `li:last-child` 加上一个 700px 的 margin-right 使其向左‘移动’了 700px。

这样子最后一个项目 `li:last-child` 内的文字也会被移动过去，为了让文字不变，我们给文字加入一个 -700px 的 margin-right 样式，让它保留在之前的位置：

    ul li:nth-child(2):hover~li:last-child a { margin-right: -700px; }

为了让移动后的最后一个项目 `li:last-child` 不覆盖其他的项目，需要控制他们的 z-index。

尝试二的效果可以看这里：[http://flanker.github.com/h5c3/02-menu/index.html](http://flanker.github.com/h5c3/02-menu/index.html)。可以看网页的源码和 CSS。

#### 尝试二的问题

尝试二的作为没有修改原有的 DOM，没有引入额外的 DOM 元素，并且也没有引入 Javascript 代码。它实现了菜单选择滑块的动画效果。

存在的一个问题是，当页面加载时候，滑块（border-bottom）需要从 `li:last-child` 移动到对应 margin-right 的 selected 项目上。而这个过程在 chrome 上会有一个明显的动画移动（Firefox 上是正常的）。这个初始加载的‘额外’效果不是很理想。

要清楚这个初始加载的动画效果，我们可以在初始 DOM 上加入一个 `page-loading` 的 class，在这个 class 下的所有 CSS style 都去除掉 transition。等页面 load 完毕时，通过 Javascript 将这个 class 去除掉就可以。但是这样子又引入了一些 Javascript。违背了我们最初的要求。

### 尝试三：使用 :after 伪元素

CSS 中有一个 `:before` 和 `:after` 伪元素，可以给 DOM 加入一个假的元素。通过这个，我们来加入一个伪元素，并设置其样式，把它当作滑块。

    li:last-child:after {
      content: ' ';
      display: block;
      height: 5px;
      width: 100px;
      background-color: red;
      transition: margin-left 0.3s;
    }

上面的 CSS 就是个最后一个项目 `li:last-child` 加入了一个 `:after` 伪元素，伪元素内容为空，是一个背景色为红色的方框。

当 hover 某一个 li 时，继续通过 sibling `~` 选择符，来修改最后一个项目 `li:last-child` 的 `:after` 伪元素的位移，让其向左挪动 600px：

    li:nth-child(3):hover~li:last-child:after { margin-left: -600px; }

对于 selected 的元素，使用同样的方法：

    .selected:nth-child(4)~li:last-child:after { margin-left: -500px; }

实际的效果看这里：[http://flanker.github.com/h5c3/03-menu/index.html](http://flanker.github.com/h5c3/03-menu/index.html)。可以看网页的源码和 CSS。

#### 尝试三的总结

尝试三没有引入额外的 DOM 元素，也没有引入额外的 Javascript。通过 `:after` 伪元素，以及 sibling `~` 选择符对伪元素的控制，实现了滑块效果。

这个效果在 chrome 和 Firefox 下试过，比较完美。（不存在尝试二中的页面加载初始化的问题）。

### 总结

为了使用‘纯CSS’来实现菜单滑块效果，这里给出了三个尝试。最后实现了在无 DOM 修改影响，无 Jascript 代码，仅仅通过 CSS 的 `:after` 伪元素，以及 sibling `~` 选择符，以及 `transition` 效果，实现了本文开始的动画效果。

三种实现都可以在 github 上看到。对其中的 html 和 CSS 可以直接查看源码

* [http://flanker.github.com/h5c3/01-menu/index.html](http://flanker.github.com/h5c3/01-menu/index.html)
* [http://flanker.github.com/h5c3/02-menu/index.html](http://flanker.github.com/h5c3/02-menu/index.html)
* [http://flanker.github.com/h5c3/03-menu/index.html](http://flanker.github.com/h5c3/03-menu/index.html)

