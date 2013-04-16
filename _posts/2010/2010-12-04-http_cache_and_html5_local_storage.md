---
layout: post
title: 使用 Http Cache 缓存和 Html5 Local Storage 本地存储提升 Web 服务响应速度

published: true
meta:
  _edit_last: "1"
tags:
- Html5 Local Storage
- Html5 本地存储
- Http Cache
- Http 缓存
- development

type: post
status: publish
---
响应速度无疑是评价网站服务是否优秀的一个重要条件。但有时候网站的服务器端的确需要进行大量计算，导致客户端发送请求后过了很久响应返回，对于用户很可能就是看到一个空白的页面在加载，这样用户体验就太差了。目前已经有很多方法来提升 Web 服务的响应速度。这里我们只讨论从客户端缓存入手，使用 Http Cache 缓存和 Html5 Local Storage 本地存储来提升 Web 服务响应速度。

> [Demo 演示页面](http://chaojiwudi.com/demo/http_cache_and_html5_local_storage "Http Cache 缓存和 Html5 Local Storage 本地存储")

下面以 Demo 演示说明，该 Web 应用十分简单，服务器获取服务器当前时间返回给用户。但是这里模拟一个很复杂耗时的操作，即获取服务器当前时间需要耗时 5 秒（Sleep 了 5 秒）。最后演示如果通过 异步请求、Http Cache 缓存、Html5 Local Storage 本地存储来加速响应，提升用户体验。

<!--more-->
### 普通的 Http 请求响应

首先，我们的网站使用最普通的 Http 请求响应。也就是客户端请求一个页面，服务器端在收到请求后，在服务器端处理数据（可能会耗时很久，这里设置为 5 秒），然后将处理结果放在页面中返回给客户端，最终客户端显示页面的结果。

> [普通的 Http 请求响应 Demo 演示页面](http://chaojiwudi.com/demo/http_cache_and_html5_local_storage/regular_http_request "常规 Http 请求 - demo - Http 缓存和 Html5 本地存储")

服务器端代码示例：

    Result Regular_Http_Request() {
        result = GetDateTimeNow();
        Sleep(5000);
        return result;
    }

![普通的 Http 请求]({{ site.static_url }}/images/2010/regular_http_request.png)

通过 Chrome 的 Network 监控功能，可以看到 regular_http_request 整个页面响应达到了 5.31 秒（当然了，服务器 Sleep 了 5 秒），在加载页面的过程中，整个浏览器都是空白刷新状态，这样子对用户肯定是一个糟糕的体验。

### 异步的 Http 请求响应

Ajax 的应用，使得我可以使用异步 Http 请求来避免整个页面的刷新。页面请求太久，用户会因为看不到结果而放弃继续浏览。所以我们把页面修改为立即返回，但是页面上并没有包含数据，而是在客户端通过 Javascript 再次发送一个 Http 请求，服务器接受这个请求来处理数据，等数据处理完毕后返回给页面，页面的回调函数再把数据显示出来。

> [异步的 Http 请求响应 Demo 演示页面](http://chaojiwudi.com/demo/http_cache_and_html5_local_storage/ajax_http_request "Ajax HTTP 请求- demo - Http 缓存和 Html5 本地存储")

服务器端代码示例：

    Result Ajax_Http_Request() {
        return page;
    }

    Result Ajax_Get_Result() {
        result = GetDateTimeNow();
        Sleep(5000);
        return result;
    }

客户端代码示例：

    $(document).ready(function() {
        $('#result').load('Ajax_Get_Result');
    });

![异步 Http 请求]({{ site.static_url }}/images/2010/ajax_http_request.png)

通过 Chrome 浏览器的 Network 监控可以看到，ajax_http_request 页面响应很快，356 毫秒就处理完毕了。但是 ajax_http_request 页面没有包含数据，却包含了一段 Javascript 脚本，该脚本继续发送异步请求 ajax_get_result，这个请求在服务器端处理数据，消耗了 5.31 秒才响应。脚本回调函数根据结果加载到了页面上。

虽然通过异步 Http 请求，总体的时间消耗可能会更多了（请求数增加了），但是由于用户第一次请求页面能够及时得到响应，使得用户可以很快得到反馈，让用户的体验大幅提升。

### 带有 Http 缓存的请求

上面两个 Demo 不论常规的还是异步的，客户端发出的每次请求，服务器端都需要费时费力的处理数据。但其实很多时候，数据不会时时改变，也就是说在数据没有变化时，服务器会把相同的数据再次返回给客户端，做了无用的重复性工作。

这种情况可以通过 Http 协议里的 Http Cache 来避免。简单来讲就是在服务器返回数据时，在数据上打一个时间戳或其他标识，客户端得到数据后会把数据放在相应的缓存里。如果客户端下次再次请求这个数据，会根据时间戳来决定是否需要重新发送请求。而如果再次发送请求，也会加上缓存数据的时间戳或响应标识。服务器端接收到请求后，在处理数据时也会根据客户端的时间戳来判断数据是否有更新，如果数据有更新，则返回新的数据及时间戳。如果数据没有更新，则直接返回 304 Not Modified。

下面的代码以服务器当前时间作为时间戳，并且以 10 秒作为是否过期的一个判断。也就是说，在刷新页面时，如果不足 10 秒间隔，那么服务器不会返回新的数据结果，页面会从缓存中加载数据。

> [带有 Http 缓存的请求  Demo 演示页面](http://chaojiwudi.com/demo/http_cache_and_html5_local_storage/http_cache "带有 Http 缓存的请求")

服务器端代码示例：

    Result Http_Cache() {
        return page;
    }

    Result Ajax_Get_Result_With_Cache() {
        if (IsValid(Request.Headers.If-Modified-Since)) {
            Response = "304 Not Modified";
            return;
        } else {
            result = GetDateTimeNow();
            Sleep(5000);
            return result;
        }
    }

客户端代码示例：

    $(document).ready(function() {
        $('#result').load('Ajax_Get_Result_With_Cache');
    });

![带有 Http Cache 请求]({{ site.static_url }}/images/2010/http_cache.png)

上图是请求后再次请求的截图。通过 Chrome 浏览器的 Network 监控可以看到，如果之前已经有了 ajax_get_result_with_cache 缓存，在第二次请求 ajax_get_result_with_cache 时，服务器根据时间戳判断没有过期，则直接返回了 304 Not Modified，大大减少了服务器处理时间和整个响应时间。

![304 Not Modified]({{ site.static_url }}/images/2010/304_not_modified.png)

上图可以看到在一次请求中，客户端发出的请求头含有 If-Modified-Since 日期时间，而服务器端通过这个判断是否需要返回新的数据，在没有新的数据情况下直接返回 304 Not Modified，响应 Content-Length 为 0。

### 带有 Html5 本地存储的请求

以上通过异步请求加上 Http Cache 缓存，已经改善了用户体验。但现在页面处理还有一个问题，就是用户加载到页面后，会在浏览器里看到的是 Loading 加载中。因为这时候正在进行异步请求数据，而 Http 缓存数据显示也必须等请求结束（Http 缓存其实对页面 Javascript 程序来讲是透明的，Javascript 程序不能直接调用 Http 缓存数据来显示）。

Html5 的到来，给了我们一个很好的特性：Local Storage 本地存储。简单讲，本地存储就是可以将数据存储在客户端，并且可以通过接口来调用。之前浏览器只能将数据存储在 cookie 中，但是 cookie 很小且有很多限制（每次请求都会传递）。而 Html5 本地存储则对网页程序特别是针对移动设备的网页程序带来了很大的便利。

> [带有 Html5 本地存储的请求  Demo 演示页面](http://chaojiwudi.com/demo/http_cache_and_html5_local_storage/html5_local_storage "带有 Html5 本地存储的请求")

服务器端代码示例：

    Result Html5_Local_Storage() {
        return page;
    }

    Result Ajax_Html5_Local_Storage() {
        result = GetDateTimeNow();
        Sleep(5000);
        return result;
    }

客户端代码示例：

    $(document).ready(function() {
        if (window.localStorage) {
            var result = localStorage.getItem('result');
            if (result) {
                $('#result').text(result);
            }
        }
        $.get('Ajax_Html5_Local_Storage', function(data) {
            $('#result').text(data);
            if (window.localStorage) {
                localStorage.setItem('result', data)
            }
        });
    });

可以看到服务器的代码还是和以前的异步请求一样，但客户端 Javascript 增加了 Html5 Local Storage 本地存储相关的代码。首先 window.localStorage 来判断浏览器是否支持 Html5 本地存储。在发送异步请求前先判断 localStorage 中是否存在数据，如果有的话，先直接显示出来。然后在通过异步请求获得数据，更新页面并更新本地存储。

这个就不需要截图了，如果打开页面会发现，结果立即显示在页面上（从本地存储里获取的），然后在加载异步请求的结果。如果把 Http Cache 缓存和 Html5 Local Storage 本地存储结合起来，就可以从客户端、服务器端以及客户端服务器端之间的传输等多个方面减少网络数据传输、减少服务器数据处理，从而加快 Web 响应速度，提升用户体验。
