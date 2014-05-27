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
            META.data = _.sortBy(META.data, function(items){
                return -( Number(items.link.substring(0, 10).replace(/\-/g, '')) );
            });
            
            //首页
            if(META._route == 'index'){
                META._groups = this.groupBy(META.data);
                this.archives(META._groups, 0);
            }

            //分页
            if(META._route == 'page'){
                META._groups = this.groupBy(META.data);
                this.archives(META._groups, Number(META._par - 1));
            }

            if(META._route == 'tag'){
                META._groups = this.groupBy(this.filter());
                this.archives(META._groups, Number(META._tag_num - 1))
            }

            //正文
            if(META._route == 'post'){
                this.post(this.title);
            }
        },

        menufoo: function(){
            $(this.header).toggleClass('expand');
        },

        filter: function(){
            var self = this;
            META._tags =  _.filter(META.data, function(items, i){
                return items.tag == META._par
            });
            return META._tags;
        },

        groupBy: function(objs){
            var a = 0;
            META._groups = [];
            META._groups[a] = [];

            if(objs.length > 10){
                for(var i = 0; i < objs.length; i++){
                    
                    if( (i % 12) == 0 && i != 0){
                        a++;
                        META._groups[a] = [];
                    }
                    META._groups[a].push(objs[i]);
                }

                return META._groups;
            }
            else{
                META._groups[a] = objs;
                return META._groups;
            }
        },

        archives: function(groups, page_num){

            if($('title').attr('data-title')){
                $('title').html('IMFER.ME').attr('data-title', false);
            }

            var tags = _.pluck(META.data, 'tag');
            tags = _.uniq(tags);
            tags = _.sortBy(tags);
            var current_tag = META._par;

            var template_main = _.template($('#template_main').html(), {
                data: groups[page_num],
                links: groups,
                tags: tags,
                current_tag: current_tag,
                path: META._route,
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
            META.page_title = $('title').html();
            _.each(META.data, function(items, i){
                if(META._par == items.link){
                   $('title').html(items.title + '- ' + META.page_title).attr('data-title', true);
                   META.post_title = items.title;
                }
            });

            //渲染markdown
            var showpost = new Showdown.converter();
            $.get('post/' + META._par + '.md?' + Math.random(), function(response){
                var template_post = _.template($('#template_post').html(), {
                    post: showpost.makeHtml(response),
                    link: META._par,
                    title: META.post_title
                });

                $(self.el).html(template_post);

            }).done(function(){
                bar.animate({
                'width': '100%'
                }, 200, function(){
                    bar.css({
                        'width': 0
                    })
                })
            }).fail(function(){
                bar.animate({
                'width': '0'
                }, 200);
                var msg = new AppViewMsg();
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

        view: function (appview, _route, _par, _tag_num) {
            META._route = _route;
            META._par = _par;
            META._tag_num = _tag_num;

            if(this.currentView){
                this.currentView.clearup();
            }
            this.currentView = appview;
            this.currentView.render();
        },

        index: function(){
            var appview = new AppView();
            this.view(appview, 'index');
        },

        page: function(num){
            var appview = new AppView();
            this.view(appview, 'page', num);
        },

        tag: function(tag, num){
            var appview = new AppView();
            this.view(appview, 'tag', tag, num);
        },

        post: function(title){
            var appview = new AppView();
            this.view(appview, 'post', title);
        }
    });



    var META = new List();
    META.fetch({
        url: 'meta.json?' + Math.random(),
        success: function(collection, response){
            META.data = response;
            var app = new AppRouter;
            Backbone.history.start();
        },
        error: function(collection, response){
            var msg = new AppViewMsg();
        }
    });

});