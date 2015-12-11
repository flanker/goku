---
layout: post
title: Backbone.js 一些实践

published: true
meta:
  _edit_last: "1"
tags:
- backbone.js
- web development
- javascript
- jasmine

type: post
status: publish
---

在最近的一个 Web 应用项目中，我们团队使用了 Backbone.js 作为前端框架，在此文中，主要会讲我们团队使用 Backbone.js 过程中的一些比较好的实践拿来和大家共享。

按照 Backbone.js 的官方文档介绍，Backbone.js 提供了 key-value 和自定义事件的模型、带有丰富枚举方法 API 的集合、声明式事件绑定的视图，以及把这些通过 RESTful JSON 格式接口与现有程序 API 的连接。

#### 1. 前后端的完全解耦

该项目是一个 Ruby on Rails 框架网页应用，借于 Rails 天生对 RESTful API的优秀支持，我们团队将该 Rails 应用完全作为一个 RESTful API 来使用。对于我们的核心业务模型，后端只提供其增删改查 API，所有功能均通过 JSON 格式与前段交流。讲 Ruby 对象渲染成为 JSON 相对比较容易，这样大大减少了后端视图层面开发的复杂度。对于后端的测试，更是只需要 rspec 类似的单元测试就可以覆盖到绝大部分的功能。

#### 2. 前端为 Single Page Application 单页面应用

Backbone.js 作为一个前段 MVC 应用框架，我们完全可以将其视为一个类似于 Rails 的应用程序，只不过其运行环境是在客户端的浏览器中。Backbone.js 的 Router 支持对浏览器 URL 中 #(hash) 符号后字符串的捕捉和解析，通过它来形成一个 RESTful 的应用。

<!-- more -->

当然这里说的 Single Page Application 单页面应用，也不是指必须讲所有页面都纳入到一个应用中。由于项目的复杂度，我们讲整个项目划分为了若干 Single Page Application 模块，每个模块由其自己的 Router 等处理。类似于下面的 URL 结构：

    http://hostname/top_module_1#resouces/params
    http://hostname/top_module_2#other_resouces/params

#### 3. 在前段渲染 HTML

刚才提到项目后端只负责 RESTful API，所以我们所有的 HTML 渲染都是在前端进行的。在 Backbone.js 创建 View 视图并渲染时，我们通过加载 View 视图相应的 haml template 来将 HTML 渲染出来。所有的 haml template 都是经过在客户端预编译并缓存起来的。这样在大大减少了服务器压力的情况下，也使得客户端性能维持在一个较为理想的可接受的程度。

![Backbone.js Client Side Html Render]({{ Configr.site['static_url'] }}/images/2012/backbone-js-client-side-html.png)

如上图所示，View 和它对应的 Model 数据，以及它所对应的 haml template 构成了一个相对完整的独立的模块，该模块有其独立的 DOM 元素和功能。

#### 4. 使用 Sub View

在项目中我们坚持细化 View 的粒度，将 View 从整个页面开始一层一层的细分下去，最终的 Sub View 是需要负责尽可能最小的一个基本单元（比如一个下拉菜单）。而高层次的 Parent View 只需要各个 Sub View 调用渲染后添入页面 Document 中即可。

![Backbone.js Sub View]({{ Configr.site['static_url'] }}/images/2012/backbone-js-sub-view.png)

细化 Sub View 的好处是使整个页面程序易于开发和维护。以上图为例，对于 `NewPageView` 来说，它持有整个 `Model` 对象。但是 `NewPageView` 不需要知道处理细节，它只需要三个 `businessType`、 `basicInfo`、 `otherInfo` 分别调用对应的 Sub View 来处理即可。同理，`BasicInfoView` 也会讲它得到的 `basicInfo` 中的各个字段调用对应的 Sub View 来处理。例如 `StartDateView` 将会处理 `startDate` 字段。细化到最底层的 Sub View将会是一个很简单的 Backbone View。

结合本文第四小节，Sub View 将会持有它所关心的数据 Model，并且拥有其对应的 haml template。所以一个 Sub View 将会是一个完整的独立的页面元素。而Parent View 只需要负责将各个 Sub View 讲乐高积木一样搭建成整个页面即可。

这样带来的另一个好处就是易于测试，因为对 Sub View 的测试可以不依赖于其他任何 View 和 Model，使得我们可以很方便的测试一个 Sub View 是否正确。

#### 5. 使用 Nested Model

在 Backbone.js 中 Model/Collection 的功能也十分强大，可以很方便的通过 JSON 数据来创建响应的 Model 和 Collection。虽然 Backbone.js 没有提供对 Nested Model 提供原生支持，但是目前有很多的 Backbone.js 插件提供了这个功能。通过 Nested Model，可以使得我们在 `fetch` 数据时直接获得具有良好层级关系的 Parent-Child Model。这样也方便我们讲 Child Model 传给 Sub View 来渲染。

![Backbone.js Nested Model]({{ Configr.site['static_url'] }}/images/2012/backbone-js-nested-model.png)

#### 6. View 之间的通讯

现在的 Web 应用程序十分强调页面的交互性。由于我们已经讲整个页面分割成为了大量的 Sub View 来处理，所以不可避免的问题是，一个 View 如果伴随用户的一下操作来作出响应。

我们的做法简单来说，一个 View 需要保持自己的独立性，不需要也不应该知道它外面的世界，View 只应该通过自己持有的 Model 的事件来做出响应。在 View 的响应中，除了对自己的 DOM 元素进行修改外，不应该去操作 Document 上的其他元素，而是应该根据实际的业务来对 Model 进行相应的处理。

假设我们页面上有两个控件，“国家”和“城市”，均为下来菜单来供用户选择。当用户改变了“国家”控件的值时，“城市”控件的可选项应该相应的改变。

![Backbone.js View Interaction]({{ Configr.site['static_url'] }}/images/2012/backbone-js-view-interaction.png)

如上图所示，CountryView 和 CityView 的 Model 都是 AddressModel，在渲染的时候，两个 View 分别通过 AddressModel 中不同的字段来渲染出对应的 HTML。同时，CountryView 持有一个 DOM 元素的事件处理————当用户改变“国家”下拉菜单的值时，CountryView 会更新 AddressModel 对应的值。CityView 在初始化时，创建了一个对 AddressModel 的 `“change:country”` 事件处理，所以当 AddressModel 的 Country 改变时，CityView 会调用 `render` 方法来重新渲染相应的 DOM HTML。

这样，CountryView 和 CityView 根本不需要知道对方的存在，二者所有的代码都是针对自身以及自身关心的数据。这样的解耦也使得测试十分方便。对于 CountryView 的测试我们只需要检测DOM的修改十分能反馈到 Model 上，对于 CityView 的测试我们只需要检测Model修改时，CityView 是否能响应改变。

#### 7. 自动化数据收集

在第六条中，用户对 DOM 元素的修改会使得 Model 数据的改变。对于一些常见的 Web Application，绝大多数的 TextBox、 CheckBox、 DropdownList 等等这些控件，都是需要收集数据到响应的 Model 上的。虽然 Backbone.js 框架的 View 没有默认提供数据自动收集，但是有很多插件可以完成这个功能。

我们项目中使用在 template 声明式的完成数据绑定，在通过扩展 Backbone.View 来实现一个 BaseView，加入对常见控件数据收集事件处理。项目中的其他 View 都扩展自这个 BaseView。

![Backbone.js Data Collection]({{ Configr.site['static_url'] }}/images/2012/backbone-js-data-collection.png)

#### 8. View 的 Render 方法

View 的 Render 方法是 View 最重要的逻辑，我们需要保证 View 的 Render 方法没有副作用，在 Model 没有改变的情况下，View 的 Render 应该具有幂等性，在 Model 改变的情况下，View 的 Render 也应该是正确反映改变到 DOM 元素上。即任何时刻调用 View 的 Render 方法，都应该在 DOM 上得到正确的结果。

这样的情况下，View 的改变就非常容易，我们不需要在 View 中单独的控制每一个细节的处理，当相应的 Modle 发生改变时，只需要重选调用 Render 渲染即可完成。

#### 9. 在 View 的操作时使用 Scope

通过 Sub View 我们使得页面变为了很多独立的小 View，每个 View 只管理自身的处理并且对外界一无所知。但是，当在 View 中做页面 DOM 处理时，一定要使用 Scope，来保证当 View 真实的运行时，所有操作都是在自己 DOM 中而非整个 Document DOM 来执行的。

    $(“.some-class-name”, this.el).doSomeThing();

#### 10. 用 Template 来标记 Sub View 的位置

使用了 Sub View 之后，对于 Parent View 来说，它仅仅负责调用每一个 Sub View 并把它添加到 Document 中。Sub View 添加到 Document 的位置不应该由方法调用的顺序等来决定，位置应该有 Parent View 的 template 来决定。

![Backbone.js View Template Position]({{ Configr.site['static_url'] }}/images/2012/backbone-js-view-template-position.png)

以上是我们项目中使用 Backbone.js 所总结出来的一些实践。在这些实践下，我们发现对于一些典型的负责的 Web Application 应用，前端页面将会易于开发和维护，并且对于测试十分的友好。（在我们的项目中，前端 Javascript 全部使用 Jasmine 进行单元测试，覆盖率达到了 95% 以上。 ）希望这些总结可以给大家带来帮助，如果朋友们有其他建议或者好的实践，也希望能和大家多多交流。



