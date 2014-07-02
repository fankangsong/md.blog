md.blog
=======

DEMO:[blog.imfer.me](http://blog.imfer.me)

##开始使用

下载`git clone https://github.com/fankangsong/md.blog.git`

###配置你的博客app.js

	var blog = {
        msg: '未知错误。',                    //默认错误提示
        meta: 'js/meta.json',                //json文件路径
        postdir: 'post/',                    //markdown文件目录
        rooturl: 'http://example.com/#!/',   //域名

    };

    //多说账户，替换example
    window.duoshuoQuery = {short_name:"example"};

	//是否允许评论
	blog.comments = true;


###写文章

在**markdown文件目录**，存放文章，文件命名规范：`yyyy-mm-dd-your-post-title.md`

###文章索引文件`meta.json`格式：

	[
		{"tag":"标签1", "title": "文章标题1", "link": "2014-01-01-your-post-title-1"},
		{"tag":"标签2", "title": "文章标题2", "link": "2014-01-01-your-post-title-2"}
	]

##Google爬虫支持、动态feed、动态sitemap

1. servser.js依赖`feed`、`markdown`、`sitemap`。把`package.json`放在根目录，然后`npm install`。
2. `nohup node server.js &`

##Nginx配置

###Google AJAX爬虫支持
Nginx主要负责把`#!`的URL代理到node动态生成页面。

参考：[https://support.google.com/webmasters/answer/174992?hl=zh-Hans](https://support.google.com/webmasters/answer/174992?hl=zh-Hans)

	#node访问地址
	upstream nodejs {
	    server 127.0.0.1:3000;
	}

	#把example.com/?_escaped_fragment_=/post/abc的请求通过URL重写到/api
	if ($args ~ _escaped_fragment_) {
    		rewrite ^ /api;
	}

	location /api {
        proxy_set_header X-Request-URI   $request_uri;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host            $host;
        proxy_set_header Port            $server_port;
        proxy_pass http://nodejs;
        proxy_redirect off;
    }


###动态全文feed

	location ~* ^/feed.*$ {
        proxy_set_header X-Request-URI   $request_uri;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host            $host;
        proxy_set_header Port            $server_port;
        proxy_pass http://nodejs;
        proxy_redirect off;
    }

###动态sitemap

	location ~* ^/sitemap.xml.*$ {
        proxy_set_header X-Request-URI   $request_uri;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host            $host;
        proxy_set_header Port            $server_port;
        proxy_pass http://nodejs;
        proxy_redirect off;
    }

* 以上完成后，访问example.com/feed，会自动生成全文feed
* 访问examle.com/sitemap.xml，会输出最新的sitemp
* 把sitemap提交google，google会抓取你的页面，并且在搜索结果中显示example.com/#!/post/2014-01-01-your-post-title的地址
