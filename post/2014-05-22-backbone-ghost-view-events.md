#Backbone处理同一视图中的DOM事件

##目的

路由`/#`与`/#page`渲染同样的视图，并且用同样的按钮绑定不同的事件。

###第一步，先写好HTML模版：

	<script type="text/template" id="template">
		<p><a href="#">index视图</a></p>
		<p><a href="#!detail">detail视图</a></p>
		<button type="button" id="btn">Button</button>
	</script>

###第二步，视图代码：

	var AppView = Backbone.View.extend({
        el: '#main',

        events:{
            'click #btn': 'foo'
        },

        initialize: function(){
            _.bindAll(this, 'render', 'foo');
            this.render();
        },

        render: function(){
            var template = _.template($('#template').html(), {})
            $(this.el).html(template);
        },

        foo: function(){
            alert(this.url);
        }
    });

###第三步，路由代码：

	var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            '!detail': 'detail'
        },

        index: function(){
            var viewIndex = new AppView();
            viewIndex.url = 'index';
        },

        detail: function(num){
            var viewPage = new AppView();
            viewPage.url = 'detail';
        }
    });

好了，现在代码看上去没什么问题了。页面初始化，`Button`点击后触发`alert`事件。然后切换视图到detail，再点击Button，`alert`事件被触发了两次，但是我只希望`Button`点击只触发一次，并且是触发detail自己事件。解决这个问题，需要在路由里，对视图的事件进行清理。于是我写了这一样一个函数放在路由器里：

	view: function(view) {
        if(this.currentView){
            this.currentView.clearup();
        }
        this.currentView = view;
        this.currentView.render();
    }

给视图`AppView`一个`clearup`方法用来清理事件：

	clearup: function(){
        this.undelegateEvents();
        $(this.el).empty();
    }

接下来，在路由触发时，做一些操作，确保视图渲染前，事件被清理：

	index: function(){
        var viewIndex = new AppView();
        viewIndex.url = 'index';
        this.view(viewIndex, 'index');
    },

    detail: function(num){
        var viewPage = new AppView();
        viewPage.url = 'detail';
        this.view(viewPage, 'page', num);
    }

完工，完整的代码[移步](http://fankangsong.github.io/demo/backbone-view-events/test.html)