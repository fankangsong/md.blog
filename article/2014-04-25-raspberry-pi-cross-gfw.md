## 前言

我一直用Raspberry Pi做翻墙的代理服务器，最开始只是为了避免在本地安装shadowsocks的客户端，于是shadowsocks客户端安装到RPi挂到路由器上。后来在VPS上安装了VPN给iPhone和iPad用，但是在iOS上VPN开开关关的太麻烦了，于是开始用Privoxy转发SOCKS到HTTP代理，配合[gfwlist2pac](https://github.com/clowwindy/gfwlist2pac)自动代理，但是问题又来了，PAC文件在iOS上性能太差了，经常让我的设备卡死。于是又想着用Privoxy的action来过滤，让规则和代理全部都在服务器完成，碰到过各种小问题，花了不少时间解决。折腾了这么久，把过程中的问题和经验记录一下。

##目录

1. 服务器
    1. [centos安装node](#vps%E5%AE%89%E8%A3%85node)
    2. [centos安装shadowsocks](#centos%E5%AE%89%E8%A3%85shadowsocks)

2. 本地
    1. [Raspberry Pi 安装node](#raspberry-pi-%E5%AE%89%E8%A3%85node)
    2. [安装privoxy](#%E5%AE%89%E8%A3%85privoxy)
    2. [使用gfw.action](#gfwaction)
3. [动态域名](#%E5%AE%89%E8%A3%85privoxy)

###VPS安装node

移步：[centos安装node](https://github.com/fankangsong/note/wiki/centos-5-%E5%AE%89%E8%A3%85nodejs)

###centos安装shadowsocks

移步：[https://github.com/clowwindy/shadowsocks-nodejs](https://github.com/clowwindy/shadowsocks-nodejs)

###Raspberry Pi 安装node

在Raspberry Pi如何编译安装node速度非常慢，据说3个小时，所以node已提供编译好的arm版本，安装方法：[Raspberry Pi 快速安装node.js](https://github.com/fankangsong/note/wiki/Raspberry-Pi-%E5%BF%AB%E9%80%9F%E5%AE%89%E8%A3%85node.js)

安装shadowsocks本地客户端一样使用npm，但是国内访问npm源网络很糟糕，不想美国VPS那样速度快，所以最好[设置一下npm镜像](https://github.com/fankangsong/note/wiki/npm%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F%EF%BC%88%E8%BD%AC%EF%BC%89)

###安装privoxy

安装privoxy如果遇到这样的错误`insserv: warning: script 'mathkernel' missing LSB tags and overrides`，可以用一下方法处理[来源][1]：
```
apt-get remove wolfram-engine
```
###gfw.action
下载gfw.action：

    cd ~/
    git clone https://github.com/cckpg/autoproxy2privoxy.git
    cp ~/autoproxy2privoxy/gfw.action /etc/privoxy/


修改gfw.action：
```
vi /etc/privoxy/gfw.action
```

把`{+forward-override{forward-socks5 127.0.0.1:7127 .}}` 这里的IP地址换成RPi的IP，然后端口改成`1080`，因为我安装的shadowsocks默认IP是`1080`。

privoxy设置：

    cp /etc/privoxy/config /etc/privoxy/config.bak #备份config文件
    vi /etc/privoxy/config


搜索`listen-address`并编辑：
```
listen-address 10.0.0.2:8118
```
最好写RPi的局域网IP地址，如果写`127.0.0.1`或者`localhost`，会有局域网机器无法访问代理，外网也无法访问代理的问题，具体原因我不知道。

搜索`.action`并添加一行：
```
actionsfile gfw.action
```

重新启动privoxy，配置生效：
```
/etc/init.d/privoxy restart
```

注意，如果使用action，就不要使用`forward`转发端口，因为action里已经设置了匹配的URL走socks代理，刚开始我就犯了这个低级错误。

##动态域名指向RPi,随时随地翻墙

[DNSPOD](https://www.dnspod.cn/)提供免费的域名解析服务，还有开放API。

为什么要使用动态域名，因为电信分配给ADSL用户的外网IP，每24小时刷新一次，域名及时解析到路由器，24小时候就失效。DNSPOD提供了动态域名工具，因为RPi默认是已经安装了python，于是我选择这个工具来上报IP给DNSPOD：[https://gist.github.com/833369](https://gist.github.com/833369)

下载脚本`git clone https://gist.github.com/833369.git`

首先要在DNSPOD设置A记录解析，例如把pi.domian.com解析到你的RPi：

1. 先在路由查看公网IP
2. 在DNSPOD控制台把pi.domian.com解析到公网IP；
3. 通过 `curl -k https://dnsapi.cn/Domain.List -d "login_email=xxx&login_password=xxx"`（用你的EMIAL和密码替换）来查看pi.domian.com的ID；
4. 编辑`vi pypod.py`文件，用自己的账户密码还有pi.domain.com的ID替换文件里的；

以上完成后 `nohup python pypod.py`，后来运行脚本。

最后，需要在路由坐下端口映射，把8118映射到RPi的IP，这样在公司还是外地，你都可以通过pi.domain.com:8118访问你的RPi，穿越GFW。


[1]: 来源 http://www.raspberrypi.org/forums/viewtopic.php?f=66&t=68263