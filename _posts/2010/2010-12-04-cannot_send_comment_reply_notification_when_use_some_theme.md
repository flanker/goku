---
layout: post
title: 解决某些主题情况下 WordPress 不能给评论留言回复发送邮件通知的问题

published: true
meta:
  _edit_last: "1"

tags:
- wordpress
- development
- mail
- reply

type: post
status: publish
---
虽然目前我的博客还有没有几个人浏览，更没有人评论留言。但是我自己测试发现，在博客上评论留言，当有人回复评论时，我的博客不能正确给被回复的评论作者发送邮件通知。

由于自己没怎么深入玩过 WordPress，有没有搞过 PHP，就只好先 Google 之，然后开始折腾了。

最先怀疑的当然就是 WordPress 邮件是否能正常发送，但这个很容易排除。我的博客是 Godaddy 的 Windows 主机，网上很多人也都遇到说 Windows 主机配置邮件通知比较麻烦，好象是 Godaddy 的 Windows 主机禁用了 PHP 的 `mail()` 函数（看来以后还是有必要把博客迁移到 Linux 主机上）。但是 Godaddy 的 Windows 主机支持通过 SMTP 发送邮件，可以使用 [WP-Mail-SMTP](http://wordpress.org/extend/plugins/wp-mail-smtp/ "WP-Mail-SMTP 主页") 或者 [Configure SMTP](http://wordpress.org/extend/plugins/configure-smtp/ "Configure SMTP 插件主页") 等插件来发送邮件（配置都比较简单，我用的是 WP-Mail-SMTP）。然后评论留言回复邮件通知也有很多插件，比如 [Wordpress Thread Comment](http://wordpress.org/extend/plugins/wordpress-thread-comment/ "Wordpress Thread Comment 插件主页") 和 [Comment Reply Notification](http://wordpress.org/extend/plugins/comment-reply-notification/ "Comment Reply Notification 插件主页")。我用的是后者，插件功能相对简单一些。

<!--more-->
使用了 WP-Mail-SMTP 后，发送测试邮件成功。当有人在博客上发表评论留言时，我的博客管理员邮箱也能收到评论留言通知：“某某某在你的博客文章某某某某上发表了评论某某”。这说明 WordPress 的邮件发送没有问题了。但是，当A发表一个评论后，如果有B来回复这个评论，A留下的邮箱还是收不到评论通知。

然后就去检查 Comment Reply Notification 是否配置正确，看其说明是配置正确的，但是结果还是什么都没有。只好硬着头皮打开插件编辑器看他的 PHP 代码了。

由于是头一次看 WordPress 插件 和 PHP 的代码，只能通过搜索 `mail reply comment` 等关键字，折腾半天才有收获。首先发现 `mailer($id,$parent_id,$comment_post_id)` 应该是最终发送邮件的函数。这个函数中发现如下代码：

    $pc = get_comment($parent_id);
    if(empty($pc)){
        unset($pc);
        return false;
    }

`$id` 是当前评论，`$parent_id` 就是它回复的评论了。如果根据 `$parent_id` 找不到评论的话，那 `mailer()` 就退出了，当然不会发送邮件。

然后搜索函数调用关系，`mailer()` 函数是通过 `email()` 函数调用的，`email()` 函数是通过 add_action('comment_post', array(&$this,'email'),9999); 注册的。而 $parent_id 参数是通过 `$_POST['comment_parent']` 从 POST 请求中得到的。

马上打开 Chrome 监控 Network，点击某一条评论的回复，提交评论，结果：

![comment-parent 0](/images/2010/comment-parent-0.png)

果然 `comment_parent` 是 0。怪不得 Comment Reply Notification 不发送邮件通知呢。

想想看，这个 `comment_parent` 是在 `<input type="hidden" name="comment_parent" id="comment_parent" value="0">` 里的，那应该是通过 Javascript 来设置的。通常情况下，安装了 Comment Reply Notification 这一类的插件后，他应该在评论旁的【回复】按钮上注册事件，将被回复评论的 `Id` 赋值给 `comment_parent`。但现在看来我的博客并没有这一步。

继续用 Chrome 检查 Elements 和 Scripts，发现所有的【回复】按钮都被注册了下面这个事件处理：

    <a href="javascript:void(0);" onclick="MGJS_CMT.reply('commentauthor-201', 'comment-201', 'comment');">回复</a>

这个函数是在 comment.js 文件中，函数如下：

    function reply(authorId, commentId, commentBox) {
        var author = MGJS.$(authorId).innerHTML;
        var insertStr = '<a href="#' + commentId + '">@' + author.replace(/\t|\n|\r\n/g, "") + '</a> \n';
        appendReply(insertStr, commentBox);
    }

其实现的是点击回复时，将原评论的内容处理后添加到评论留言板里。原来这个就是元凶啊～

这段 Javascript 是我使用的主题 [Piano Black](http://wordpress.org/extend/themes/piano-black "Piano Black 主题主页") 添加的。但是我找了一下也没有找到默认主题是在哪里注册【回复】按钮的事件（或许默认主题没有【回复】），但是也没有找到 Comment Reply Notification 在哪里添加【回复】按钮或和注册事件。

算了，不折腾了，直接修改强行赋值就OK了：

    function reply(authorId, commentId, commentBox) {
        var author = MGJS.$(authorId).innerHTML;
        var insertStr = '<a href="#' + commentId + '">@' + author.replace(/\t|\n|\r\n/g, "") + '</a> \n';
        appendReply(insertStr, commentBox);
        var parentId = commentId.substring(8);
        MGJS.$('comment_parent').value = parentId;
    }

用最简单的方法，在 reply 时给 `comment_parent` 赋上正确的 `Id` 就行了。

现在，给一个评论留言回复后，终于可以收到邮件通知了。

![Comment-Reply-Notification](/images/2010/Comment-Reply-Notification.png)
