#盒模型content box和border box

假设表单元素已经使用css reset重置了浏览器默认样式。

    button{
      width: 100px;
      padding: 5px 10px;
    }

这段样式，是为了给button设置宽度100px，左、右内补丁10px，按照标准盒模型，宽度应该是`10px + 100px + 10px = 120px`，但是在浏览器实际渲染后，真实宽度还是100px。

这是因为css的盒模型属性`box-sizing`有两种值`content-box`、`border-box`。在计算`width`和`height`时：

* `content-box`不包括`padding`值；
* `border-box`包括`padding`值；

除了`form`、`fieldset`容器表单元素外，`input`、`button`、`select`的默认`box-sizing`属性都是`content-box`。

这也是bootstrap在样式重置时，使用了如下代码：

    * {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
