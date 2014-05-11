
# centos 5 安装 nodejs

## 准备工作
最好先update下源：

```
sudo yum update
```

安装编译需要的gcc, g++, bzip2，必须在安装python之前安装：

    yum install -y bzip2*
    yum install gcc
    yum install gcc-c++

nodejs安装依赖Python，一般安装失败，通常都是Python版本过低造成的，首先确认Python版本：

```
    python -V #查看Python版本
```

如果版本低于2.7，先升级Python：


    wget http://www.python.org/ftp/python/2.7.3/Python-2.7.3.tgz
    tar zvxf Python-2.7.3.tgz
    cd Python-2.7.3
    ./configure
    make && make install
    python -V     #查看Python版本2.4


默认python指向2.7

    sudo mv /usr/bin/python /usr/bin/python-bak  
    sudo ln -s /usr/local/bin/python2.7 /usr/bin/python

让yum默认使用2.4版本的，因为yum无法在高版本工作


    sudo vim /usr/bin/yum
    #/usr/bin/python #改为#/usr/bin/python2.4


## 开始安装nodejs

下载源文件

```
wget http://nodejs.org/dist/v0.10.26/node-v0.10.26.tar.gz
```

解压、编译、安装：


    tar zxvf node-v0.10.26.tar.gz
    cd node-v0.10.26
    ./configure
    make
    make install
    node --version #查看版本

