---
layout: post
title: chef package install 将 CI build 结果部署到 UAT

published: true
meta:
  _edit_last: "1"
tags:
- apt-get
- build
- chef
- deb
- deploy
- dpkg
- UAT
- development

type: post
status: publish
---
上一篇 [blog](http://blog.chaojiwudi.com/2011/07/chef-infrastructure-as-code/) 讲了 chef 的基本介绍。最近我们项目也在试着用 chef 来管理集成测试、UAT环境，即把 CI build 的最新结果通过 chef 部署到 UAT 环境上。今天也遇到了一个用 chef 安装 package 的问题，分享一下。

#### 将 ci build 结果发布

Chef 里可以使用 package 这个 resource 来安装软件，比如我们想给 Node 安装 unzip 这个软件，只需要写如下的 recipe 即可：

    package "unzip" do
      action :install
    end

我们的 ci 在 build 时，最后一步有一个 task 是将产品打成一个 deb 包，deb 使用当前日前 yyyymmddHHMM 作为 version。然后在用 dpkg-scanpackages 命令将 deb 包加入到一个 package repo 中以后后续步骤使用。

#### 使用 chef 在 Node 上加入 ci build 源

由于 ci 步骤已经将产品作为 dpkg 的源发布了，所以部署 UAT 时，chef 脚步就可以直接使用 apt 来安装产品。

首先将 ci 发布的源加入 apt 的 source，可以在 apt source list 中加入一个 ci.list

    template "/etc/apt/sources.list.d/ci.list" do
      source "ci.list.erb"
    end

其中 ci.list.erb 是一个 chef 的 template，主要用来加入 ci source 的地址，该文件实际生成的内容如下：（具体地址可以通过 attribute 文件配置）

    deb http://ci-host-name/path/to/ci/build/package

#### 使用 chef 安装软件

加入 chef 源后，就可以使用 chef 安装产品了。

首先 update 一下源，更新产品最新状态

    bash "update apt source" do
      code <<-EOF
        apt-get update
      EOF
    end

然后通过 package 来安装产品：

    package "product-name" do
      action :install
      options "--force-yes"
    end

经过如上设置，ci 成功 build 后，我们就可以非常方便的通过 chef 将最新 build 包部署到 UAT 环境上。

#### 版本的问题

上述代码在实际使用中，发现一个问题。如果是首次创建 Node，在空的 Node 环境中，deb 包可以成功安装；但是之后，ci 有新的 build 后，即 deb 包有新的版本后，如果我们不是重新创建 Node，而是用 chef 来更新一个配置过的 Node，那么 deb 不会被更新。查看 chef 的 log 可以看到如下 info：

    package[product-name]: current version is 201108140800
    package[product-name]: candidate version is 201108140900
    package[product-name]: product-name is already installed - nothing to do

可以猜测可能是 package 在执行时会考虑到版本的问题，但具体是什么逻辑网上也没有 google 到，于是查看 chef 源码。

在 package 的 resouce 中，可以给 package 设置 package_name、version 等。

在 package 的 provider 中，针对 ubuntu 的平台，有 package/apt.rb APT 来处理。在 APT 中，首先调用 check_package_state 方法检查当前 package 的状态，该方法实际是调用了 shell 命令 apt-cache policy #{packge_name} 来分析的。以下是命令在 shell 上的输出结果：

    apt-cache policy product-name
    product-name:
      Installed: 201108140800
      Candidate: 201108140900
      Version table:
         201108140800 0
            500 http://ci-host-name ./ Packages
     *** 201108140900 0
            100 /var/lib/dpkg/status

APT provider 使用 installed 对应的版本赋值给 @current_resource.version，如果 version 不为 (none)，则赋值 installed 为 true；使用 candidate 对应的版本赋值给 @candidate_version

在执行 package 的 install action 时，首先进行版本判断：

    def action_install
      if @new_resource.version != nil && @new_resource.version != @current_resource.version
        install_version = @new_resource.version
      elsif @current_resource.version == nil
        install_version = candidate_version
      else
        Chef::Log.debug("#{@new_resource} is already installed - nothing to do")
        return
      end

      ...

      status = install_package(@new_resource.package_name, install_version)
      if status
        @new_resource.updated_by_last_action(true)
      end
      Chef::Log.info("#{@new_resource} installed version #{install_version}")
    end

new_resource 是我们在 chef 脚步中写的 resource，也就是我们想要安装的 package，current_resource 是当前 Node 中已经安装过的 package。

首先，如果当 new_resource 版本不为 nil 并且和 current_resource 版本不同时，会安装 new_resource 版本的 package；

其次，当 current_resource 的版本为 nil 时，会安装 candidate_version 的 package；

最后，即 current_resource 版本有值但 new_resource 版本为 nil，则不执行安装，输出 log “product-name is already installed - nothing to do”

#### 解决的方法

找到了问题的根源，解决也就非常容易了。在执行 package install 时，指定最新的 version 即可。最新的 version 我们同样也可以通过 apt-cache policy 命令输出的结果，通过 awk 分析其中的 candidate 获取。修改后的 chef 脚步如下：

    candidate_version = `apt-cache policy home-ideas | awk '/Candidate/{print $2}'`

    package "home-ideas" do
      action :install
      options "--force-yes"
      version candidate_version
    end

最后再次测试 chef，对新生成的 Node 和已经配置过的 Node，都可以快速的部署最新的产品到作为 UAT 了。
