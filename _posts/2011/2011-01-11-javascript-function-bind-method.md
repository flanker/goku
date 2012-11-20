---
layout: post
title: javascript 函数的 bind() 方法

published: true
meta:
  _edit_last: "2"
tags:
- bind
- javascript
- development

type: post
status: publish
---
初学者文章，高手请路过 :)，今天被问到 JS 里的 bind，答不出所以然来，Google 学习了一下，作此记录。

`Function.prototype.bind` 这个方法是 ECMAScript 5 新增加的，在 Firefox 4/Chrome 中都支持，IE8 应该还不支持。

#### 简介：

创建一个 Function ，当这个新的 Function 被调用时，使用给定的 `this` 值所在的 Context，并且传入给定的参数序列。

#### 语法：

`var bound = fun.bind( thisValue, [, arg1 [, arg2 [ ... ] ] ] );`

#### 参数：

`thisValue`：当新的 Function 被调用时，`thisValue` 会付给其 `this` 值。如果使用 `new` 操作符调用 Function，则忽略 `thisValue`。

`arg1, arg2, ...`：当新的 Function 被调用时，当作参数列表传入，插入在调用时实际参数之前。

<!--more-->

#### 示例一： 通过 `bind()` 修改函数调用时的 `this`

    // 显式作用域
    var x = 9,
        module = {
          getX: function() {
            return this.x;
          },
          x: 81
        };

    //  调用`module.getX()`，作用域为`module`，所以返回`module.x`
    module.getX();
    // > 81

    //  在全局作用域中保存一个函数的引用
    var getX = module.getX;

    //  调用`getX()`，作用域为全局，所以返回`x`
    getX();
    // > 9

    //  使用`module` bind作为作用域保存一个引用
    var boundGetX = getX.bind(module);

    //  调用`boundGetX()`，作用域为`module`，所以返回`module.x`
    boundGetX();
    // > 81

#### 示例二： 通过 `bind()` 传入参数

    // 创建一个函数，使用预设的开始参数调用另一个函数
    function List() {
      var a = [];
      for (var i = 0; i < arguments.length; i++) {
        a.push(arguments[i]);
      }
      return a;
    }

    //  创建一个 list
    var listOne = List(1, 2, 3);

    listOne;
    // >  [1, 2, 3]

    // 创建一个新函数，给定一个预置的参数
    var leadingZeroList = List.bind(null /* this */, 0);

    leadingZeroList();
    // > [0]

    leadingZeroList(1);
    // > [0, 1]

    leadingZeroList(1, 2);
    // > [0, 1, 2]

最后，要注意的是：

* 在使用 `new` 操作符调用 `bind` 创建的新函数时，`this` 不会被修改，但是参数还是会修改；
* `bind` 并不被所有浏览器支持，IE 目前不支持。

#### P.S.

参考 [mozilla developer](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind)

ECMAScript 是标准，ECMA-262，目前最新的是第5版。一般 Firefox 的实现叫做 JavaScript（最新在 Firefox4中支持到 JavaScript 1.8.5）；IE 中的实现叫 JScript。两者都是支持 ECMAScript 第三版的，但是对第五版的支持可能就不完全了。
