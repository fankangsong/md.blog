$(function(){

    var blog = {};

    blog.msg = '未知错误。';

    blog.showpost = new Showdown.converter();

    blog.duoshuo = function(){
        window.duoshuoQuery = {short_name:"imfer"};
        function ds(){
            var el = document.createElement('div');
            el.setAttribute('data-thread-key', blog.parameter);
            el.setAttribute('data-url', 'http://blog.imfer.me/#!/post/' + blog.parameter);
            el.setAttribute('data-title', blog.title);
            DUOSHUO.EmbedThread(el)
            $('.post-content').append(el);
        }

        if(typeof(DUOSHUO) == 'undefined'){
            $.getScript('http://static.duoshuo.com/embed.js', function(){
                ds();
            });
        }
        else{
            ds();
        }
    }

    //提取tag,去重tag并排序
    blog.tags = function(){
        /* _.chain链式操作，例如_.chain(test)，就是underscore对象化test
            pluck提取tag
            uniq去重tag
            sortBy排序
            value()还原对象化的blog.data
        */
        return _.chain(blog.data).pluck('tag').uniq().sortBy().value();
    }

    //分页、分组
    blog.perPage = function(obj){
        var index = 0;
        var result = [];
        result[index] = [];

        if(obj.length > 10){
            _.each(obj, function(items, i){
                if( (i % 12) == 0 && i != 0){
                    index++;
                    result[index] = [];
                }
                result[index].push(obj[i]);
            })
            return result;
        }
        else{
            result[index] = obj;
            return result;
        }
    }

    //筛选关于当前tag的所有文章
    blog.tagPerPage = function(){
        var result =  _.filter(blog.data, function(items, i){
            return items.tag == blog.parameter
        });
        return result;
    }

    var MsgView = Backbone.View.extend({
        el: '#main',

        initialize: function(){
            _.bindAll(this, 'render');
            this.render();
        },

        render: function(){
            var template = _.template($('#msg').html(), {
                msg: blog.msg
            });
            $(this.el).html(template);
        }
    });

    
    var AppView = Backbone.View.extend({
        el: '#main',
        elHeader: '#header',

        expandMenu: function(){
            $(this.elHeader).toggleClass('expand');
        },

        initialize: function(){
            _.bindAll(this, 'render');
        },

        clearup: function(){
            this.undelegateEvents();
            $(this.el).empty();
        },

        render: function(){
            //如果标题被修改成文章标题，替换回来
            if($('title').attr('data-title')){$('title').html('IMFER.ME').attr('data-title', false);}

            /* 判断url
                #!/tags/1 先筛选所有这个tag的文章，再blog.perPage()函数分组
                #!/page/1 直接把blog.data用blog.perPage()函数分组
            */
            var perPage = blog.parameter == '' ? blog.perPage(blog.data) : blog.perPage(blog.tagPerPage());

            var template_main = _.template($('#template_main').html(), {
                perPage: perPage[blog.pagenum],
                pagination: perPage,
                tags: blog.tags(),
                tags_actived: blog.parameter,
                routename: blog.routename,
                currentPage: blog.pagenum
            });
            $(this.el).html(template_main);
        }
        
    });

    var PostView = Backbone.View.extend({
        el: '#main',
        initialize: function(){
            _.bindAll(this, 'render')
        },

        clearup: function(){
            this.undelegateEvents();
            $(this.el).empty();
        },

        render: function(){
            var self = this;

            //title
            var title = $('title');
            titlehtml = title.html();
            _.each(blog.data, function(items, i){
                if(blog.parameter == items.link){
                   title.html(items.title + '- ' + titlehtml).attr('data-title', true);
                   blog.title = items.title;
                }
            });

            //渲染markdown
            
            $.get('post/' + blog.parameter + '.md?' + Math.random(), function(response){
                var template =  _.template($('#template_post').html(), {
                    post: blog.showpost.makeHtml(response),
                    link: blog.parameter,
                    title: blog.title
                });
                $(self.el).html(template);
            }).done(function(){
                blog.duoshuo();
            })
            .fail(function() {
                blog.msg = '文件不存在，或者已经删除了。<br><a href="#">回首页</a>';
                var error = new MsgView();
            });
        }
    });

	var aboutView = Backbone.View.extend({
		initialize: function(){
			console.log('about view')
		}
	})

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            '!about': 'about',
            '!page/:num': 'page',
            '!tags/:tag/:num': 'tag',
            '!post/:title': 'post'
        },

        view: function (appview, routename, parameter, pagenum) {
            blog.routename = routename;
            blog.parameter = parameter;
            blog.pagenum   = pagenum;

            if(this.thisView){
                this.thisView.clearup();
            }
            this.thisView = appview;
            this.thisView.render();
        },

        about: function(){
    		var appview = new PostView();
            this.view(appview, 'post', 'about', 0);
        },

        index: function(){
            var appview = new AppView();
            this.view(appview, 'index', '', 0);
        },

        page: function(num){
            var appview = new AppView();
            this.view(appview, 'page', '', Number(num - 1));
        },

        tag: function(tag, num){
            var appview = new AppView();
            this.view(appview, 'tag', tag, Number(num - 1));
        },

        post: function(title){
            var appview = new PostView();
            this.view(appview, 'post', title, 0);
        }
    });

	var app;

    //加载状态
    $('#main').html('<div class="loading">加载...</div>');

    $.getJSON('meta.json', function(response){
        blog.data = _.sortBy(response, function(items){
            return -( Number(items.link.substring(0, 10).replace(/\-/g, '')) );
        });
    }).done(function(){
        app = new AppRouter;
        Backbone.history.start();
    });
});