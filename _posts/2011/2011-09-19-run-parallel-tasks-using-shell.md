---
layout: post
title: shell 并发执行任务，使用 chef 搭建测试环境

published: true
meta:
  _edit_last: "1"
  _thumbnail_id: "193"
tags:
- chef
- shell
- development

type: post
status: publish
---
![gas pipeline](/images/2011/Ukrainian_Naftogaz_pipelines_paid_for_by_European_companies.jpg)

最近的工作一直和 build 构建、deployment 部署相关，并且一直和 [chef](http://www.opscode.com/chef/) 打交道。这里遇到了一个在 shell 中创建并行任务的事情。

#### 背景 &

整个项目是由多个 component 组成，假设有 web、database、search、backend（本文里不需要知道这些分别具体做什么），每个 component 至少都是一个 server。build 大概流程是这样：

1. 使用 [jenkins](http://jenkins-ci.org/) 或者 [go](http://www.thoughtworks-studios.com/go-agile-release-management) 来跑 build
2. build 的第一个 stage，编译项目并作 unit test 和相关代码静态检查，将 package 作为 artifact 输出
3. build 的第二个 stage，本地用 package 运行一个 local server，运行所有的 [cucumber](http://cukes.info/) acceptance test
4. build 的第三个 stage，通过 [chef](http://www.opscode.com/chef/) 在 EC2 云上创建 4 个 instance，分别部署 web、database、search、backend 四个 node，然后对他们运行 integration test
5. 所有编译测试通过后，将 package publish 到一个 package repository 上，供之后的步骤（showcase、UAT、release、production 等）使用

在步骤 4，创建 instance 时，我们使用 chef 创建机器和部署产品。使用一个类似如下的命令：

    env-tool node create web_node web_role

`env-tool` 是一个小工具，包装了一下 chef。这里表示创建了一个 hostname 为 `web_node` 的机器，它的类型为 `web server`。

#### 问题 ?

一切都比较顺利，在云上创建四台机器，部署四个节点，运行所有的 integration test，感觉好极了。但是呢，有一个问题。chef 部署包含了 创建机器及 OS、配置系统网络等、安装基础软件、下载安装配置 package 等，运行一次就需要花费不少的时间（大概有3、5分钟）。如果依次部署 4 个 node 就需要十几二十分钟。这个 build 太长了，会严重影响到开发人员提交代码，以及得到 build 反馈的时间。（实践证明一个时间过长的 build 很容易导致 build 常红以及团队对 build 的不信任和忽略，当然这是另外一个话题）。

#### 解决 !

很简单，并行执行 chef。

在 shell 中我们很容易把一个命令放在后台进程中去执行，但更关键的是我们需要知道这个进程是否执行完成以及它的返回结果。这个可以通过 `wait` 命令来实现。

`wait` 命令会停止当前 shell 脚步的执行，直到所有的后台 job 结束，或者指定的 job-id、pid 的任务结束。

* `wait` 等待所有后台 job 结束
* `wait $pid` 等待指定 pid 的任务结束

所以我们写了一个简单的 shell 脚步来并行我们的 chef 任务：

    create_node() {
      env-tool node create $1 $2 > "tmp/$1.log" &
    }

    create_node database_node database_role
    create_node search_node search_role
    create_node backend_node backend_role
    create_node web_node web_role

    exit_status=0

    for pid in `jobs -p`; do
      wait $pid || ((exit_status++))
    done

    echo "all process exit with status $exit_status"
    exit $exit_status

有几点：

* 使用 `&` 将任务放在后台运行
* 使用 `>` 重定向输出到 log 文件里，要不然 console 里就乱了套
* 使用 `jobs -p` 返回所有 job 的 pid，执行 `wait` 等待后台任务的完成
* 判断 `wait` 的返回值，不为 0 则任务是失败退出的，给 `exit_status` 加 1
* 最终返回 `exit_status` 作为返回结果，`exit_status` 为几，则表示有几个节点创建失败了
* 如果失败了，可以在 log 里查看 chef 命令输出

