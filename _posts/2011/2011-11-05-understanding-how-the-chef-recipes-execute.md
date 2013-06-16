---
layout: post
title: chef 的 recipe 如何执行的问题

published: true
meta:
  _edit_last: "1"
  _thumbnail_id: "206"
tags:
- chef
- provider
- recipe
- resource
- development

type: post
status: publish
---

![cookbook]({{ site.static_url }}/images/2011/cookbook.gif)

#### 背景

在前面的[几篇文章](/2011/07/chef-infrastructure-as-code/)中一直提到如何使用 chef 来进行部署。我们可以把自己的部署和配置的相关脚本写成 chef 的 recipe，由 chef 来执行，对目标机器进行部署配置。下面分享一个 recipe 如何执行的问题。

#### 问题

chef 的 recipe 使用 ruby DSL 来写，语义十分明显。对于常用的部署配置操作，chef 已经提供了很多 resource 可供使用，比如 安装一个包、写入一个文件、新增一个用户、执行一段 shell 等。稍微有些 ruby 经验的开发人员，基本看了都可以明白。比如：

    package "httpd" do
      action :install
    end

    file "/etc/myconfig" do
      owner "user"
    end

上面这段 chef recipe 中，首先安装了 httpd 的包，其次创建了一个 `/etc/myconfig` 的文件。

<!-- more -->

由于我们的 recipe 本身就是由 ruby 语言写的，在实际的 recipe 中，可以自己添加任何 ruby 代码来执行。

那么对于下面这个 recipe，各位可以想想它的运行结果是什么？

    file "/tmp/test1" do
      owner "root"
    end

    result = File.exists?("/tmp/test1").to_s

    file "/tmp/test2" do
      owner "root"
      not_if { File.exists?("/tmp/test1") }
    end

    file "/tmp/#{result}" do
      owner "root"
    end

这个 recipe 看起来很简单，就是准备创建三个文件。对于一个文件，没有任何问题。但是对于第二个文件的创建，多了一句 `not_if { File.exists?("/tmp/test1") }`，对于第三个文件的名称，使用了一个 `result` 变量，这个变量的值是有前面的一条 ruby 语句 `result = File.exists?("/tmp/test1").to_s` 赋值的。

#### 错误

如果我们简单的认为，按照 recipe 依次运行的结果，当第一个文件创建后，`File.exists?("/tmp/test1")` 应该是会返回 `true` 的。所以我们会创建 `/tmp/test1`，不会创建 `/tmp/test2` （因为 `not_if` 判断为真了），最后再创建一个 `/tmp/true` 文件。

实际的执行结果是，`/tmp/test1` 正常创建，`/tmp/test2` 没有创建，但是最后创建了一个 `/tmp/false` 的文件。

#### 理解

之所以出现这样一个结果，是和 chef recipe 执行的过程有关系的。

我们在 chef recipe 中写的大部分代码，都是直接使用 chef 提供的 DSL，比如 `package`、 `directory`、 `bash`、 `file`、 `template` 等。这些在 chef 中都称作 resource。顾名思义，resource 只是表示了对系统某一个部分的抽象，我们的 `package "httpd"` 只是创建了一个 resourse （这个 resource 表示了一个需要安装的 package），但是并不是立即会去执行安装 package 的行为。

而 resource 的最终执行，是通过 provider 来实现的。一个 resource 至少需要 一个 provider。大部分的 resource 都会对应多个 provider，真正执行时，chef 会根据操作系统类型等来确定使用哪一个 provider。还是拿 `package` 举例，这个 resource 表示对系统中一个包的操作（默认是安装），对应的 provider 根据系统的不同，就会有 `rpm`、`apt-get`、`yum`、`dpkg`，以及 `rubygem`、`macports` 等等不同的包管理器来执行。

在执行 chef 时（比如运行 `chef-solo`），recipe 会经历两个步骤：

1. 解析阶段

    chef 会先全部过一遍我们的 recipe，执行 recipe 里的 ruby 代码，如果是 chef 的 DSL，就会创建对应的 resource（通过 `method_missing` 来实现）。所有的 resource 都会添加到 ResourceCollection 中，被索引起来（numerically indexed hash）。

2. 执行阶段

    当所有的 recipe 被处理完毕，resource 被建立后，chef 会开始运行每一个 resource 对应的 provider，调用 resource 指定的 `run_action`。在选择 provider 时，chef 会按照

    - resource 指明的 provider
    - platform 对应的 provider
    - resource 名称对应的 provider

的顺序来选择。

#### 解决

通过上面的说明，可以看到对于我们问题中所描述的 recipe，chef 在执行时，会先通过 recipe 创建 resource。这个过程会执行 recipe 里的所有 ruby 代码。

第一段代码

    file "/tmp/test1" do
      owner "root"
    end

会创建一个 file 的 resource。其属性 `path` 为 `"/tmp/test1"`

第二段代码

    result = File.exists?("/tmp/test1").to_s

会给 result 赋值，由于目前文件 `/tmp/test1` 并没有被创建，所以此时的 `result` 为 `"false"`

第三段代码

    file "/tmp/test2" do
      owner "root"
      not_if { File.exists?("/tmp/test1") }
    end

会创建一个 file 的 resource。其属性 `path` 为 `"/tmp/test2"`，但是注意，这里我们给这个 resource 设置了多一个属性 `not_if`，这个 `not_if` 属性接受的不是 `bool` 类型，而是一个 `block` 或者 `string` 类型。（仅仅是把 block 传入，而不是执行结果）

第四段代码

    file "/tmp/#{result}" do
      owner "root"
    end

会创建一个 file 的 resource。由于第二步已经计算出 `result` 为 `"false"`，所以其属性 `path` 根据 ruby 变量的赋值，为 `"/tmp/false"`

当 recipe 全部被 parse 结束后，三个 resource 会被执行，调用其对应的 provider（这里就是简单的 file provider）的 run_action。

第一个 resource，run_action 很简单，创建文件 `/tmp/test1`

第二个 resource，run_action 时，会先判断 `not_if`，chef 中在 run_action 时判断 `not_if` 的代码如下：

    def run_action(action)
      ... ...
      if not_if
        unless Chef::Mixin::Command.not_if(not_if, not_if_args)
          Chef::Log.debug("Skipping #{self} due to not_if")
          return
        end
      end
      ... ...
    end

会把 block 执行，根据执行结果如果满足条件，则直接从 run_action 中 return，即不会再去执行 action 的操作。

由于这时 `/tmp/test1`，所以我们的判断会成立，即 `/tmp/test2` 不会被创建。

第三个 resource，run_action 时也很简单，因为 resource 的值已经在解析时创建好了，所以会创建一个 `/tmp/false`。

#### 结论

综上可知，我们在写 recipe 时、用 recipe 时，需要理解 recipe 执行的行为。其包含了`解析`和`执行`两个步骤。特别是对应我们的 recipe 中还包含了 chef DSL 之外的 ruby 代码时，更需要明白其产生的结果，不能简单的以 recipe 顺序执行代码来判断每一个步骤的结果。
