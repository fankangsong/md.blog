# Nginx反向代理非80端口

电信一直是封锁了普通宽带用户的`80`、`8080`端口，[路由器上设置动态域名](http://blog.imfer.me/#!post/2014-04-25-raspberry-pi-cross-gfw)，只能通过端口转发访问web页面。

Nginx本身支持代理，通过VPS上的Nginx代理到路由，通过VPS的80端口，代理到路由的8000端口。

在VPS的Nginx配置：

    server {
        listen       80;#VPS监听80端口
        server_name  proxy.domian.com #VPS的域名
        location / {
            proxy_pass http://test.f3322.org:8000; #路由器的动态域名
            proxy_set_header Host $host:8000;  
        }
    }

重启Nginx

    service nginx restart
