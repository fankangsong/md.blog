#Yahoo Pipes 为静态网站生成RSS

之前跟风，用了一段时间[HEXO](http://hexo.io)，每次发布文章，还要登录到VPS手动生成一次静态文件，虽然用上了高上大的NODEJS，还是觉得逼格不够。

于是我发扬了coder的造轮子的优秀品质，自己轮了一个没有`生成`、`静态`、`发布`、`评论`、`RSS，`一个纯粹的markdown阅读工具，只需把写好的markdown文件，同步到Dropbox。

我觉得这样写博客，逼格很够了。可是今天上午，我在手机上打开RSS阅读APP，想到如果我的读者，当然我没有读者，假设我有那么几个读者，他们想看看我最近比较有深度思考的文章，假设这个读者在手机上打开我的博客，后面不敢想了……还是简单描述一下吧。假设我的读者要看我的博客，他须打开浏览器、点击地址栏，手机弹出软键盘，他在食指，一个一个敲出域名，这些操作，至少要在屏幕上点13次，还不算敲错字母。

假设之后，我觉得还是搞个RSS给我的读者们，让他们愉悦的在自己喜欢的RSS阅读软件里，跟我有一些思想的火花碰撞。

想来想去，这一堆markdown文件怎么让他们变成RSS？我突然觉得我造的轮子很傻逼，不能自动`生成`、`静态`、`发布`、`评论`、`RSS`的程序也能叫博客？

于是我想到了Yahoo Pipes。事实上我隐瞒了一件事情，虽然我的轮子不用`生成`、`静态`、`发布`、`评论`、`RSS`，但是这个轮子需要我手动维护一个JSON文件，于是我把这个手动维护的JSON文件提交给[YQL](https://developer.yahoo.com/yql/console/)，当然YQL很给面子，马上帮我生成了Pipes能够抓取的格式，然后Pipes就帮我生成了一个还是靠谱的RSS，这个RSS不包含全文feed，不然就是绝对靠谱了。

欢迎再次订阅：[http://pipes.yahoo.com/pipes/pipe.info?_id=cb3011f4a5a125baec76a025cd679b9e](http://pipes.yahoo.com/pipes/pipe.info?_id=cb3011f4a5a125baec76a025cd679b9e)

[![Yahoo Pipes](https://dl.dropboxusercontent.com/u/2589242/2014/yahoopipes.PNG)](https://dl.dropboxusercontent.com/u/2589242/2014/yahoopipes.PNG)