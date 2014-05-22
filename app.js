$(function() {
    var Post = Backbone.Model.extend({
        initialize: function(){
            //console.log('create model');
        },

        defaults: {
            'title': '',
            'link': ''
        }
    });

    var List = Backbone.Collection.extend({
        initialize: function(){
            //console.log('create collection');
        },
        model: Post
    });

    var AppViewMsg = Backbone.View.extend({
        el: '#main',

        initialize: function(){
            _.bindAll(this, 'render');
            this.render();
        },

        render: function(){
            var template_msg = $('#msg').html();
            $(this.el).html(template_msg);
        }
    });

    var AppView = Backbone.View.extend({
        el: '#main',
        header: '#header',

        events: {
            'touchstart #iconmenu': 'menufoo'
        },

        initialize: function(){
            //绑定this
            _.bindAll(this, 'filter', 'groupBy', 'archives', 'post', 'render');
            //this.render();
        },

        clearup: function(){
            this.undelegateEvents();
            $(this.el).empty();
        },

        render: function(){
            //反序
            g_meta.data = _.sortBy(g_meta.data, function(items){
                return -( Number(items.link.substring(0, 10).replace(/\-/g, '')) );
            });
            
            //首页
            if(g_meta.path == 'index'){
                this.groups = this.groupBy(g_meta.data);
                this.archives(this.groups, 0);
            }

            //分页
            if(g_meta.path == 'page'){
                this.groups = this.groupBy(g_meta.data);
                this.archives(this.groups, Number(g_meta.par - 1));
            }

            if(g_meta.path == 'tag'){
                this.groups = this.groupBy(this.filter());
                //console.log(this.groups[0]);
                this.archives(this.groups, Number(g_meta.tag_page_num - 1))
            }

            //正文
            if(g_meta.path == 'post'){
                this.post(this.title);
            }
        },

        menufoo: function(){
            $(this.header).toggleClass('expand');
        },

        filter: function(){
            var self = this;
            var tags =  _.filter(g_meta.data, function(items, i){
                return items.tag == g_meta.par
            });
            //console.log(tags);
            return tags;
        },

        groupBy: function(objs){
            var a = 0;
            this.groups = [];
            this.groups[a] = [];

            if(objs.length > 10){
                for(var i = 0; i < objs.length; i++){
                    
                    if( (i % 12) == 0 && i != 0){
                        a++;
                        this.groups[a] = [];
                    }
                    this.groups[a].push(objs[i]);
                }

                return this.groups;
            }
            else{
                this.groups[a] = objs;
                return this.groups;
            }
        },

        archives: function(groups, page_num){

            if($('title').attr('data-title')){
                $('title').html('IMFER.ME').attr('data-title', false);
            }

            var tags = _.pluck(g_meta.data, 'tag');
            tags = _.uniq(tags);
            var current_tag = g_meta.par;

            var template_main = _.template($('#template_main').html(), {
                data: groups[page_num],
                links: groups,
                tags: tags,
                current_tag: current_tag,
                path: g_meta.path,
                current_num: page_num
            });
            $(this.el).html(template_main);
        },

        post: function(){
            var self = this;

            var bar = $('.bar');
            bar.animate({
                'width': '80%'
            }, 500);

            $('.footer').addClass('fix');

            //加个title
            this.page_title = $('title').html();
            _.each(g_meta.data, function(items, i){
                if(self.par == items.link){
                   $('title').html(items.title + '- ' + self.page_title).attr('data-title', true);
                   self.post_title = items.title;
                }
            });

            //渲染markdown
            var showpost = new Showdown.converter();
            $.get('post/' + g_meta.par + '.md?' + Math.random(), function(response){
                var template_post = _.template($('#template_post').html(), {
                    post: showpost.makeHtml(response),
                    link: self.par,
                    title: self.post_title
                });

                $(self.el).html(template_post);

                //$(self.el).html();
                bar.animate({
                'width': '100%'
                }, 200, function(){
                    bar.css({
                        'width': 0
                    })
                })
            });
        }
        
    });

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            '!page/:num': 'page',
            '!tags/:tag/:num': 'tag',
            '!post/:title': 'post',
        },

        view: function(path, par, tag_page_num){
            g_meta.path = path;
            g_meta.par = par;
            g_meta.tag_page_num = tag_page_num;
            if(mainView){
                mainView.remove();
            }
            var mainView = new AppView();
            mainView.render()
            
        },

        switchView: function (view, path, par, tag_page_num) {
            g_meta.path = path;
            g_meta.par = par;
            g_meta.tag_page_num = tag_page_num;

            if(this.currentView){
                this.currentView.clearup();
            }
            this.currentView = view;
            this.currentView.render();
        },

        index: function(){
            var view = new AppView();
            this.switchView(view, 'index');
        },

        page: function(num){
            var view = new AppView();
            this.switchView(view, 'page', num);
        },

        tag: function(tag, num){
            var view = new AppView();
            this.switchView(view, 'tag', tag, num);
        },

        post: function(title){
            var view = new AppView();
            this.switchView(view, 'post', title);
        }
    });



    var g_meta = new List();
    g_meta.fetch({
        url: 'post/meta.json?' + Math.random(),
        success: function(collection, response){
            g_meta.data = response;
            var app = new AppRouter;
            Backbone.history.start();
        },
        error: function(collection, response){
            var msg = new AppViewMsg();
        }
    });

});