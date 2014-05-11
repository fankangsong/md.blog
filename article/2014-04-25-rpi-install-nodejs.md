Raspberry Pi如果编译安装node.js，网上有人尝试过需要3个小时。node其实有arm版本，下载之后，用/etc/profile配置下环境变量，5分钟搞掂。

下载arm版本的node并解压缩：

    wget http://nodejs.org/dist/v0.10.2/node-v0.10.2-linux-arm-pi.tar.gz
    tar xvzf node-v0.10.2-linux-arm-pi.tar.gz


拷贝文件到`/opt/node`目录：

    mkdir /opt/node #新建文件夹
    cp -r node-v0.10.2-linux-arm-pi/* /opt/node


编辑`vi /etc/profile`文件，保存以下：

    NODE_JS_HOME="/opt/node"
    PATH="$PATH:$NODE_JS_HOME/bin"
    export PATH


注意：

1. 我是root账户安装的；
2. 配置好环境变量，需要`logout`之后在登录才生效；

最后，运行一下`node -v`、`npm -v`，如果返回版本就安装好了。




