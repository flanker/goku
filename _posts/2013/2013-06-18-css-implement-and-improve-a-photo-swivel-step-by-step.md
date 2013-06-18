---
layout: post
title: "一步一步实现并改进一个旋转照片功能 (Photo Swivel)"

published: true

tags:
- css
- css3
- photo swivel

type: post
status: publish
---

### 背景

css-tricks 前一阵子有一篇投稿，是一个旋转照片 (Photo Swivel) 功能的实现。（[css-tricks 上的文章](http://css-tricks.com/photo-swivel/)，以及 [作者 Alex 的原文](http://www.alexandery.net/jquery-head-turn-tutorial/)）。说实话我也不知道 Photo Swivel 这个东西该怎么翻译，但是这个效果在展示物品的页面上，对提升用户交互能力确实很有帮助。

该效果就是展示一个物品时（比如衣服或者眼镜），随着用户鼠标滑动位置的不同，显示不同的图片，来显示物品响应的角度外观。[看实例](http://codepen.io/flanker/pen/yhIbK)，在图片上移动鼠标看看 (这个是最初的实现方法)。

这篇文章给出实现后，在文章的评论中，也有很多人给出了改进的更好的实现。这里我们做一下介绍和分析。（一定要看完啊，后面的改进也很棒）

### 最初的实现

Alex 的实现中，首先我们需要 7 张该目标不同方位的图片。这里他使用一个较复杂的 div DOM 结构将图片 wrap 起来，方便之后的处理。 html 如下：

<!-- more -->

    <div id="faces">
      <div id="face-area">
        <div id="image-1" style="display: none;">
          <img src="/images/look-left-3.jpg">
        </div>
        <div id="image-2" style="display: none;">
          <img src="/images/look-left-2.jpg">
        </div>
        <div id="image-3" style="display: none;">
          <img src="/images/look-left-1.jpg">
        </div>
        <div id="image-4" style="display: none;">
          <img src="/images/look-center.jpg">
        </div>
        <div id="image-5" style="display: none;">
          <img src="/images/look-right-1.jpg">
        </div>
        <div id="image-6" style="display: none;">
          <img src="/images/look-right-2.jpg">
        </div>
        <div id="image-7" style="display: none;">
          <img src="/images/look-right-3.jpg">
        </div>

为了监听鼠标滑动到的位置，Alex 又创建了 7 个 element，用于平均的分成 7 个纵列，覆盖在图片上。html 如下：

        <div id="the_faces_overlay">
          <div class="the_faces" data-number="1"></div>
          <div class="the_faces" data-number="2"></div>
          <div class="the_faces" data-number="3"></div>
          <div class="the_faces" data-number="4"></div>
          <div class="the_faces" data-number="5"></div>
          <div class="the_faces" data-number="6"></div>
          <div class="the_faces" data-number="7"></div>
        </div>
      </div> <!-- END #face-area -->
    </div> <!-- END #faces -->

下一步我们需要使用 CSS，让 7 个 overlay 完整的覆盖在图片上，并且在宽度上是均匀分割的。CSS 比较自解释，需要注意的是 `.the_faces` 的 `width: 14.2857143%;` 平均分配。CSS 如下：

    body {
      background: #333;
    }

    #faces {
      height: 333px;
      width: 500px;
      margin: 0 auto;
      border: 8px solid white;
    }

    #face-area {
      height: 500px;
      width: 333px;
      position: relative;
    }

    #the_faces_overlay {
      position: absolute;
      width: 500px;
      top: 0;
      left: 0;
    }

    #faces .the_faces {
      height: 333px;
      width: 14.2857143%;
      float: left;
      margin: 0;
      padding: 0;
    }

然后 Alex 通过 Javascript 来监听 7 个 overlay 元素上的 `mouseover`、 `mouseout` 事件，来判断鼠标的位置，以次来通过 JS 显示响应角度的图片，隐藏其他图片。 JS 如下，也比较简单：

    // Reveal the "center" image
    var centerImage = $("#image-4").show();

    // Bind hovers to each column
    $(".the_faces").each(function() {
      $(this).on("mouseover", function() {
        $("#image-" + $(this).attr("data-number")).show();
      }).on("mouseout",function() {
        $("#image-" + $(this).attr("data-number")).hide();
      });
    });

    // Reset center image
    $("#face-area").on("mouseleave", function() {
      centerImage.show();
    }).on("mouseenter", function() {
      centerImage.hide();
    });

这个实现的结果可以 [看这里](http://codepen.io/flanker/pen/yhIbK)

### 这个实现好吗？

当然原文作者实现的效果是很不错的，完美的达到了所预期的效果。但是实现方法的细节嘛，还是有很多应该改进的地方。

最大的问题就是，这个实现的 CSS 和 JS 有很大的污染，他们“侵入”了 HTML DOM 代码。

* 首先，注意看到 `#the_faces_overlay` 里面所有的元素都是没有任何 content 的。当我们看到一个 start tag 和 end tag 之间没有任何 content 时，就是一个坏味道，应该想想这个实现是不是有问题。是否仅仅为了样式上或者行为上的需要，而被迫修改了我们的内容。

* 其次，从内容上来看，这段 HTML 希望展示的是一系列角度不同的图片。从语义上来讲就是一个 image list。但是这个最初的实现使用了三层 `div` 元素（`#faces`、 `#face-area`、 `#image-1`）来 wrap 这个 `img`，这也是为了样式的需要，对于 DOM 来说是不完美和多余的。(一个 ul/li 列表会好很多)。

* 最后，这个实现依赖于 Javascript。当然不是说用 JS 不好，JS 本身也很大程度上是负责了页面的行为（这个也可以算是行为了吧？吗？）。但是如果仅仅对一个样式上的 fancy 效果，如果，能够不依赖于 JS，那肯定是更上一层楼。（CSS3 很多就是来解决这个的）

那几个大大的 `style="display: none;"` 就更不用提了。

### 改进的实现

在文章评论的一片 "awesome"、 "cool" 中，也有些人给出了自己的改进，主要也是针对我们上面提到的一些问题。

比如 [这位 Dave 同学的实现](http://jsfiddle.net/dilapper/BQjBm/)，大大简化了 DOM（去除了 wrap 用的 div，以及仅仅用来做 overlay 的 div）。通过 Javascript 来监听整个 `#face-area` 上的 `mousemove` 事件，再通过 event 上的 pageX 和 DOM 的 offset 计算出 鼠标的相对图片的位置，依此来决定需要显示哪张图片。这个实现的 HTML 和 CSS 已经比较简洁。（但是一大堆 `img` tag 堆在那里实在是不好看啊，为什么大家都不喜欢 list 呢？）

[这位 Anthony 同学马上对 Dave 的进行了改进](http://jsfiddle.net/jsdev/X2y9f/2/)，`id="image-4"` 这个就根本不需要的，jQuery 的 `.eq()` 就可以选择对应的 image 了。(广告：[CSS nth-child 选择符，以及 jQuery 中 nth-child 和 eq() 的区别](/2013/05/css-jquery-nth-child-selector-and-different-between-nth-child-and-eq/))。

其他的一些回复也给出了一些小修改已经浏览器兼容问题的修复，这里就不一一讲述了，因为...

### 纯 CSS 无 html 污染 无 Javascript 的实现！

最后，[Eduardo 同学给出了纯 CSS 无 html 污染 无 Javascript 的实现](http://jsfiddle.net/coma/BZajk/11/)，（我也很喜欢 纯 CSS 无 html 污染，无 Javascript，可以看我之前几篇 纯“CSS” 实现的文章）。

首先给出 DOM，可以说是很“正确”的，一个 image 的 list。即使无 CSS 无 JS 也能表达出我们这是一组产品图片。HTML 如下：

    <ul id="faces">
      <li><img src="/images/look-left-3.jpg"/></li>
      <li><img src="/images/look-left-2.jpg"/></li>
      <li><img src="/images/look-left-1.jpg"/></li>
      <li><img src="/images/look-center.jpg"/></li>
      <li><img src="/images/look-right-1.jpg"/></li>
      <li><img src="/images/look-right-2.jpg"/></li>
      <li><img src="/images/look-right-3.jpg"/></li>
    </ul>

然后是 CSS，先看看，如下：

    body {
        background-color: #222;
    }

    #faces {
        list-style: none;
        padding: 0;
        width: 400px;
        height: 533px;
        margin: 20px auto;
        border: 8px solid white;
        position: relative;
    }

    #faces > li {
        padding: 0;
        margin: 0;
        width: calc(100% / 7);
        height: 100%;
        float: left;
    }

    #faces > li + li > img {
        opacity: 0;
    }

    #faces > li:hover > img {
        opacity: 1;
    }

    #faces > li > img {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
    }

* 首先是 `#faces > li` 的 `width: calc(100% / 7);`，讲每一个 list item 的宽度平均分配。这样子每个 li 就只占有 1/7 的宽度。(关于 calc 的用法，可以 [google 之](http://www.google.com.hk/#q=css+calc))。

* 其次讲 img 的 `opacity: 0` 设置为透明，但是 li:hover 下的 img 是 `opacity: 1` 的来显示出 hover 的图片。

* 最后将这些 img 的 `position: absolute` 绝对布局，然后四边都是距离为 0，使他们都占满 `#faces` 整个 ul 容器。

整个实现也没有使用非常高级的 CSS 样式，就是讲 li 均分宽度，img 又铺满容器，使用 `:hover`  伪类这种最最常见的方法来显示对应的图片，非常巧妙，基本上可以算是比较完美的做法。(不用 calc 的话，也可以 hardcode 为 14.2857143% 的宽度)。

### 总结

当然原作者最初的实现也是一个尝试，作者也提到了这种抛砖引玉引起大家讨论改进的结果非常好。作为总结的话，我们可以说，虽然都是实现了完全一致的效果，从用户的角度来看都是一样的，但是从开发的角度，从浏览器的角度，都可以看到不同的一面。

作为一个开发人员，在实现一些 fancy 的页面效果时，也应该多想想，是否是在正确的使用 html tag 元素和 attribute 属性，是否为了达到样式而污染了我们的 DOM，不需要 javascript 能否也能达到希望的样式，是否遵循了页面各司其职、渐进增强的一些原则。（作为一些折中，我宁可在样式效果上作出一些让步也可以，也不希望写出很混乱的 DOM/CSS，和很复杂的 JS）。




