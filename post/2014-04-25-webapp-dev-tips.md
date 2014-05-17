#webapp注意的几点

* 不要在transiton里设置改变DOM盒模型的属性，例如width、height、padding、margin等，在移动设备上会很卡。例如：
`.box{transition: height .5s}`
* 尽量采用`transform`、`translate(x,y)`，因为我发现2D、3D转换属性在移动设备上表现的很流畅
* 避开`position:fixed`，在不同的设备兼容、软键盘弹出都会出现各种复杂问题。关于固定TOP或BOTTOM，可参考：
    * http://www.lungo.tapquo.com/
    * https://github.com/douban-f2e/CardKit