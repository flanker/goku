---
layout: post
title: 几个 Ruby XML Parser 及其性能比较

published: true

tags:
- ruby
- xml parser
- sax
- 性能

type: post
status: publish
---

### 背景

最近的一处 ruby 代码里，需要在服务启动时，加载并解析一个较大的 XML 文件（大约 20M 多），将其数据缓存在内存中。

在之前代码处理 XML 解析时，用了 [sax_machine](https://github.com/pauldix/sax-machine) 这个 gem。继续使用 sax_machine 处理这个 20M 的文件时，文件的加载和解析需要大概 90 多秒（Mac OS 10.8，i7，8G 内存，SSD 硬盘！）导致服务启动时间不可接受。所以我们比较了几个 ruby xml parser。

### 比较

直接看比较结果：

* ** [sax_machine](https://github.com/pauldix/sax-machine) 0.2.0 ** : ~91 seconds
* ** [nokogiri](http://nokogiri.org/) 1.5.6 ** : ~21 seconds
* ** [libxml-ruby](https://github.com/xml4r/libxml-ruby) 2.6.0 ** : ~9 seconds
* ** [ox](https://github.com/ohler55/ox) 1.9.1 ** : ~3 seconds

ruby xml parser 性能比较 图表:

![ruby xml parser 性能比较]({{ site.static_url }}/images/2013/0310-ruby-xml-parser-performance.png)

### SAX

其实在对比中，我们这几个 gem 都使用的是 [SAX](http://zh.wikipedia.org/wiki/SAX)（Simple API for XML） 来处理 xml。（与其相反的是 DOM）

其中 [nokogiri](http://nokogiri.org/), [libxml-ruby](https://github.com/xml4r/libxml-ruby), [ox](https://github.com/ohler55/ox) 的用法很相似，都是典型的基于事件（event based）方式：

    class Parser
      include LibXML::XML::SaxParser::Callbacks

      def on_start_element(name, attributes)
        # bla bla bla
      end

      def on_end_element(name)
        # bla bla bla
      end
    end

    File.open(XML_FILE_PATH, 'r') do |file|
      parser = LibXML::XML::SaxParser.io(file)
      parser.callbacks = Parser.new
      parser.parse
    end

注意在最后解释 xml 文件时，要以文件 IO 的形式读取，不能把整个文件全部加载到内存中按字符串在处理，否则性能也会很烂。

对于 sax_machine，它是对 nokogiri 的一个 wrapper 封装。提供了声明式编程的 API接口，用法类似这样子：

    require 'sax-machine'

    class RegionNode
      include SAXMachine
      element 'name', :as => :name
    end

    class Hierarchy
      include SAXMachine
      elements 'n1:location', :as => :states, :class => StateNode, :with => {:type => 'STATE'}
      elements 'n1:location', :as => :regions, :class => RegionNode, :with => {:type => 'REGION'}
    end

    Hierarchy.new.parse(File.open(XML_FILE_PATH))

只需要声明式的定义自己的类型和对应的数据属性即可。按文档来说 sax_machine 也是按 SAX 来做的（名字就叫 sax 么）。但是对于稍微大点儿和复杂的 XML 文档，它的性能问题就会非常明显。

### nokogiri 和 libxml-ruby

感觉这两个差不多，他们都是依赖于 libxml 库。nokogiri 感觉应用的更多些，很多 gem 都是依赖于它（包括 sax_machine），基本上是 ruby 里 html/xml parser 的标准了。我自己的实例中测试 libxml-ruby 比他快了一倍。由于他们对部署环境的要求没区别（都是 libxml）所以我选择了 libxml-ruby。

### 最快的 ox

ox 这个库的作者在 stackoverflow 回复别人时号称 ox 是最快的。（[What are fast XML parsers for Ruby?](http://stackoverflow.com/a/7562820)） 从我测试的结果来看，ox 的性能确实惊人，基本都在 3 秒内，可以说是秒杀对手。

这都是因为 ox 基本上都是靠 C extension 来实现的，所以很快。但这也引入了一个问题，bug。在用 ox 时发现了很多奇怪的 bug（我们提交了一个 [issue](https://github.com/ohler55/ox/issues/46) 并且已经得到了修复）。但是还是有很多跟 ruby 版本或者操作系统版本相关的 bug。基于种种考虑，最终没有选择它。

### 结论

最后我根据自己实例，基于性能和稳定性考虑，选择了 libxml-ruby。

