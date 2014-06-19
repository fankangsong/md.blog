#Raspberry Pi能干什么呢

updated: 2012-8-20 关于linux下的摄像头，淘宝有301芯片方案的摄像头在linux免驱，或者在[官方wiki](http://elinux.org/RPi_VerifiedPeripherals)上找下已经支持的设备

updated: 2012-12-24 动态域名请参考这个帖子[http://blog.imfer.me/2012/12/raspberry-pi.html](http://blog.imfer.me/2012/12/raspberry-pi.html)

买回来折腾了一个多星期，提前要准备的附件：HDMI转DVI/VGA线、USB键盘、鼠标，一个5V/1A左右的电源，最好也买一个带电源的USB HUB。这些我都是从京东采购的，除了购买的一个摄像头无法安装驱动外，其他都正常工作。摄像头后来我在淘宝买到了linux下面驱动的，一般是z301芯片的摄像头，在linux内核都已经完美支持了。那么RPi能干嘛呢？我做了这些：</p>

*   轻量的web server，我选择了lighttpd这个工具。
*   局域网的proxy server，我是购买了海外服务器的ssh帐号，然后用privoxy把socket转http端口
*   webcam server，安装motion，然后通过路由映射端口或者DMZ，绑定花生壳，在任何地方都可以看到你的摄像头<div class="center">![Raspberry Pi(来自Dropbox分享的图片）](https://dl.dropbox.com/u/2589242/2012-08-11%2011.00.04.jpg)</div>

我自己也手工做了一个外壳，后来还是在淘宝买了一个。工具有限。
<div class="center">![](https://dl.dropbox.com/u/2589242/2012-08-07%2022.16.47.jpg)</div>