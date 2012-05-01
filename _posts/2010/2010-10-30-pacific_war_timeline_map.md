---
layout: post
title: 太平洋战争-时间线地图 Pacific War Timeline Map

published: true
meta:
  _edit_last: "1"
tags:
- google map
- javascript
- timeline
- development

type: post
status: publish
---
抽出时间写了一个 javascript 小东西, 太平洋战争的时间线地图.

在线预览地址: [http://chaojiwudi.com/PacificWar/](http://chaojiwudi.com/PacificWar/ "Pacific War Timeline Map")

![pacific war timeline map](/images/2010/pacific_war_timeline_map.png)

在这里使用到了 [SIMILE Timeline](http://www.simile-widgets.org/timeline "SIMILE Timeline") 作为时间线, [Google Map](http://code.google.com/apis/maps/documentation/javascript "Google Map API") 作为地图, 使用 JSON 作为数据格式.

把这两个整合在一起作为了 TimeMap, 写成了一个 Javascript 小库: [timemap.js](http://chaojiwudi.com/PacificWar/timemap.js "Timeline Map Javascipt Library")

使用起来很简单, 两句JS:
    var timelinemap = new Timemap({ timeId: 'tl', mapId: 'map' });
    timelinemap.loadJson('data_pacific_war.js');

现在还很简陋, 很多东西都是写固定了, 没有可配(因为目前主要用来展示这个Pacific War了), 等以后有时间再慢慢改进吧.

做这个小玩意还是有收获的, 以前对 Javascript 学的不深, 只是简单用一些现有的库. 这次自己写一个类, 虽然很小很简单, 但也更进一步的掌握了Javascript中类及闭包等. 别看都说Javascript简单, 其实水还是很深的.
