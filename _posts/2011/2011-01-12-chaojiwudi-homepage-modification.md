---
layout: post
title: 超级无敌首页的小修改

published: true
meta:
  _edit_last: "2"
tags:
- dot link
- inline-block
- other

type: post
status: publish
---
晚上对 [超级无敌](http://chaojiwudi.com/ "超级无敌 - 冯智超的个人网站") 的首页做了少量修改。第一是添加了 dot link。其实我也不知道那个怎么叫，就是一排小圆点，用来表示当前显示的页面。iPhone 中页面切换使用了这个，Web 上也就很常见了。超级无敌的首页本身就有很多卡片可以左右切换，所以加上 dot link 效果更好。第二就是重构了首页卡片切换的 javascript，之前的代码写的比较恶心，几乎就是一个大方法内全部搞定，并且还有一个 bug（卡片切换时会闪动一下）。现在重构为若干小方法，每个方法功能简单、单一、明确，并且容易理解（我自己的感觉啊～）。

另外学到一个知识是，dot link 是一个 ul/li/a，因为 li 中的 a 是没有内容而直接设置了 height/width 的，所以对 li/a 设置了 `display: inline-block`。但是 IE7 是无法正常处理 `display: inline-block`，需要 hack 一下，对其设置 `display: inline`，让其作为内联对象呈现，然后使用 `zoom: 1` 触发其 layout 即可。
