---
layout: post
title: Terminator!
published: true
meta:
  _edit_last: "1"
tags:
- git
- shell
- vi
- development

type: post
status: publish
---
最近工作上一直和一个外国朋友一起结对编程，跟他学了不少在 Mac OS 的 terminal 终端下使用 shell、vi、git 等工具开发的技巧。

首先使用 [homebrew](https://github.com/mxcl/homebrew "homebrew") 来管理软件，homebrew 给 Mac 提供了类似 apt-get 一样的功能。homebrew 提供了搜索软件、安装软件、自动管理依赖的功能。macports 也可以，但是 [homebrew 更好用些](http://tedwise.com/2010/08/28/homebrew-vs-macports/ "homebrew vs macports")。比如很常用的 wget，就可以通过 brew install wget 来安装。

在 Mac 下使用 terminal 时，主要就是使用 shell 以及许多工具比如 git、vi 等等。这些程序和工具都有大量的配置，可以打造得自己用起来很舒服。大多数工具的配置文件都在 home 目录中 .config_file 隐藏配置文件。在 github 上可以找到[很多名为 dotfiles 的项目](https://github.com/search?langOverride=&amp;q=dotfiles&amp;repo=&amp;start_value=1&amp;type=Repositories)，都是大家分享自己的配置，可以参考学习。我们也可以把自己的配置文件放在一个 git repository 中，然后在 home 目录中使用 link 链接到 git repository 里的文件。这样就可以版本控制自己的配置文件，在换机器时也可以很方便的重用。

我自己目前喜欢的几个配置：

- alias 常用的命令和工具，比如，ls 默认输出隐藏文件并配置颜色，ll 即为 ls -l：

        alias ls="ls -a -G"  
        alias ll="ls -l"

- 设置 shell 提示符

        PS1="\[\033[36m\]\u\[\033[33m\]@\[\033[33m\]\h:\[\033[35m\]\W\[\033[m\]\$ "

- 设置 ls 目录列表的颜色

        export CLICOLOR=1  
        export LSCOLORS=gxfxcxdxbxegedabagacad

- 在 .gitconfig 中设置 git 命令输出的颜色，比如 diff

        [color]  
          ui = true  
        [color "diff"]  
          meta = magenta  
          frag = yellow  
          old = red  
          new = cyan

- 使用 [MacVim](http://code.google.com/p/macvim/ "MacVim") 和 [janus](https://github.com/carlhuda/janus "janus") 打造很强大的 vi。

经过若干配置，terminal 和 vi 都变得非常华丽，也极大的方便了开发。

![Terminal]({{ site.static_url }}/images/2011/terminal.png)

![MacVim]({{ site.static_url }}/images/2011/MacVim.png)

这里还有一个更强大更华丽的 shell：[fish](http://fishshell.com/ "fish shell")，提供了很强大的用户交互功能，包括界面颜色和自动完成，我们可以使用 homebrew 很方便的安装他：brew install fish。再配合 [fish-nuggets](https://github.com/eventualbuddha/fish-nuggets "fish-nuggets") 就更加无敌了（比如解决了和 rvm 兼容的问题）
