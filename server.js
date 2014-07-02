var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var md = require('markdown').markdown;
var feed = require('feed');
var sm = require('sitemap');

var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                    results = results.concat(res);
                if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                if (!--pending) done(null, results);
                }
            });
        });
    });
};

function write(response, code, type, content){
    response.writeHead(code, {'Content-Type': 'text/' + type});
    response.write(content);
    response.end();
}

function readFile(filepath){
    var content = fs.readFileSync(filepath, 'utf8');
    var title = content.match(/.+/)[0].replace(/\#?/, '');
    return {'content': content, 'title': title}
}

function route(request, current, func){
    var objurl = url.parse(request.url);
    var objquery = querystring.parse(objurl.query);
    return {'pathName': objurl.pathname, 'pathQuery': objquery}
}

function onRequest(request, response){
    var routes = route(request);

    //ajax爬虫支持
    if(typeof(routes.pathQuery['_escaped_fragment_']) != 'undefined'){
        var filename = routes.pathQuery['_escaped_fragment_'];
        filename = (/^\//).test(filename) ? filename.replace(/^\//, '') : filename;
        try{
            var mdfile = readFile(filename + '.md');
            var htmfile = md.toHTML(mdfile.content);
            //console.log(mdfile.title);
            var htm = '<html><head><meta charset="utf-8"><title>'
                        + mdfile.title
                        + ' - 出走 - blog.imfer.me</title><meta name="author" content="fankangsong@gmail.com" /><link rel="alternate" type="application/rss+xml" href="/feed" title="出走"></head><body>'
                        + htmfile
                        + '</body></html>';
            write(response, 200, 'html', htm);
        }catch(e){
            write(response, 404, 'html', fs.readFileSync('404.html', 'utf8'));
        }
    }

    //feed生成
    if(routes.pathName == '/feed'){
        var myfeed = new feed({
            title:          '出走',
            description:    '音乐、皮艺、摄影、胶片、电影爱好者。前端开发。',
            link:           'http://blog.imfer.me/',
            image:          'http://blog.imfer.me/image.png',
            copyright:      'All rights reserved 2014, imfer.me',

            author: {
                name:       'fer',
                email:      'fankangsong@gmail.com',
                link:       'http://imfer.me/'
            }
        });

        walk('post', function(a, posts){
            for(var i in posts){
                 myfeed.addItem({
                    title:          readFile(posts[i]).title,
                    link:           'http://blog.imfer.me/#!/' + posts[i].replace('.md', ''),
                    description:    md.toHTML( readFile(posts[i]).content ),
                    content:        '',
                    author: [
                        {
                            name:   'fer',
                            email:  'fankangsong@gmail.com',
                            link:   'http://imfer.me/'
                        }
                    ],
                    contributor: [
                        {
                            name:   'fer',
                            email:  'fankangsong@gmail.com',
                            link:   'http://imfer.me/'
                        },
                        {
                            name:   'fer',
                            email:  'fankangsong@gmail.com',
                            link:   'http://imfer.me/'
                        }
                    ],
                    date:           fs.statSync(posts[i]).ctime,
                    image:          'http://blog.imfer.me/image.png'
                });
            }
            write(response, 200, 'xml', myfeed.render('atom-1.0'));
        });   
    }

    //sitemap生成
    if(routes.pathName == '/sitemap.xml'){
        var arr = [], temp;
        walk('post', function(a, posts){
            temp = posts;

            for(var key in temp){
                arr[key] = {
                    url: '#!/' + temp[key].replace('.md', ''),
                    changefreq: 'daily',
                    priority: '0.8'
                }
            }

            var sitemap = sm.createSitemap ({
                hostname: 'http://blog.imfer.me/',
                cacheTime: 600000,
                urls: arr
            }); 

            sitemap.toXML(function(xml){
                write(response, 200, 'xml', xml );
            })

            
        });
    }

}
http.createServer(onRequest).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');