
#centos 使用 Dropbox 同步

##安装

`cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86" | tar xzf -`

## 授权

`~/.dropbox-dist/dropboxd`

首次启动dropbox需要授权，复制授权URL到浏览器进行验证。

## 下载dropbox.py
dropbox.py是官方提供方便管理dropbox的命令工具，我下载到~/目录下，方便调用。


	wget https://www.dropbox.com/download?dl=packages/dropbox.py
	chmod +x ./dropbox.py
	~/dropbox.py help


在任意位置启动dropbox.py可以这样`~/dropboxy.py`

* 查看dropbox 工作状态`~/dropbox.py status`
* 开始同步 `~/dropbox.py start`
* 开始同步 `~/dropbox.py stop`

## 选择性同步文件夹
使用dropbox.py exclude命令，可以排除不同步的目录
```
~/dropbox.py exclude help #帮助
```

例如你不需要同步Dropbox/books/目录，进入Dropbox目录`cd ~/Dropbox`，运行exclude来排除books目录：

```
~/dropboxy.py exclude add books #当前目录最好在Dropbox
```

更多不需要同步的目录：

```
~/dropboxy.py exclude add book photos Public Documents #排除Dropbox目录下books, photos, Public, Documents等目录
```


###参考
* [https://www.dropbox.com/install?os=lnx](https://www.dropbox.com/install?os=lnx)
* [https://www.dropbox.com/help/175/zh_CN](https://www.dropbox.com/help/175/zh_CN)
{rd-over:ride{forward-socks5 127.0.0.1:7127 .}}
