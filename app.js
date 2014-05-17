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
        model: Post,
        url: 'meta.json',
    });

    var View = Backbone.View.extend({
        initialize: function(){
            //绑定this
            _.bindAll(this, 'meta', 'filter', 'groupBy', 'archives', 'post', 'render');
            //this.meta();
        },

        meta: function(){
            var self = this;

            //实例一个Collection
            this.list = new List();

            //获取实例的JSON数据
            this.list.fetch({
                /*
                    [option]
                    collection 实例的collection,
                    response fech的JSON数据
                */
                success: function(collection, response){
                    self.data = response;
                    self.render();
                },
                error: function(collection, response){
                    //console.log('error');
                }
            });
        },

        filter: function(){
            var self = this;
            var tags =  _.filter(this.data, function(items, i){
                return items.tag == self.par
            });
            //console.log(tags);
            return tags;
        },

        groupBy: function(objs){
            //console.dir(objs)
            //debugger;
            var a = 0;
            this.groups = [];
            this.groups[a] = [];

            if(objs.length > 10){
                for(var i = 0; i < objs.length; i++){
                    this.groups[a].push(objs[i]);
                    if( (i % 9) == 0 && i != 0){
                        a++;
                        this.groups[a] = [];
                    }
                }

                return this.groups;
            }
            else{
                //console.log('haha');
                this.groups[a] = objs;
                return this.groups;
            }
        },

        archives: function(groups, page_num){
            var tags = _.pluck(this.data, 'tag');
            tags = _.uniq(tags);
            var current_tag = this.par;
            console.log(current_tag)

            var template_list = _.template($('#template_list').html(), {
                data: groups[page_num],
                links: groups,
                tags: tags,
                current_tag: current_tag,
                path: this.path,
                current_num: page_num
            });
            $('#main').html(template_list);
        },

        post: function(){
            var self = this;

            //加个title成本好高
            _.each(this.data, function(items, i){
                if(self.par == items.link){
                    //console.log(items.title);
                    $('title').html(items.title + ' - IMFER.ME');
                }
            });

            //渲染markdown
            var showpost = new Showdown.converter();
            $.get('post/' + this.par + '.md?' + Math.random(), function(response){
                $('#main').html(showpost.makeHtml(response))
            });
        },

        render: function(){
            //console.log('index')
            if(!this.data){
                this.meta();
                return;
            }
            //反序
            this.data = _.sortBy(this.data, function(items){
                return -( Number(items.link.substring(0, 10).replace(/\-/g, '')) )
            });

            //console.log(this.data);

            //首页
            if(this.path == 'index'){
                this.groups = this.groupBy(this.data);
                this.archives(this.groups, 0);
            }

            //分页
            if(this.path == 'page'){
                this.groups = this.groupBy(this.data);
                this.archives(this.groups, Number(this.par - 1));
            }

            if(this.path == 'tag'){
                //console.dir(this.filter())
                this.groups = this.groupBy(this.filter());
                //console.log(this.groups[0]);
                this.archives(this.groups, Number(this.tag_page_num - 1))
            }

            //正文
            if(this.path == 'post'){
                this.post(this.title);
            }
        }
        
    });

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            '!page/:num': 'page',
            //'!tags/:tag': 'tag',
            '!tags/:tag/:num': 'tag',
            '!post/:title': 'post',
        },

        view: function(path, par, tag_page_num){
            var main_view = new View;
            main_view.render();
            main_view.path = path;
            main_view.par = par;
            main_view.tag_page_num = tag_page_num
        },

        index: function(){
            this.view('index', '', '');
        },

        page: function(num){
            this.view('page', num);
        },

        tag: function(tag, num){
            this.view('tag', tag, num);
        },

        post: function(title){
            this.view('post', title);
        }
    });

    var app = new AppRouter;
    Backbone.history.start();
});