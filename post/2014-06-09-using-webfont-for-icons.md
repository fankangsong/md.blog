


#Web Font图标实践

- Web Font
- CSS sprite、SVG与Web Font Icon
- web font图标实际应用
- 制作自己的font
- web font图标的缺陷

Web Font把设计师从[Web Safe Font](http://www.w3schools.com/cssref/css_websafe_fonts.asp)解脱出来，给设计师更多的空间发挥才能。对于前端开发来说，Web Font帮我们从位图文字中解脱出来，打包的字体减少请求数，矢量图形更好的响应不同尺寸的屏幕。

我想Web Font的初衷是为了在网页上展现更丰富的字体，满足更好的网页阅读体验。字体可大可小，并且在不同尺寸下保持最佳的阅读体验，所以Web Font的最大特性**矢量图形**被前端工程师们挖掘并应用在图标上。

##CSS Sprite

我们都知道CSS Sprite技术是优化浏览器请求数。维护一套图标时，永远在一张Sprite图片上，发布时我们只需要修改一下CSS文件里的时间戳就可以刷新缓存，维护成本很低。

但是当图标的应用场景越来越多，例如：

####图1
![图1](https://dl.dropboxusercontent.com/u/2589242/2014/using-web-font-for-icon/1.jpg)


####图2
![图2](https://dl.dropboxusercontent.com/u/2589242/2014/using-web-font-for-icon/2.jpg)



`图1`与`图2`中的“编辑”图标颜色、尺寸都不一样，在Sprite图片中唯有新增一个图标。我们改变Sprite中图标的尺寸、颜色。

##SVG

`HTML`支持直接使用`img`标签引用`SVG`格式图片：

	<img src="logo.svg">

`CSS`使用`SVG`定义节点背景图：

	.logo{
		backgroune: url(logo.svg)
	}

然后