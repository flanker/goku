---
layout: post
title: "前端页面替换文本的方法和一些小技巧"

published: true

tags:
- css
- javascript
- swapping text
- front-end

type: post
status: publish
---

### 背景

在前端页面上，有的时候我们需要根据用户行为，替换的显示文本。比如 “显示/隐藏”、“展开/收起”。这是一个很常见的功能，实现起来也没有太大的难度。

CSS Tricks 有一篇文章谈及“替换文本的五种方法”（[Swapping Out Text, Five Different Ways](http://css-tricks.com/swapping-out-text-five-different-ways/)）。在这篇文章里，作者总结了使用五种实现方法，并且在评论里和很多读者进行了一些讨论分析。我在这里总结一些值得注意的东西。

很常见的一个场景是，有一个按钮，其文本需要在 "show" "hide" 之前交互替换显示。html 示例如下：

    <button data-text-swap="Show">Hide</button>

<!-- more -->

### 纯 Javascript/jQuery 实现

使用 Javascript 或者 使用 jQuery 都可以很轻易的实现这个功能。下面是作者给出的一个实现：

    $("button").on("click", function() {
      var el = $(this);
      if (el.text() == el.data("text-swap")) {
        el.text(el.data("text-original"));
      } else {
        el.data("text-original", el.text());
        el.text(el.data("text-swap"));
      }
    });

这段代码虽然看着较为臃肿，不过它确实是一个较好的实现。没有侵入 html，没有污染网页的可访问性（Accessibility）。html 和 Javascript 也很好的实现了分离，使得 Javascript 有着可重用性（Reusability）。

譬如在评论中，有读者说为什么不直接使用 `$("button").text("Hide");` 这样子直接修改文本。这种做法虽然简单，但是使得数据一部分维护在 DOM、一部分维护在 Javascript。并且 Javascript 由于没有分离关注度，导致不可重用（如果另一个 button 是 "More"/"Less" 的话）。

### CSS + Javascript

Javascript 可以在用户行为发生时，仅仅修改 DOM 的 ClassName，借助于 CSS 来实现文本的替换。

首先，当目标 element 有 `on` 这个 Class 时，使用 `:after` 伪元素，给原 element 覆盖上一个新的文本。

    a {
      position: relative;
    }
    a.on:after {
      content: "Hide";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
    }

Javascript 只需要在 `element.click` 时，给其添加或者去掉 `on` 这个 class 即可：

    $("a").on("click", function() {
      $(this).toggleClass("on");
    });

这个方法使得 Javascript 只需要修改 class，再由 CSS 来决定如何显示。其实这里只是探讨实现方法而已，在实际中不推荐这样使用。虽然 CSS 是负责样式的，但交替显示文本应该超出了“样式”的范畴。

同样有读者问，为什么不放两个真实的 element，再由 class 来决定显示哪个：

    <span class="btn show-default">
      <span "text-default">show</span>
      <span "text-altered">hide</span>
    </span>

    .show-default > .text-altered { display:none; }
    .show-altered > .text-default { display:none; }

这种做法只能说是从外部来看，实现了结果，但它明显破坏了可用性（Accessibility）,污染了html DOM，，所以更加糟糕。

### 纯 CSS 实现

（最近几篇 blog 好像都喜欢给出 纯 CSS 实现哈）

其实，在前端开发中，我们经常使用 `:hover` 等伪类，通过 CSS 来实现用户鼠标悬浮到某一元素上时，元素样式的修改。但是这里，引发文本替换的条件是鼠标的点击，CSS 本身是无法捕获鼠标事件的。所以如何监控鼠标点击事件是个问题。

有一个方法，就是通过一个隐藏的 `checkbox` 来实现。我们可以通过 CSS 配置一个 `:checked` 伪类的规则。

但是隐藏的 `checkbox` 也是不可点击的，这里就需要使用 `label` 标签。`label` 可以通过 `for` 属性来关联一个 `input` 控件，用户点击 `label` 时，也会触发对其关联 `input` 控件的事件。用 `label` wrap 住 `input` 控件也会实现类似的效果。

代码如下：

    <input id="example-checkbox" type="checkbox">
    <label for="example" id="example">Show</label>

    #example {
      position: relative;
    }
    #example-checkbox {
      display: none;
    }
    #example-checkbox:checked + #example:after {
      content: "Hide";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
    }

当用户点击 "Show" label 时，会将其关联的 checkbox 也 check 上。在通过 `:checked` 和 `:after` 两个伪类伪元素，在 checkbox 选择上后，绘制一个 "Hide" 元素，覆盖住原有文本。

这种做法是很巧妙，但是实际使用性估计很低，其于代码可读性维护性都不高。

有一个读者给出了改进，可以放 Show 和 Hide 都放置在 DOM 中，而非分散在 CSS 中。就是使用 CSS 中的 `attr`：

    <input id="example-checkbox" type="checkbox">
    <label for="example" id="example" data-text="Hide">Show</label>

    #example {
      position: relative;
    }
    #example-checkbox {
      display: none;
    }
    #example-checkbox:checked + #example:after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
    }

### 一些小技巧

1. 通过 隐藏的 input 和显示的 label，可以通过 CSS 来 “捕获” 用户的鼠标点击事件。

2. 关注度分离！ html、CSS、javascript 还是应该各司其职。这样子的代码拥有更好的可读性、可维护性，也可以更好的测试、更好的重用。

3. 有一个读者给出了 Javascript 的一个[实现](http://jsfiddle.net/vmJ5h/)：

        <span data-swap="Hide">Show</span>

        $('span').on('click', function () {
            var el   = $(this);
            el.data('swap', [el.text(), el.text(el.data('swap'))][0]);
        });

    这个实现的特点在用 swap 两个文本，他巧妙的使用数组。这样子可以不实用多余的变量，或者 "if" 语句。比较巧妙。

[作者五种方法的 codepen 地址](http://codepen.io/chriscoyier/pen/bcyEA)

个人觉得目前，一般情况下，还是使用 Javascript 实现（使用 `data-` 属性来储存交换的文本）比较好。其他的实现还是作为学习技巧来学习吧。
