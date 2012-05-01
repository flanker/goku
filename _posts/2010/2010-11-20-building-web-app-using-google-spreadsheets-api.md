---
layout: post
title: 使用 Google Spreadsheets API 搭建在线应用

published: true
meta:
  _edit_last: "1"
tags:
- Asp.NET
- Google
- Google Spreadsheets
- Json
- development

type: post
status: publish
---
有时候自己需要做一些比较小的在线应用, 可能只是给个人用的, 比如一些备忘录或者 TodoList 之类的. 这些应用一般都很小, 服务端和客户端程序都很简单, 但是却都涉及了一个很常见的问题--数据存储. 如果自己有数据库服务, 比如 MySql 或者 SQL Server, 或者使用 Sqlite 等文件型数据库, 那么通过常规的数据库编程可以比较简单的实现.

其实对于一些很简单的应用, 完全可以使用 [Google Spreadsheets](https://docs.google.com "oogle Docs") (电子表格) 来作为数据库, 然后通过 [Google Spreadsheets API](http://code.google.com/apis/spreadsheets/) 来访问数据. 使用 Google Spreadsheets 有着一些优势:

* 免费. 个人免费使用, 不需要自己购买数据库服务;
* 可靠. 服务由Google提供;
* 公开. 首先可以利用 Google Docs 在线编辑. 其次可以通过 Google Spreadsheets API 来访问;
* 强大. Google Spreadsheets API 支持多种类型( XML/Json等 ), 通过 REST 风格的 HTTP 请求来访问数据, 并且已经有多种语言的库( Java/.NET/Javascript等 ). 可以通过 Web应用/客户端应用/移动应用 来访问;

比如我想记录一些常用桌面及在线应用的名称( 因为经常会看到一些很酷的应用, 但是不记下来的话过后就会忘了 ). 如果把数据存在 Google Spreadsheets 上, 那么以后不管是通过 Web 还是 移动设备, 搭建应用程序来访问都会十分的方便. 下面就以这个为例来做一个简单的 Web应用.

<!--more-->
Google Spreadsheets API 目前已经有很多 [客户端库](http://code.google.com/apis/gdata/docs/client-libraries.html), 这里我们不使用现有的客户端库, 而直接以最简单的 HTTP 请求方式来调用API.

第一步, 在 Google Docs 上建立一个 Spreadsheet

![Google Spreadsheets](/images/2010/GoogleSpreadsheets.jpg)

一个 Worksheet 工作表就类似于数据库系统的一张表, 行和列分别类似. 这里先手工录入一些数据. 为了下面方便, 我们把这个文档设置为 public 在网络上发布任何人可以读取数据.

第二步, 使用 Google Spreadsheets API 访问数据.

Google Spreadsheets API 其实是整个 [Google Data Protocol](http://code.google.com/apis/gdata/) 的一部分. Google Data Protocol 规定了如果通过 REST 风格的HTTP 请求来访问, 写入, 修改, 删除数据.

例如以上的文档可以用如下这个 URL 通过 HTTP 直接请求:

    http://spreadsheets.google.com/feeds/list/0ApprjhYB-ZEVdDQ3TDI0ZTF2WWo5bGg5akRqeW5wRXc/od6/public/values

* >spreadsheets.google.com/feeds/ 表示请求 Google Spreadsheets 的 Feed 数据
* list 表示请求的 [Feet类型](http://code.google.com/apis/spreadsheets/data/3.0/reference.html#Feeds). 这里有 spreadsheets(整个文档)/worksheets(工作表) /list(某张工作表的行列)/cells(单元格)等若干类型
* 0ApprjhYB-ZEVdDQ3TDI0ZTF2WWo5bGg5akRqeW5wRXc 是文档的 Key. 这个在编辑发布文档时都可以看到
* od6 在这里是第一个工作表, 也可以用1来替换
* public 表示不需要身份验证来访问, 这种方式只能访问公开的数据表. private 可以访问需要身份验证的数据. 关于数据验证, 可以看 [这里](http://code.google.com/apis/gdata/docs/auth/overview.html). 在这里为了简化, 使用公开数据的 public 访问.
* values 表示 [数据的映射](http://code.google.com/apis/spreadsheets/data/3.0/reference.html#Projection). 有 full/values/basic 三种, 简单来讲就是包含信息的多寡. 注意 public不能访问 full 映射

除了这个基本的 URL 对应到了某一个资源之后, 我们还可以在请求后面以 url?name=value 的形式加入若干参数:

* ?v=3.0 表示请求使用的版本
* ?alt=json 表示请求结果使用 Json 形式返回. 这里可以使用 [Atom](http://code.google.com/apis/gdata/docs/2.0/reference.html#DocumentFormat)/RSS/[Json](http://code.google.com/apis/gdata/docs/json.html) 等多种数据形式.
* ?q=value 表示查询

这里我们使用 Json 格式来获取数据, Json比较简单, 不论在 Web应用的后台还是前台都能够很方便的处理.

    http://spreadsheets.google.com/feeds/list/0ApprjhYB-ZEVdDQ3TDI0ZTF2WWo5bGg5akRqeW5wRXc/od6/public/values?v=3.0&amp;alt=json

通过上面这个 URL 发送 HTTP 请求, Google Spreadsheets API 会返回一个类似如下的结果(省略的这里不需要的数据, 具体结果的说明可以 [参考这里](http://code.google.com/apis/gdata/docs/2.0/reference.html#ProtocolDetails)):

    {
      "version":"1.0",
      "encoding":"UTF-8",
      "feed":
      {
        blablabla,
        "title":{"$t":"table1"},
        "openSearch$totalResults":{"$t":"6"},
        "openSearch$startIndex":{"$t":"1"},
        "entry":
        [
          {
            "gd$etag":"\"RFUaK2d9NSt7ImA9XE9VTBdK\"",
            "id":{"$t":"blablabla"},
            "updated":{"$t":"2010-11-21T03:48:28.428Z"},
            "title":{"$t":"1"},
            "content":{"$t":"category: win, type: opensource, name: 7-zip, description: 文档压缩解压缩"},
            "link": blablabla,
            "gsx$id":{"$t":"1"},
            "gsx$category":{"$t":"win"},
            "gsx$type":{"$t":"opensource"},
            "gsx$name":{"$t":"7-zip"},
            "gsx$description":{"$t":"文档压缩解压缩"},
          },
          blablabla
        ]
      }
    }

以上的blablabla省略去了很多其他元数据/数据/重复数据等. 所以我们的 Web应用可以直接处理这个 Json.

我的 Web 应用使用 [Asp.Net MVC](http://www.asp.net/mvc) 来搭建. Asp.Net MVC 类似 Ruby on rails, 用来快速开发小型Web应用很方便.

首先建立一个 ToolController以及 Route 规则, 使得用户访问 websitehost/tool 这个 URL 时, 请求会调用到 ToolController 的 Index() 方法. 在 Index() 方法中, 我们通过 HTTP 来请求数据.

    List results = new List();

    Uri uri = new Uri(MyGoogleSpreadsheetsURL);
    WebClient wc = new WebClient();
    wc.Encoding = System.Text.Encoding.UTF8;
    string rawResult = wc.DownloadString(uri);

    JObject json = JObject.Parse(rawResult);
    JArray entryList = json["feed"]["entry"] as JArray;
    foreach (JObject t in entryList)
    {
        ToolDTO dto = new ToolDTO();
        dto.ID = int.Parse((t["gsx$id"]["$t"] as JValue).Value.ToString());
        dto.Category = (t["gsx$category"]["$t"] as JValue).Value.ToString();
        dto.Type = (t["gsx$type"]["$t"] as JValue).Value.ToString();
        dto.Name = (t["gsx$name"]["$t"] as JValue).Value.ToString();
        dto.Description = (t["gsx$description"]["$t"] as JValue).Value.ToString();
        results.Add(dto);
    }

在这个方法中, 我们使用了 .NET 里的 WebClient 发送 HTTP 请求, 请求的结果我们使用 [Json.NET](http://james.newtonking.com/pages/json-net.aspx) 来处理, Json.NET 处理 Json很方便, 这里我没有通过反序列化, 而是直接通过 JObject 来解析了.

HTTP 请求来的 Json 数据被成功解析, 转化为 DTO 对象, 数据集合被传递给 View, View 将数据显示在页面上, 并反馈给用户.

    <div>
        <dl>
            <% foreach (var item in Model)
               { %>
            <dt>
                <%= Html.Encode(item.Name) %></dt>
            <dd>
                <%= Html.Encode(item.Description) %>
                <a href="http://www.google.com/search?q=<%= Url.Encode(item.Name) %>" title="<%= Html.Encode(item.Name) %>" rel="external">Google it!</a></dd>
            <% } %>
        </dl>
    </div>

这里简单的通过 <dl> 标签来显示数据. 最终展示结果如下: (在线访问地址: [http://chaojiwudi.com/tool](http://chaojiwudi.com/tool))

![web application](/images/2010/webapp.jpg)

至此, 一个最简单的使用 Google Spreadsheets API 搭建的在线应用就完成了. 当然这个应用还很简单, 没有设计用户身份验证, 以及修改数据等操作 (对于我的需求来说, 在 Docs 里来修改数据也可以接受, 呵呵). 可以在之后进一步对其进行修改.

这样以后就可以把一下不是很私密的数据存放在 Google Spreadsheets 以及其他的 Google 服务上. 毕竟目前已经有了针对Google服务的第三方应用, 这样比起存放在你自己的数据库中, 你的数据使用起来将会更方便.
