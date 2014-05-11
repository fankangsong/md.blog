#解决Firefox不支持字体跨域

如果CSS、图片、字体文件是通过CND发布，而通常站点域名和CDN的URL不是同一个域名，在Firefox下字体会乱码，因为Firefox无法跨域引用字体文件。

例如我们访问`www.xxx.com`，引用的CSS文件在CDN(`//cdn.aaa.com/css/style.css`)，CSS文件引用字体文件路径如下：


	@font-face {
	  font-family: 'fontello';
	  src: url('//cdn.domain.com/font/fontello.eot');
	  src: url('//cdn.domain.com/font/fontello.eot?#iefix') format('embedded-opentype'),
	       url('//cdn.domain.com/font/fontello.woff?') format('woff'),
	       url('//cdn.domain.com/font/fontello.ttf?') format('truetype'),
	       url('//cdn.domain.com/font/fontello.svg?#fontello') format('svg');
	  font-weight: normal;
	  font-style: normal;
	}


在Firefox是会乱码的。

## 解决方法

设置nginx配置文件：

	location ~* \.(eot|ttf|woff)$ {
	    add_header Access-Control-Allow-Origin *;
	}

## 妥协办法
* dataURL引入（CSS文件大小会增加）
* CSS和字体文件都放到站点目录下（待更新）

### 参考
* [http://serverfault.com/questions/186965/how-can-i-make-nginx-support-font-face-formats-and-allow-access-control-allow-o](http://serverfault.com/questions/186965/how-can-i-make-nginx-support-font-face-formats-and-allow-access-control-allow-o)
* [http://exodia.net/share/one/2/slides/](http://exodia.net/share/one/2/slides/)
