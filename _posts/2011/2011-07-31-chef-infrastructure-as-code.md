---
layout: post
title: Chef - Infrastructure as Code
published: true
meta:
  _edit_last: "1"
tags:
- chef
- knife
- development

type: post
status: publish
---
程序员开发一个项目需要哪些步骤，需求、设计、编码、测试、构造、部署。任何一个步骤，单单的靠手工来完成肯定会有很多问题，比如效率、可重复性、团队知识分享等，如果这些步骤都是靠代码来实现的，那就能解决这些不足。对于需求设计，业务人员也可以将验收条件（Acceptance Criteria）写成 [Cucumber](http://cukes.info/) 的 feature；对于编码，那肯定是代码来实现；对于测试，可以通过单元测试、自动化测试来完成；对于构造，可以通过构造工具构造脚步来完成，比如 [buildr](http://buildr.apache.org/)。

那么部署呢，如何创建基础设施，如何配置服务器，如何将我们的产品部署上去？这些可以通过 [Chef](http://www.opscode.com/chef/) 来完成。

Chef 是一个开源系统配置和系统集成框架，可以通过代码来很方便的搭建基础设置。Chef 支持物理机、虚拟机、Cloud（如 [EC2](http://aws.amazon.com/ec2/)）。

Chef 管理基础设置大体有三个步骤：

![chef steps](/images/2011/steps.png)

* Provisioning：这一步通过虚拟机或者云的接口来搭建虚拟机或者 EC2 机器，准备出来的是裸机。
* Configuration：这一步通过 Chef 脚步来配置每一台机器，装软件，写配置等。
* Integration：最后把配置的所有不同类型的机器集成起来

Chef 配置机器有三种模式：

* Chef-Client/Chef-Server ： Server 上保存着所有的 Chef 脚步，以及当前所有配置机器（Node）的信息（比如 Node 的角色、状态等），而 Client 来负责具体的 Node 配置工作。
* Hosted Chef ：其实也是 Chef C/S，只不过是 [opscode](http://www.opscode.com/hosted-chef/) 来托管我们的 Server，免费账户可以控制 5 个 Node。
* Chef-Solo ： 不使用 Server，直接上传 Chef 脚步到 Node 上进行配置。

我们可以使用 Hosted Ched 的免费账户来体验一些 Chef。首先在[注册页面](https://community.opscode.com/users/new)注册一个账号，然后配置自己的组织（[如何配置？](http://wiki.opscode.com/display/chef/Setup+Opscode+User+and+Organization)）。

然后使用一台开发机，安装 Chef。只需要有 ruby、gem 环境即可，通过 gem 来安装 Chef：

    gem install chef

安装完成后可以通过 chef 命令来查看是否成功：

    chef-client -v

然后需要创建一个 [git](http://git-scm.com/) 目录：

    git clone git://github.com/opscode/chef-repo.git

在 chef-repo 中创建一个 .chef 目录用来保存我们的 Hosted Chef 配置文件。在 opscode 提供的[管理页面](https://manage.opscode.com)中，下载自己的 private key、组织的 validation key 以及 knife 工具的配置文件，这三个文件都保存到 .chef 目录中。

完成之后，我们可以通过 knife 来执行 chef 命令了。首先我们查看一下目前都有哪些 Node：

    knife client list

下面我们就需要写自己的 chef 的脚步了。当然 chef 是开源的，有很多社区支持，我们可以先下载几个菜谱（Cookbook）来试试。下载 并安装 chef-client 的 cookbook：

    knife cookbook site install chef-client

可以看到，由于 wordpress 的 cookbook 有依赖，所以我们还下载了 mysql、apache2、php 等 cookbook。 把 chef-client cookbook 上传到 Hosted Chef 的 Server 上：

    knife cookbook upload chef-client

然后比如我们有一台 ubuntu 的目标机器（不论是物理机、虚拟机、还是云中的），我们就可以通过 Chef 来给他安装 chef-client：

    knife bootstrap NODE_IP_OR_NAME -r 'recipe[chef-client]' -x ubuntu -P ROOT_PASSWORD --sudo

经过哗啦哗啦的输出后，我们可以通过 node list 查看这个 Node 是否已经成功添加：

    knife node list

应该会输出一个 Node 信息，可以通过 node show 来查看 这个 Node 的详细信息

    knife node show NODE_IP_OR_NAME

下面尝试一个 wordpress 的 cookbook，通过 cookbook site 下载并安装 wordpress 的 cookbook：

    knife cookbook site install cookbook

然后仍然上传到 Hosted Chef 上：

    knife cookbook upload cookbook

由于我们的 Node 已经被安装了 Chef Client，这时我们只需要 ssh 到 Node 机器上，运行 chef-client 即可：

    node$chef client

这个 cookbook命令执行完成后，可以通过 http://NODE_IP_OR_NAME/ 来访问 node 上的 wordpress 了。

这些就是基本的 chef 操作，下载下来的 cookbook 我们可以学习，然后写自己的 cookbook， 可以参考 [chef 的 wiki](http://wiki.opscode.com/display/chef/Home)。

下面附一个自己总结 session 的 ppt：
fasdfds
asdf

<div class="slideshare" id="__ss_8737820">
   <strong style="display:block;margin:12px 0 4px">
    <a href="http://www.slideshare.net/flankerfc/chef-introduction-8737820" title="Chef introduction" target="_blank">Chef introduction</a>
  </strong>
  <iframe src="http://www.slideshare.net/slideshow/embed_code/8737820" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
  <div style="padding:5px 0 12px">
    View more <a href="http://www.slideshare.net/" target="_blank">presentations</a> from <a href="http://www.slideshare.net/flankerfc" target="_blank">flankerfc</a>
  </div>
</div>

