md.blog
=======

DEMO:[blog.imfer.me](http://blog.imfer.me)

##前端

* 基于`Backbone.js`、`showdown.js`
* 纯静态博客，不需要生成编译
* MarkDown格式撰写博客

##SEO（Ajax爬虫支持）

* `server.js`用于实现[Google Ajax crawling](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0CB4QFjAA&url=https%3A%2F%2Fdevelopers.google.com%2Fwebmasters%2Fajax-crawling%2Fdocs%2Fspecification&ei=BnCtU5WdD4rhoAS-voHwAw&usg=AFQjCNHAdDtPkq9FhhnILAdTSU3uGFESnw&sig2=KHK0Jrx4ogAPKVtz55lNSg)实现爬虫抓取
* `gruntjs`生成sitemap.xml

##Nginx配置（Ajax爬虫支持）

    upstream nodejs {
        # node server.js运行的端口
        server 127.0.0.1:3000;
    }
    server{
        #默认配置，此处忽略
        #
        #匹配domain.com/?_escaped_fragment_
        if ($args ~ _escaped_fragment_) {
                rewrite ^ /api;
        }
        location ~ /api{
            proxy_set_header X-Request-URI   $request_uri;
            proxy_set_header X-Real-IP       $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host            $host;
            proxy_set_header Port            $server_port;
            proxy_pass http://nodejs;
            proxy_redirect off;
        }
    }

