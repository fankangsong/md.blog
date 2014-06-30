var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var md = require('markdown').markdown;



function onRequest(request, response){
    var objectUrl = url.parse(request.url);
    var objectQuery = querystring.parse(objectUrl.query);


    if(typeof(objectQuery['_escaped_fragment_']) != 'undefined'){
        var pathname = objectQuery['_escaped_fragment_'];
        //console.log((/^\//).test(pathname));
        pathname = (/^\//).test(pathname) ? pathname.replace(/^\//, '') : pathname;
        try{
            fileContent = fs.readFileSync(pathname + '.md', 'utf8');
            t = fileContent.match(/.+/);
            fileContent = md.toHTML(fileContent);

            var htm = '<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>'
                        + t[0].replace(/\#?/, '')
                        + ' - IMFER.ME</title></head><body>'
                        + fileContent
                        + '</body></html>';

            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(htm);
            response.end();
        }
        catch(e){
            response.writeHead(404, {'Content-Type': 'text/html'});
            var filecontent = fs.readFileSync('404.html', 'utf8');

            response.write(filecontent);
            response.end();
        }
    }
}
http.createServer(onRequest).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');