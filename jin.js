// jin JavaScript Library v2.1
//
// http://weibo.com/chenjinfu/
// http://3yew.com/
//
// Copyright 2012, jin
//

//window 以参数方式传进来，沙箱模式，undefined定为局部变量，提高性能
(function(window, undefined) { 

//使document指向参数window里的document
var document = window.document,
	location = document.location;
	
var jin={
	//调试开关，开发模式下请设置true，发布时请false
	errFlag:true,
	
	//静态数值
	numState:"20120410",
	
	//当前url
	nowUrl:window.document.location.href,
	
	// fn:		类型判断
	// author:	jin
	// param:	{any} o 判断对象
	// return:	{string} 返回判断字符串
	//			可选字符串有:"Boolean","Number","String","Function","Array","Date","RegExp","Object","undefined",等
	type:function(o){   
		//"Boolean","Number","String","Function","Array","Date","RegExp","Object","undefined"
		var t=Object.prototype.toString.call(o),l=t.length;
		return o==null?String(o):t.slice(8,l-1);
	},
	
	// fn:		删除左右两端的空格
	// author:	jin
	// param:	{string} str 要处理的字符串
	// return:	{string} 返回处理好的字符串
	trim:function(str){
		 return str.replace(/(^\s+)(\s+$)/g,"");
	},

	// fn:		删除左边的空格
	// author:	jin
	// param:	{string} str 要处理的字符串
	// return:	{string} 返回处理好的字符串
	ltrim:function(str){
		 return str.replace(/(^\s+)/g,"");
	},
	
	// fn:		删除右边的空格
	// author:	jin
	// param:	{string} str 要处理的字符串
	// return:	{string} 返回处理好的字符串
	rtrim:function(str){
		 return str.replace(/(\s+$)/g,"");
	},
	// fn:		调试函数
	// author:	jin
	// param:	{function} factor 条件逻辑函数，return false触发err
	// 			{string} errName错误名称
	//			{string | array[string]} errRemark错误说明
	// example:	jin.err(function(){...return false;},"errTitle","err:err test1");
	//			jin.err(function(){...return false;},"errTitle",["err:err test1","err:err test2"]);
	err:function(factor,errName,errRemark){
		if(jin.errFlag && !factor() && console){
			console.group(errName);
			if(jin.type(errRemark)==="String"){
				console.log(errRemark);
			}else if(jin.type(errRemark)==="Array"){
				var len=errRemark.length;
				for(var i=0;i<len;i++){
					console.log(errRemark[i]);
				}
			}
			console.groupEnd();
		}
	},
	
	// fn:		生成固定长度随机字符串
	// author:	jin
	// return:	{string} 随机字符串
	getRandom:function(){
		var start=1000,end=9999;
		jin._getRandom=jin._getRandom+1 || start;
		if(jin._getRandom>end){
			jin._getRandom=start;
		}
		return "j"+new Date().getTime()+jin._getRandom;
	},
	
	// fn:		遍历Object中所有元素
	// author:	from:tangram-1.5.2.source.js
	// param:	{Object} source 需要遍历的Object
	//			{Function} iterator 对每个Object元素进行调用的函数，function (item, key)
	// return:	{Object} 遍历的Object
	each:function(source,iterator){
		var returnValue, key, item; 
		if ('function' == typeof iterator) {
			for (key in source) {
				if (source.hasOwnProperty(key)) {
					item = source[key];
					//TODO
					//此处实现和标准不符合，标准中是这样说的：
					//If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
					returnValue = iterator.call(source, item, key);
			
					if (returnValue === false) {
						break;
					}
				}
			}
		}
		return source;
	},
	
	// fn:		url添加参数
	// author:	jin
	// param:	{string} key 键名
	// 			{string} val 键值
	// 			{string} [url] 待处理url；默认使用当前url
	// return:	{string} 结果url字符串
	// remark:	请注意使用该函数时url中的锚点将会被免费清除
	addQueryValue:function(key,val,url){
		var strurl=url || jin.nowUrl;
		strurl=strurl.replace(/#.*/gi,"");
		if(strurl.indexOf("?")<0){
			return strurl+"?"+key+"="+val;
		}else{
			var laststr=strurl.slice(-1);
			if(laststr=="&"){
				return strurl+key+"="+val;
			}else{
				return strurl+"&"+key+"="+val;
			}
		}
	},

	// fn:		url添加字符串
	// author:	jin
	// param:	{string} str 待添加字符串
	// 			{string} [url] 待处理url；默认使用当前url
	// return:	{string} 结果url字符串
	// remark:	请注意使用该函数时url中的锚点将会被免费清除
	addQueryString:function(str,url){
		var strurl=url || jin.nowUrl;
		strurl=strurl.replace(/#.*/gi,"");
		if(strurl.indexOf("?")<0){
			return strurl+"?"+str;
		}else{
			var laststr=strurl.slice(-1);
			if(laststr=="&"){
				return strurl+str;
			}else{
				return strurl+"&"+str;
			}
		}
	},
	
	// fn:		url参数设置
	// author:	jin
	// param:	{string} key 键名
	// 			{string} val 键值，不会被编码
	// 			{string} [url] 待处理url；默认使用当前url
	// return:	{string} 结果url字符串
	setQueryValue:function(key,val,url){
		var strurl=url || jin.nowUrl;
		//url清理
		strurl=strurl.replace(new RegExp("([\&|\?])"+key+"=[^&]*(&{0,1})","ig"),"$1");
		if(val==null){
			return strurl;
		}else{
			//添加
			return jin.addQueryValue(key,encodeURIComponent(val),strurl);
		}
	},
	
	// fn:		url参数获取
	// author:	jin
	// param:	{string} key 键名
	// 			{string} [url] 待处理url；默认使用当前url
	// return:	{string} 结果url字符串，值不会被解码
	getQueryValue:function(key,url){
		var strurl=url || jin.nowUrl;
		var vals=new RegExp("[\&|\?]"+key+"=([^&]*)&{0,1}","ig").exec(strurl);
		return vals?(vals[1].replace(/#.*/gi,"")):"";
	},
	
	// fn:		将json对象解析成query字符串
	// author:	from:tangram-1.5.2.source.js;mModify buy:jin
	// param:	{Object} json 需要解析的json对象
	// 			{Function=} replacer_opt 对值进行特殊处理的函数，function (value, key)，函数必须返回处理完成的value
	// return:	{string} - 解析结果字符串，其中值将被URI编码，{a:'&1 '} ==> "a=%261%20"。
	jsonToQuery:function (json, replacer_opt) {
		var result = [], 
			itemLen,
			replacer = replacer_opt || function (value) {
			  return encodeURIComponent(value);
			};
			
		jin.each(json, function(item, key){
			// 这里只考虑item为数组、字符串、数字类型，不考虑嵌套的object
			if (jin.type(item)==="Array") {
				itemLen = item.length;
				while (itemLen--) {
					result.push(key + '=' + replacer(item[itemLen], key));
				}
			} else {
				result.push(key + '=' + replacer(item, key));
			}
		});
		
		return result.join('&');
	},
	
	// fn:		解析目标URL中的参数成json对象
	// author:	from:tangram-1.5.2.source.js;mModify buy:jin
	// param:	{string} url 目标URL
	// return:	{Object} - 解析为结果对象，其中URI编码后的字符不会被解码，'a=%20' ==> {a:'%20'}。
	queryToJson:function (url) {
		var query   = url.substr(url.lastIndexOf('?') + 1),
			params  = query.split('&'),
			len     = params.length,
			result  = {},
			i       = 0,
			key, value, item, param;
		
		for (; i < len; i++) {
			if(!params[i]){
				continue;
			}
			param   = params[i].split('=');
			key     = param[0];
			value   = param[1];
			
			item = result[key];
			if ('undefined' == typeof item) {
				result[key] = value;
			} else if (jin.type(item)==="Array") {
				item.push(value);
			} else { // 这里只可能是string了
				result[key] = [item, value];
			}
		}
		
		return result;
	},
	
	// fn:		动态加载css文件
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} path css文件路径
	loadCssFile:function(path){
		var element = document.createElement("link");
		
		element.setAttribute("rel", "stylesheet");
		element.setAttribute("type", "text/css");
		element.setAttribute("href", path);
	
		document.getElementsByTagName("head")[0].appendChild(element);       
	},
	
	// fn:		动态加载js
	// author:	jin
	// param:	{string} url 地址
	// 			{function} [cb] js加载完毕回调
	srcScript:function(url,cb){
		if(url){
			//setTimeout(function(){
				var head=document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
					script=document.createElement("script");
				script.type="text\/javascript";
				//script.async="async";
				//script.charset="utf-8";
				url=jin.setQueryValue("t",jin.numState,url);
				script.src=url;
				script.onload=script.onreadystatechange=function(){
					if(!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
						cb && cb();
						//Handle memory leak in IE
						//setTimeout(function(){
							script.onload=script.onreadystatechange=null;
							if(head && script.parentNode){
								head.removeChild(script);
							}
							//script=null;
							script=undefined;
						//},3000);
					}
				};
				//Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				//This arises when a base node is used (#2709 and #4378).
				head.insertBefore(script,head.firstChild);
				//We handle everything using the script element injection
			//},0);
		}
	},
	
	// fn:		动态加载jsonp加载
	// author:	jin
	// param:	无顺序参数加载
	// 			{JSON} [_data] 参数数据
	// 			{string} _url 请求url
	// 			{function} [_cb] callback回调 function(data){
	// 				{JSON} data 返回ajax数据
	// 			}
	// remark:	"test.php?jsoncallback=jsonp20110225&jsonpcallback={?}"
	// 			jsoncallback为自动参数
	// 			jsonpcallback为手工参数，{?}将被自动替换为随机名
	jsonp:function(_data,_url,_cb){
		var data={},url="",cb=function(){};
		for(var i=0,len=arguments.length;i<len;i++){
			switch(jin.type(arguments[i])){
				case "String":
					url=arguments[i];
					break;
				case "Object":
					data=arguments[i];
					break;
				case "Function":
					cb=arguments[i];
					break;
			}
		}
		if(url){
			var jsonpstr=jin.getRandom();
			window[jsonpstr]=function(d){
				cb(d);
				setTimeout(function(){
					window[jsonpstr]=null;
				},3000);
			};
			//setTimeout(function(){
				var head=document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
					script=document.createElement("script");
				script.type="text\/javascript";
				//script.async="async";
				//script.charset="utf-8";
				if(url.indexOf("{?}")>-1){
					url=url.replace("{?}",jsonpstr);
				}else{
					url=jin.setQueryValue("jsoncallback",jsonpstr,url);
				}
				if(data){
					url=jin.addQueryString(jin.jsonToQuery(data),url);
				}
				script.src=url;
				script.onload=script.onreadystatechange=function(){
					if(!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
						//Handle memory leak in IE
						//setTimeout(function(){
							script.onload=script.onreadystatechange=null;
							if(head && script.parentNode){
								head.removeChild(script);
							}
							//script=null;
							script=undefined;
						//},3000);
					}
				};
				//Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				//This arises when a base node is used (#2709 and #4378).
				head.insertBefore(script,head.firstChild);
				//We handle everything using the script element injection
			//},0);
		}
	},
	
	// fn:				执行javascript
	// author:			jin
	// param:			{string} scriptText 执行script文本
	evalScript:function(scriptText){
//		//第一版功能暂时保留，现根据jquery1.7.2做了相应修改
//		var head=document.getElementsByTagName("head")[0] || document.documentElement,
//			script=document.createElement("script");
//		script.type="text\/javascript";
//		//script.charset="utf-8";
//		// 检查浏览器是否支持document.createTextNode运行javascript
//		var supportScriptEval=function(){
//			if(!jin.scriptEval){
//				var root=document.documentElement,
//					script=document.createElement("script");
//				try{
//					script.appendChild(document.createTextNode("jin.scriptEval=true;"));
//				}catch(e){}
//				root.insertBefore(script,root.firstChild);
//				root.removeChild(script);
//				script=null;
//			}
//			return jin.scriptEval;
//		};
//		if(supportScriptEval()){
//			script.appendChild(document.createTextNode(scriptText));
//		}else{
//			script.text=scriptText;
//		}
//		//Use insertBefore instead of appendChild to circumvent an IE6 bug.
//		//This arises when a base node is used (#2709).
//		head.insertBefore(script,head.firstChild);
//		head.removeChild(script);
//		script=null;

		//第二版改进，jquery1.7.2更新内容
		// We use execScript on Internet Explorer
		// We use an anonymous function so that context is window
		// rather than jQuery in Firefox
		( window.execScript || function( scriptText ) {
			window[ "eval" ].call( window, scriptText );
		} )( scriptText );
	},
	
	// fn:				获取XMLHttpRequest对象
	// author:			jin
	// return:			{XMLHttpRequest} XMLHttpRequest对象
	getXHRObj:function(){
		var methods=[
			function(){return new XMLHttpRequest();},
			function(){return new ActiveXObject('Xml2.XMLHTTP');},
			function(){return new ActiveXObject('Microsoft.XMLHTTP');}
		];
		for(var i=0,len=methods.length;i<len;i++){
			try{
				methods[i]();
				//arguments.callee
				jin.getXHRObj=methods[i];
				break;
			}catch(e){}
		}
		return jin.getXHRObj();
	},
	
	// fn:		动态加载js
	// author:	jin
	// param:	
	// 		{object} opt {
	// 			{json} [opt.data]
	// 				发送到服务器的数据。
	// 				将自动转换为请求字符串格式。
	// 				GET 请求中将附加在 URL 后。
	// 				必须为 Key/Value 格式。
	// 				如果为数组，程序将自动为不同值对应同一个名称。
	// 				如 {foo:["bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'。
	// 			{string} opt.url 
	// 				发送请求的地址。
	// 			{string} opt.type 
	// 				(默认: "GET") 请求方式 ("POST" 或 "GET")， 默认为 "GET"。
	// 			{function} opt.success  function(responseText){//this==opt;} 
	// 				请求成功后的回调函数。参数：由服务器返回，并根据dataType参数进行处理后的数据；描述状态的字符串。
	// 			{string} opt.dataType  "text"或"json"，目前只支持这两种
	// 		}
	ajax:function(opt){
		var data=opt.data,
			url=opt.url || jin.nowUrl,
			success=opt.success,
			type=opt.type || "GET",
			dataType=opt.dataType || "text",
			send=null;
		if(url){
			var xhrObj=jin.getXHRObj();
			xhrObj.onreadystatechange=function(){
				//xhr正确请求时
				if(xhrObj.readyState==4){
					if(success){
						if(dataType=="text"){
							success.call(opt,xhrObj.responseText);
						}else if(dataType=="json"){
							success.call(opt,JSON.parse(xhrObj.responseText));
						}else{
							alert("不支持此类型dataType配置");
						}
					}
					//window.setTimeout(function(){
						//避免内存泄露
						xhrObj.onreadystatechange=function(){};
						xhrObj=null;
					//},0);
				}
			};
			url=jin.setQueryValue("t",jin.numState,url);
			if(data && type.toUpperCase()=="GET"){
				url=jin.addQueryString(jin.jsonToQuery(data),url);
			}else if(type.toUpperCase()=="POST"){
				send=jin.jsonToQuery(data);
			}
			xhrObj.open(type.toUpperCase(),url,true);
			//xhrObj.setRequestHeader("cache-control","no-cache");
			xhrObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhrObj.send(send);
		}
	},
	
	// fn:		js队列式加载，src模式
	// author:	jin
	// param:	{string} listName 队列名
	// 			{array} urls 地址队列
	// 			{function} [cb] callback回调
	srcList:function(listName,urls,cb){
		if(jin.type(urls)=="String"){
			urls=[urls];
		}
		if(urls.length>0){
			var len=urls.length;
			var t=jin.getRandom();
			jin[t]=new Array(len);
			var check=function(){
				var flag=true;
				for(var i=0;i<len;i++){
					if(!jin[t][i]){
						flag=false;
						break;
					}
				}
				return flag;
			};
			var srcScript=function(i){
				jin.srcScript(urls[i],function(){
					jin[t][i]=true;
					if(check()){
						listName && (jin[listName]=true);
						cb && cb();
						setTimeout(function(){jin[t]=null;},3000);//清除检测标识
					}
				});
			};
			for(var i=0;i<len;i++){
				srcScript(i);
			}
		}
	},
	
	// fn:		js队列式加载，xhr模式
	// author:	jin
	// param:	{string} listName 队列名
	// 			{array} urls 地址队列
	// 			{function} [cb] callback回调
	xhrList:function(listName,urls,cb){
		if(jin.type(urls)=="String"){
			urls=[urls];
		}
		if(urls.length>0){
			var len=urls.length;
			var t=jin.getRandom();
			jin[t]=new Array(len);
			var check=function(){
				var flag=true;
				for(var i=0;i<len;i++){
					if(!jin[t][i]){
						flag=false;
						break;
					}
				}
				return flag;
			};
			var srcScript=function(i){
				jin.ajax({url:urls[i],i:i,success:function(txt){
					var self=this;
					jin[t][self.i]=txt;
					if(check()){
						listName && (jin[listName]=true);
						for(var i=0;i<len;i++){
							jin.evalScript(jin[t][i]);
						}
						cb && cb();
						setTimeout(function(){jin[t]=null;},3000);//清除检测标识
					}
				}});
			};
			for(var i=0;i<len;i++){
				srcScript(i);
			}
		}
	},
	
	// fn:		js队列式加载
	// author:	jin
	// param:	无顺序参数加载
	// 			{string} [_listName] 队列名（队列名请不要带有"./?"三种字符）
	// 			{array(string)} _urls 地址
	// 			{bollean} [_domain] 是否跨域调用（默认true）；
	// 			{function} [_cb] 回调
	scriptList:function(_listName,_urls,_domain,_cb){
		var listName=false,urls="",domain=true,data={},cb=function(){};
		for(var i=0,len=arguments.length;i<len;i++){
			switch(jin.type(arguments[i])){
				case "String":
					if((arguments[i].indexOf(".")>-1 || arguments[i].indexOf("/")>-1 || arguments[i].indexOf("?")>-1)){
						urls=new Array(arguments[i]);
					}else{
						listName=arguments[i];
					}
					break;
				case "Array":
					urls=arguments[i];
					break;
				case "Function":
					cb=arguments[i];
					break;
				case "Boolean":
					domain=arguments[i];
					break;
			}
		}
		if(domain){
			jin.srcList(listName,urls,cb);
		}else{
			jin.xhrList(listName,urls,cb);
		}
	},
	
	// fn:		对象定时检测
	// author:	jin
	// param:	{bool/function} cbFactor 触发cb的条件因子
	// 			{function} cb 回调函数
	// 			{number} [tOut] 检测总时长，默认1分钟
	// 			{number} [tSplit] 检测步长，默认500毫秒
	gapCheck:function(cbFactor,cb,tOut,tSplit){
		if(cbFactor && cb){
			//time out
			tOut=tOut || 60000;
			//split
			tSplit=tSplit || 500;
			//goto time
			var tGoto=0;
			//factor
			function factor(){
				if(jin.type(cbFactor)=="Boolean"){return cbFactor;}
				else if(jin.type(cbFactor)=="Function"){return cbFactor();}
				//else{console.log("cbFactor.constructor err!");return false;}
			}
			//recursion checkq
			function check(){
				tGoto+=tSplit;
				if(factor()){
					cb();
				}else if(tGoto<tOut){
					setTimeout(check,tSplit);
				}
			}
			if(factor()){cb()}else{setTimeout(check,tSplit);}
		}
	},
	
	// fn:		对象检测
	// author:	jin
	// param:	{array(string)/string} bols 对象属性检测条件队列，以本对象为宿主
	// 			{function} fn 回调函数
	scriptReady:function(_bols,_fn){
		var bols=false,fn=function(){};
		for(var i=0,len=arguments.length;i<len;i++){
			switch(jin.type(arguments[i])){
				case "String":
					bols=arguments[i];
					break;
				case "Array":
					bols=arguments[i];
					break;
				case "Function":
					fn=arguments[i];
					break;
			}
		}
		if(jin.type(bols)=="String"){
			jin.gapCheck(function(){//factor
					//console.log(jin[bols]+" | "+bols);
					return jin[bols];
				},function(){//cb
					//console.log(fn);
					fn();
					return;
				});
		}else if(jin.type(bols)=="Array"){
			var len=bols.length,flag=true;
			jin.gapCheck(function(){//factor
					flag=true;
					for(var i=0;i<len;i++){
						//console.log(jin[bols[i]]+" | "+bols[i]);
						if(!jin[bols[i]]){
							flag=false;
							break;
						}
					}
					return flag;
				},function(){//cb
					//console.log(fn);
					fn();
					return;
				});
		}
	},
	
	// fn:		对象检查
	// author:	jin
	// param:	{object} o 待检查对象，多个对象逗号分开
	// return:	{boolean} 对象是否存在
	// example:	jin.objCheck("o.result.list");
	// 			jin.objCheck("o.result,o.result.list");
	// remark:	只能检测全局对象，对于私有对象检查请使用objAttrCheck对象属性检查
	objCheck:function(o){
		var flag=false;
		var os=o.split(",");
		var i=0,len=os.length;
		for(;i<len;i++){
			try{
				var temp=eval(os[i]);
				if(typeof temp=="undefined"){
					flag=false;
					break;
				}else{
					flag=true;
				}
			}
			catch(e){
				flag=false;
				break;
			}
		}
		return flag;
	},
	// fn:		对象属性检查
	// author:	jin
	// param:	{object} o 待检查根对象
	// 			{string} [attr] 待检查属性，多属性使用逗号隔开
	// return:	{boolean} 对象是否存在
	// example:	jin.objAttrCheck(o,"result.list");  //o.result.list
	// 			jin.objAttrCheck(o,"result,result.list");  //o.result、o.result.list
	// remark:	此设计可检测所有形式对象，全局对象和局部对象，如果仅仅需要检测全局对象可以使用objCheck更加简洁
	objAttrCheck:function(o,attr){
		if(!o){
			return false;
		}else if(attr){
			var flag=false;
			var attrs=attr.split(",");
			var i=0,len=attrs.length;
			for(;i<len;i++){
				try{
					var temp=eval("o."+attrs[i]);
					if(typeof temp=="undefined"){
						flag=false;
						break;
					}else{
						flag=true;
					}
				}
				catch(e){
					flag=false;
					break;
				}
			}
			return flag;
		}
		return true;
	},
	
	// fn:		生成随机整数，范围是[min, max]
	// author:	from:tangram-1.5.2.source.js
	// param:	{number} min 	随机整数的最小值
	//			{number} max 	随机整数的最大值
	// return:	{number} 生成的随机整数
	randomInt:function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	
	// fn:		转换unicode编码；ASCII -> Unicode转换
	// author:	jin
	// param:	{string} str 待转换字符串
	// return:	{string} 返回转换后字符串
	A2U:function(str){
		var a=[],
		i=0;
		for (;i<str.length;){
			a[i]=("00"+str.charCodeAt(i++).toString(16)).slice(-4);
		}
		return "\\u"+a.join("\\u");
	},
	
	// fn:				转换unicode反编码；Unicode -> ASCII转换
	// author:			jin
	// param:			{string} str 待转换字符串
	// return:			{string} 返回转换后字符串
	U2A:function(str){
		return unescape(str.replace(/\\/g, "%"))
	},	
	
	// fn:		数组暴虐查找
	// author:	jin
	// param:	{array} arrData 参数说明
	// 			{object} oKey 参数说明
	// return:	{number} 返回对象说明
	// remark:	‖:分割符
	//			■：首次关键字匹配
	//			●：最终关键字匹配
	searchArray : function(arrData, oKey){
		var str = arrData.join('‖'),reg = new RegExp(oKey,"gim");
		return str.replace(reg,"■").replace(/[^‖■]/g,"").indexOf("■");
	},
	
	// fn:		数组暴虐查找
	// author:	jin
	// param:	{array} arrData 参数说明
	// 			{object} oKey 参数说明
	// return:	{number} 返回对象说明
	// remark:	‖:分割符
	//			■：首次关键字匹配
	//			●：最终关键字匹配
	searchArrays : function(arrData, oKey){
		var str = arrData.join('‖'),reg = new RegExp(oKey,"gim");
		str=str.replace(reg,"■").replace(/[^‖■]/g,"").replace(/■‖/g,"●").replace(/■/g,"●");
		var results=[];
		for(var i=str.length-1;i>-1;i--){
			if(str.charCodeAt(i)=="9679"){
				//results.unshift(i);
				results.push(i);
			}
		}
		return results.reverse();
	},
	
	// fn:		为目标数字添加逗号分隔
	// author:	from:tangram-1.5.2.source.js
	// param:	{number} source 需要处理的数字
	// 			{number} [length] 两次逗号之间的数字位数，默认为3位
	// return:	{string} 添加逗号分隔后的字符串
	numberComma:function(source,length){
		if(!length || length<1){
			length=3;
		}
	
		source=String(source).split(".");
		source[0]=source[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
		return source.join(".");
	},
	
//	// fn:		支持单字节和双字节判断的字符串截取
//	// author:	jin
//	// param:	{string} str 待截取字符串
//	// 			{number} len 截取长度（一个字节为一个长度单位）
//	//			{string} [suffix] 后缀，字符发生截断处理后将自动加上此后缀，字符未发生截断则无。
//	// return:	{string} 截取后字符串
//	subByte:function(str,len,suffix){
//		if(!str || !len){return'';}
//		//预期计数：中文2字节，英文1字节
//		var a=0;
//		//循环计数
//		var i=0;
//		//临时字串
//		var temp='';
//		for(i=0;i<str.length;i++){
//			if(str.charCodeAt(i)>255){
//				//按照预期计数增加2
//				a+=2;
//			}else{
//				a++;
//			}
//			//如果增加计数后长度大于限定长度，就直接返回临时字符串
//			if(a>len){return temp+suffix || "";}
//			//将当前内容加到临时字符串
//			temp+=str.charAt(i);
//		}
//		//如果全部是单字节字符，就直接返回源字符串
//		return str;
//	},
	
	// fn:		获取目标字符串在gbk编码下的字节长度
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} source 目标字符串
	// remark:	获取字符在gbk编码下的字节长度, 实现原理是认为大于127的就一定是双字节。如果字符超出gbk编码范围, 则这个计算不准确
	// return:	{number} 字节长度
	getByteLength:function (source) {
		return String(source).replace(/[^\x00-\xff]/g, "ci").length;
	},
	// fn:		对目标字符串按gbk编码截取字节长度
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} source 目标字符串
	// 			{number} length 需要截取的字节长度
	//			{string} [tail] 追加字符串,可选.
	// return:	{string} 字符串截取结果
	// remark:	截取过程中，遇到半个汉字时，向下取整。
	subByte:function (source, length, tail) {
		source = String(source);
		tail = tail || '';
		if (length < 0 || jin.getByteLength(source) <= length) {
			return source;
		}
		
		//thanks 加宽提供优化方法
		source = source.substr(0,length).replace(/([^\x00-\xff])/g,"\x241 ")//双字节字符替换成两个
			.substr(0,length)//截取长度
			.replace(/[^\x00-\xff]$/,"")//去掉临界双字节字符
			.replace(/([^\x00-\xff]) /g,"\x241");//还原
		return source + tail;
	
	},
	
	// fn:		对目标数字进行0补齐处理
	// author:	from:tangram-1.5.2.source.js
	// param:	{number} source 需要处理的数字
	// 			{number} length 需要输出的长度
	// return:	{string} 对目标数字进行0补齐处理后的结果
	numberPad : function (source, length) {
		var pre = "",
			negative = (source < 0),
			string = String(Math.abs(source));
	
		if (string.length < length) {
			pre = (new Array(length - string.length + 1)).join('0');
		}
	
		return (negative ?  "-" : "") + pre + string;
	},
	
	// fn:		对目标日期对象进行格式化
	// author:	from:tangram-1.5.2.source.js
	// param:	{Date} source 目标日期对象
	// 			{string} pattern 日期格式化规则
	// return:	{string} 格式化后的字符串
	// remark:	
				//<b>格式表达式，变量含义：</b><br><br>
				//hh: 带 0 补齐的两位 12 进制时表示<br>
				//h: 不带 0 补齐的 12 进制时表示<br>
				//HH: 带 0 补齐的两位 24 进制时表示<br>
				//H: 不带 0 补齐的 24 进制时表示<br>
				//mm: 带 0 补齐两位分表示<br>
				//m: 不带 0 补齐分表示<br>
				//ss: 带 0 补齐两位秒表示<br>
				//s: 不带 0 补齐秒表示<br>
				//yyyy: 带 0 补齐的四位年表示<br>
				//yy: 带 0 补齐的两位年表示<br>
				//MM: 带 0 补齐的两位月表示<br>
				//M: 不带 0 补齐的月表示<br>
				//dd: 带 0 补齐的两位日表示<br>
				//d: 不带 0 补齐的日表示
	dateFormat : function (source, pattern) {
		if ('string' != typeof pattern) {
			return source.toString();
		}
	
		function replacer(patternPart, result) {
			pattern = pattern.replace(patternPart, result);
		}
		
		var pad     = jin.numberPad,
			year    = source.getFullYear(),
			month   = source.getMonth() + 1,
			date2   = source.getDate(),
			hours   = source.getHours(),
			minutes = source.getMinutes(),
			seconds = source.getSeconds();
	
		replacer(/yyyy/g, pad(year, 4));
		replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
		replacer(/MM/g, pad(month, 2));
		replacer(/M/g, month);
		replacer(/dd/g, pad(date2, 2));
		replacer(/d/g, date2);
	
		replacer(/HH/g, pad(hours, 2));
		replacer(/H/g, hours);
		replacer(/hh/g, pad(hours % 12, 2));
		replacer(/h/g, hours % 12);
		replacer(/mm/g, pad(minutes, 2));
		replacer(/m/g, minutes);
		replacer(/ss/g, pad(seconds, 2));
		replacer(/s/g, seconds);
	
		return pattern;
	},
	
	// fn:		将目标字符串转换成日期对象
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} source 目标字符串
	// return:	{Date} 转换后的日期对象
	// remark:	
				//对于目标字符串，下面这些规则决定了 parse 方法能够成功地解析： <br>
				//<ol>
				//<li>短日期可以使用“/”或“-”作为日期分隔符，但是必须用月/日/年的格式来表示，例如"7/20/96"。</li>
				//<li>以 "July 10 1995" 形式表示的长日期中的年、月、日可以按任何顺序排列，年份值可以用 2 位数字表示也可以用 4 位数字表示。如果使用 2 位数字来表示年份，那么该年份必须大于或等于 70。 </li>
				//<li>括号中的任何文本都被视为注释。这些括号可以嵌套使用。 </li>
				//<li>逗号和空格被视为分隔符。允许使用多个分隔符。 </li>
				//<li>月和日的名称必须具有两个或两个以上的字符。如果两个字符所组成的名称不是独一无二的，那么该名称就被解析成最后一个符合条件的月或日。例如，"Ju" 被解释为七月而不是六月。 </li>
				//<li>在所提供的日期中，如果所指定的星期几的值与按照该日期中剩余部分所确定的星期几的值不符合，那么该指定值就会被忽略。例如，尽管 1996 年 11 月 9 日实际上是星期五，"Tuesday November 9 1996" 也还是可以被接受并进行解析的。但是结果 date 对象中包含的是 "Friday November 9 1996"。 </li>
				//<li>JScript 处理所有的标准时区，以及全球标准时间 (UTC) 和格林威治标准时间 (GMT)。</li> 
				//<li>小时、分钟、和秒钟之间用冒号分隔，尽管不是这三项都需要指明。"10:"、"10:11"、和 "10:11:12" 都是有效的。 </li>
				//<li>如果使用 24 小时计时的时钟，那么为中午 12 点之后的时间指定 "PM" 是错误的。例如 "23:15 PM" 就是错误的。</li> 
				//<li>包含无效日期的字符串是错误的。例如，一个包含有两个年份或两个月份的字符串就是错误的。</li>
				//</ol>
	dateParse : function (source) {
		var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
		if ('string' == typeof source) {
			if (reg.test(source) || isNaN(Date.parse(source))) {
				var d = source.split(/ |T/),
					d1 = d.length > 1 
							? d[1].split(/[^\d]/) 
							: [0, 0, 0],
					d0 = d[0].split(/[^\d]/);
				return new Date(d0[0] - 0, 
								d0[1] - 1, 
								d0[2] - 0, 
								d1[0] - 0, 
								d1[1] - 0, 
								d1[2] - 0);
			} else {
				return new Date(source);
			}
		}
		
		return new Date();
	},
	// fn:		日期加
	// author:	jin
	// param:	{string} interval 增加的时间间隔类型
	//			{number} number 增加的时间间隔
	// 			{Date} date 要操作的时间
	// return:	{Date} 获得增值后的日期
	// example:	console.log(jin.dateAdd("d",3,new Date()));
	dateAdd:function(interval,number,date){  
		//確保為date類型:  
		date=jin.dateParse(date);  
		switch(interval.toLowerCase()){  
			case "y": return new Date(date.setFullYear(date.getFullYear()+number));  
			case "m": return new Date(date.setMonth(date.getMonth()+number));  
			case "d": return new Date(date.setDate(date.getDate()+number));  
			case "w": return new Date(date.setDate(date.getDate()+7*number));  
			case "h": return new Date(date.setHours(date.getHours()+number));  
			case "n": return new Date(date.setMinutes(date.getMinutes()+number));  
			case "s": return new Date(date.setSeconds(date.getSeconds()+number));  
			case "l": return new Date(date.setMilliseconds(date.getMilliseconds()+number));  
		}  
	},
	
	// fn:		日期差
	// author:	from:net word
	// param:	{Date} date1 日期1
	//			{Date} date2 日期2
	// return:	{number} 获得date1-date2的天数
	// example:	console.log(jin.daysElapsed(jin.dateParse("2012-04-04"),jin.dateParse("2012-04-01")));
	daysElapsed:function(date1,date2) {
		 var difference = Date.UTC(date1.getYear(),date1.getMonth(),date1.getDate(),0,0,0)
	
						- Date.UTC(date2.getYear(),date2.getMonth(),date2.getDate(),0,0,0);
		 return difference/1000/60/60/24;
	},
	
	// fn:		验证字符串是否合法的cookie键名
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} key 需要验证的键名
	// return:	{boolean} 是否合法的cookie键名
	_isValidKey : function (key) {
		// http://www.w3.org/Protocols/rfc2109/rfc2109
		// Syntax:  General
		// The two state management headers, Set-Cookie and Cookie, have common
		// syntactic properties involving attribute-value pairs.  The following
		// grammar uses the notation, and tokens DIGIT (decimal digits) and
		// token (informally, a sequence of non-special, non-white space
		// characters) from the HTTP/1.1 specification [RFC 2068] to describe
		// their syntax.
		// av-pairs   = av-pair *(";" av-pair)
		// av-pair    = attr ["=" value] ; optional value
		// attr       = token
		// value      = word
		// word       = token | quoted-string
		
		// http://www.ietf.org/rfc/rfc2068.txt
		// token      = 1*<any CHAR except CTLs or tspecials>
		// CHAR       = <any US-ASCII character (octets 0 - 127)>
		// CTL        = <any US-ASCII control character
		//              (octets 0 - 31) and DEL (127)>
		// tspecials  = "(" | ")" | "<" | ">" | "@"
		//              | "," | ";" | ":" | "\" | <">
		//              | "/" | "[" | "]" | "?" | "="
		//              | "{" | "}" | SP | HT
		// SP         = <US-ASCII SP, space (32)>
		// HT         = <US-ASCII HT, horizontal-tab (9)>
			
		return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
	},
	
	// fn:		获取cookie的值，不对值进行解码
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} key 需要获取Cookie的键名
	// return:	{string|null} 获取的Cookie值，获取不到时返回null
	cookieGetRaw : function (key) {
		if (jin._isValidKey(key)) {
			var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
				result = reg.exec(document.cookie);
				
			if (result) {
				return result[2] || null;
			}
		}
	
		return null;
	},
	
	// fn:		获取cookie的值，用decodeURIComponent进行解码
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} key 需要获取Cookie的键名
	// return:	{string|null} cookie的值，获取不到时返回null
	// remark:	该方法会对cookie值进行decodeURIComponent解码。如果想获得cookie源字符串，请使用getRaw方法。
	cookieGet : function (key) {
		var value = jin.cookieGetRaw(key);
		if ('string' == typeof value) {
			value = decodeURIComponent(value);
			return value;
		}
		return null;
	},
	
	// fn:		设置cookie的值，不对值进行编码
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} key 需要设置Cookie的键名
	//			{string} value 需要设置Cookie的值
	//			{Object} [options] 设置Cookie的其他可选参数
	//			{
	//				{string} [path] cookie路径
	//				{Date|number} [expires] cookie过期时间,如果类型是数字的话, 单位是毫秒
	//				{string} [domain] cookie域名
	//				{string} [secure] cookie是否安全传输
	//			}
	cookieSetRaw : function (key, value, options) {
		if (!jin._isValidKey(key)) {
			return;
		}
		
		options = options || {};
		//options.path = options.path || "/"; // meizz 20100402 设定一个初始值，方便后续的操作
		//berg 20100409 去掉，因为用户希望默认的path是当前路径，这样和浏览器对cookie的定义也是一致的
		
		// 计算cookie过期时间
		var expires = options.expires;
		if ('number' == typeof options.expires) {
			expires = new Date();
			expires.setTime(expires.getTime() + options.expires);
		}
		
		document.cookie =
			key + "=" + value
			+ (options.path ? "; path=" + options.path : "")
			+ (expires ? "; expires=" + expires.toGMTString() : "")
			+ (options.domain ? "; domain=" + options.domain : "")
			+ (options.secure ? "; secure" : ''); 
	},
	
	// fn:		删除cookie的值
	// author:	from:tangram-1.5.2.source.js
	// param:	{string} key 需要删除Cookie的键名
	//			{Object} options 需要删除的cookie对应的 path domain 等值
	cookieRemove : function (key, options) {
		options = options || {};
		options.expires = new Date(0);
		jin.cookieSetRaw(key, '', options);
	},
	
	//Create a cookie with the given name and value and other optional parameters.
	//
	//@example jin.cookie('the_cookie', 'the_value');
	//@desc Set the value of a cookie.
	//@example jin.cookie('the_cookie', 'the_value', {expires: 7, path: '/', domain: 'jquery.com', secure: true});
	//@desc Create a cookie with all available options.
	//@example jin.cookie('the_cookie', 'the_value');
	//@desc Create a session cookie.
	//@example jin.cookie('the_cookie', null);
	//@desc Delete a cookie by passing null as value.
	//
	//@param String name The name of the cookie.
	//@param String value The value of the cookie.
	//@param Object options An object literal containing key/value pairs to provide optional cookie attributes.
	//@option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
	//                            If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
	//                            If set to null or omitted, the cookie will be a session cookie and will not be retained
	//                            when the the browser exits.
	//@option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
	//@option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
	//@option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
	//                       require a secure protocol (like HTTPS).
	cookie : function(name, value, options) {
		if (typeof value != 'undefined') { // name and value given, set cookie
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			var path = options.path ? '; path=' + options.path : '';
			var domain = options.domain ? '; domain=' + options.domain : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else { // only name given, get cookie
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jin.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	},
	//本地存储get
	getItem:function(key){
		if(localStorage){
			return localStorage.getItem(key)
		}else{
			return jin.cookie(key);
		}
	},
	//本地存储set
	setItem:function(key,val){
		if(localStorage){
			localStorage.setItem(key,val);
		}else{
			jin.cookie(key,val);
		}
	},
//	touchCoords:function(e){
//		if(e.changedTouches.length == 1) {
//			var touch = e.changedTouches[0];
//		}
//		return{x:touch.pageX,y:touch.pageY};
//	},
//	touchMoveDirection:function(left,right){
//		//初始坐标
//		var sx = 0;
//		var sy = 0;
//		//当前坐标
//		var cx = 0;
//		var cy = 0;
//		//定义有效区域标准
//		var flag = {};
//		flag.w = parseInt(screen.width / 3);
//		flag.h = parseInt(screen.height / 3);
//		document.body.addEventListener('touchstart', function(evt) {
//			//当前位于屏幕上的所有手指列表中的第一个的坐标
//			sx = evt.touches[0].screenX; 
//			sy = evt.touches[0].screenY;
//		}, false);
//		document.body.addEventListener('touchmove', function(evt) {
//			cx = evt.touches[0].screenX;
//			cy = evt.touches[0].screenY;
//		}, false);
//		document.body.addEventListener('touchend', function(evt) {
//			//手指滑动距离横向超过屏幕三分之一且纵向小于屏幕三分之一时才执行，防止误操作
//			if((cx < sx) && (sx - cx > flag.w) && (Math.abs(cy - sy) < flag.h)) {
//				goPage('right');
//			} else if((sx < cx) && (cx - sx > flag.w) && (Math.abs(cy - sy) < flag.h)) {
//				goPage('left');
//			}
//		}, false);
//		
//		
//		
//		
//		
//		
//		var oldX=0,oldY=0,newX=0,newY=0;
//		document.addEventListener('touchstart',function(e){
//			var touchPos = jin.touchCoords(e); 
//			oldX=touchPos.x;
//			oldY=touchPos.y;
//			//alert(oldX+":"+oldY);
//		},false);
//		document.addEventListener('touchend',function(e){
//			var touchPos = jin.touchCoords(e); 
//			newX=touchPos.x;
//			newY=touchPos.y;
//			alert(newY-oldY);
//			if(-30<(newY-oldY)<30){
//				if((newX-oldX)>0){
//					right && right();
//				}else if((newX-oldX)<0){
//					left && left();
//				}
//			}
//		},false);
//		
//	},
	// 缓动类
	// t: current time（当前时间）
	// b: beginning value（初始值）
	// c: change in value（变化量）
	// d: duration（持续时间）
	// example：
	//		var b=50,c=100,d=50,t=0;
	//		var run=function(){
	//			console.log("jin:"+Math.ceil(jin.Quad.easeOut(t,b,c,d)));
	//			if(t<d){t++;setTimeout(run,400);}
	//		};
	//		run();
	Linear:function(t,b,c,d){return c*t/d+b;},
	Quad:{
		easeIn:function(t,b,c,d){
			return c*(t/=d)*t+b;
		},
		easeOut:function(t,b,c,d){
			return -c*(t/=d)*(t-2)+b;
		},
		easeInOut:function(t,b,c,d){
			if((t/=d/2)<1)return c/2*t*t+b;
			return -c/2*((--t)*(t-2)-1)+b;
		}
	},
	Cubic:{
		easeIn:function(t,b,c,d){
			return c*(t/=d)*t*t+b;
		},
		easeOut:function(t,b,c,d){
			return c*((t=t/d-1)*t*t+1)+b;
		},
		easeInOut:function(t,b,c,d){
			if((t/=d/2)<1)return c/2*t*t*t+b;
			return c/2*((t-=2)*t*t+2)+b;
		}
	},
	Quart:{
		easeIn:function(t,b,c,d){
			return c*(t/=d)*t*t*t+b;
		},
		easeOut:function(t,b,c,d){
			return -c*((t=t/d-1)*t*t*t-1)+b;
		},
		easeInOut:function(t,b,c,d){
			if((t/=d/2)<1)return c/2*t*t*t*t+b;
			return -c/2*((t-=2)*t*t*t-2)+b;
		}
	},
	Quint:{
		easeIn:function(t,b,c,d){
			return c*(t/=d)*t*t*t*t+b;
		},
		easeOut:function(t,b,c,d){
			return c*((t=t/d-1)*t*t*t*t+1)+b;
		},
		easeInOut:function(t,b,c,d){
			if((t/=d/2)<1)return c/2*t*t*t*t*t+b;
			return c/2*((t-=2)*t*t*t*t+2)+b;
		}
	},
	Sine:{
		easeIn:function(t,b,c,d){
			return -c*Math.cos(t/d*(Math.PI/2))+c+b;
		},
		easeOut:function(t,b,c,d){
			return c*Math.sin(t/d*(Math.PI/2))+b;
		},
		easeInOut:function(t,b,c,d){
			return -c/2*(Math.cos(Math.PI*t/d)-1)+b;
		}
	},
	Expo:{
		easeIn:function(t,b,c,d){
			return (t==0)?b:c*Math.pow(2,10*(t/d-1))+b;
		},
		easeOut:function(t,b,c,d){
			return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;
		},
		easeInOut:function(t,b,c,d){
			if(t==0)return b;
			if(t==d)return b+c;
			if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;
			return c/2*(-Math.pow(2,-10*--t)+2)+b;
		}
	},
	Circ:{
		easeIn:function(t,b,c,d){
			return -c*(Math.sqrt(1-(t/=d)*t)-1)+b;
		},
		easeOut:function(t,b,c,d){
			return c*Math.sqrt(1-(t=t/d-1)*t)+b;
		},
		easeInOut:function(t,b,c,d){
			if((t/=d/2)<1)return -c/2*(Math.sqrt(1-t*t)-1)+b;
			return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;
		}
	},
	Elastic:{
		easeIn:function(t,b,c,d,a,p){
			if(t==0)return b;　if((t/=d)==1)return b+c;　if(!p)p=d*.3;
			if(!a||a<Math.abs(c)){a=c;var s=p/4;}
			else var s=p/(2*Math.PI)*Math.asin(c/a);
			return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
		},
		easeOut:function(t,b,c,d,a,p){
			if(t==0)return b;　if((t/=d)==1)return b+c;　if(!p)p=d*.3;
			if(!a||a<Math.abs(c)){a=c;var s=p/4;}
			else var s=p/(2*Math.PI)*Math.asin(c/a);
			return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b);
		},
		easeInOut:function(t,b,c,d,a,p){
			if(t==0)return b;　if((t/=d/2)==2)return b+c;　if(!p)p=d*(.3*1.5);
			if(!a||a<Math.abs(c)){a=c;var s=p/4;}
			else var s=p/(2*Math.PI)*Math.asin(c/a);
			if(t<1)return -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
			return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;
		}
	},
	Back:{
		easeIn:function(t,b,c,d,s){
			if(s==undefined)s=1.70158;
			return c*(t/=d)*t*((s+1)*t-s)+b;
		},
		easeOut:function(t,b,c,d,s){
			if(s==undefined)s=1.70158;
			return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
		},
		easeInOut:function(t,b,c,d,s){
			if(s==undefined)s=1.70158;
			if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;
		}
	},
	Bounce:{
		easeIn:function(t,b,c,d){
			return c-jin.Bounce.easeOut(d-t,0,c,d)+b;
		},
		easeOut:function(t,b,c,d){
			if((t/=d)<(1/2.75)){
				return c*(7.5625*t*t)+b;
			}else if(t<(2/2.75)){
				return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;
			}else if(t<(2.5/2.75)){
				return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;
			}else{
				return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;
			}
		},
		easeInOut:function(t,b,c,d){
			if(t<d/2)return jin.Bounce.easeIn(t*2,0,c,d)*.5+b;
			else return jin.Bounce.easeOut(t*2-d,0,c,d)*.5+c*.5+b;
		}
	},
	// scrolltop
	wScrollTop:function(v){
		var d = document;
		if(jin.type(v)!="undefined"){
			window.pageYOffset=d.documentElement.scrollTop=d.body.scrollTop=v;
			//window.scrollTo(v);//会导致上面一行失效，这行也不起作用
			return v;
		}
		return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
	},
	
	// scrollleft
	wScrollLeft:function(){
		var d = document;
		return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
	},
	
	// fn:		scrollWidth
	// author:	jin
	// param:	{boolean} r 是否刷新当前数据
	// return:	{number} scrollWidth
	wScrollWidth:function(r){
		var d = document;
		if(!this._scrollWidth || r){
			this._scrollWidth=d.documentElement.scrollWidth;
		}
		return this._scrollWidth;
	},
	// fn:		scrollHeight
	// author:	jin
	// param:	{boolean} r 是否刷新当前数据
	// return:	{number} scrollHeight
	wScrollHeight:function(r){
		var d = document;
		if(!this._scrollHeight || r){
			this._scrollHeight=d.documentElement.scrollHeight;
		}
		return this._scrollHeight;
	},
	
	// fn:		clientWidth
	// author:	jin
	// param:	{boolean} r 是否刷新当前数据
	// return:	{number} clientWidth
	wClientWidth:function(r){
		var d = document;
		if(!this._clientWidth || r){
			this._clientWidth=d.documentElement.clientWidth;
		}
		return this._clientWidth;
	},
	
	// fn:		clientHeight
	// author:	jin
	// param:	{boolean} r 是否刷新当前数据
	// return:	{number} clientHeight
	wClientHeight:function(r){
		var d = document;
		if(!jin._clientHeight || r){
			jin._clientHeight=window.innerHeight || d.documentElement.clientHeight;
		}
		return jin._clientHeight;
	},
	anScroll:function(r,fnBefore,fnAfter){
		fnBefore && fnBefore();
		var b=jin.wScrollTop(),c=r-jin.wScrollTop(),d=40,t=0;
		var run=function(){
			//console.log("jin:"+Math.ceil(jin.Quad.easeOut(t,b,c,d)));
			jin.wScrollTop(Math.ceil(jin.Quad.easeOut(t,b,c,d)));
			if(t<d){t++;setTimeout(run,10);}
		};
		run();
	}
};

/*
fn:         使函数在页面dom节点加载完毕时调用
author:     from:tangram-1.5.2.source.js;mModify buy:jin
param:      {Function} callback
remark:		如果有条件将js放在页面最底部, 也能达到同样效果，尽量不使用该方法。
*/
jin.ready = function() {
	var readyBound = false,
		readyList = [],
		DOMContentLoaded;

	if (document.addEventListener) {
		DOMContentLoaded = function() {
			document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
			ready();
		};

	} else if (document.attachEvent) {
		DOMContentLoaded = function() {
			if (document.readyState === 'complete') {
				document.detachEvent('onreadystatechange', DOMContentLoaded);
				ready();
			}
		};
	}
	
	function ready() {
		if (!jin.isReady) {
			jin.isReady = true;
			for (var i = 0, j = readyList.length; i < j; i++) {
				readyList[i]();
			}
		}
	}
	
	function doScrollCheck(){
		try {
			document.documentElement.doScroll("left");
		} catch(e) {
			setTimeout( doScrollCheck, 1 );
			return;
		}   
		ready();
	}

	function bindReady() {
		if (readyBound) {
			return;
		}
		readyBound = true;

		if (document.readyState === 'complete') {
			jin.isReady = true;
		} else {
			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
				window.addEventListener('load', ready, false);
			} else if (document.attachEvent) {
				document.attachEvent('onreadystatechange', DOMContentLoaded);
				window.attachEvent('onload', ready);

				var toplevel = false;

				try {
					toplevel = window.frameElement == null;
				} catch (e) {}

				if (document.documentElement.doScroll && toplevel) {
					doScrollCheck();
				}
			}
		}
	}
	bindReady();

	return function(callback) {
		jin.isReady ? callback() : readyList.push(callback);
	};
}();
jin.isReady=false;

// fn:		判断是否为chrome浏览器
// author:	from:tangram-1.5.2.source.js
// return:	{Number} chrome版本号
jin.broChrome=/chrome\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;

// fn:		判断是否为firefox浏览器
// author:	from:tangram-1.5.2.source.js
// return:	{Number} firefox版本号
jin.broFirefox=/firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;

// fn:		判断是否为ie浏览器
// author:	from:tangram-1.5.2.source.js
// return:	{Number} IE版本号
jin.broIe=/msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;

// fn:		判断是否为gecko内核
// author:	from:tangram-1.5.2.source.js
// return:	{Boolean} 布尔值
jin.broIsGecko=/gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);

// fn:		判断是否严格标准的渲染模式
// author:	from:tangram-1.5.2.source.js
// return:	{Boolean} 布尔值
jin.broIsStrict=document.compatMode == "CSS1Compat";

// fn:		判断是否为webkit内核
// author:	from:tangram-1.5.2.source.js
// return:	{Boolean} 布尔值
jin.broIsWebkit=/webkit/i.test(navigator.userAgent);

// fn:		判断是否为maxthon浏览器
// author:	from:tangram-1.5.2.source.js
// return:	{Number} maxthon版本号
try {
    if (/(\d+\.\d+)/.test(external.max_version)) {
        jin.broMaxthon = + RegExp['\x241'];
    }
} catch (e) {}

// fn:		判断是否为opera浏览器
// author:	from:tangram-1.5.2.source.js
// return:	{Number} opera版本号
jin.broOpera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;

// fn:		判断是否为safari浏览器, 支持ipad
// author:	from:tangram-1.5.2.source.js
// return:	{Number} safari版本号
var ua = navigator.userAgent;
jin.broSafari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;

//将Slides暴露到全局
window.jin = window.feibo = jin;

})(window);

/*
    http://www.JSON.org/json2.js
    2009-06-29

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
eval(function(p,a,c,k,e,r){e=function(c){return(c<62?'':e(parseInt(c/62)))+((c=c%62)>35?String.fromCharCode(c+29):c.toString(36))};if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'([235-9ehlmo-qw-zA-EG-SU-Y]|1\\w)'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('q l=l||{};(5(){5 f(n){7 n<10?\'0\'+n:n}3(6 13.x.w!==\'5\'){13.x.w=5(h){7 14(m.15())?m.getUTCFullYear()+\'-\'+f(m.getUTCMonth()+1)+\'-\'+f(m.getUTCDate())+\'T\'+f(m.getUTCHours())+\':\'+f(m.getUTCMinutes())+\':\'+f(m.getUTCSeconds())+\'Z\':y};Q.x.w=Number.x.w=Boolean.x.w=5(h){7 m.15()}}q L=/[\\u0000\\17\\18-\\19\\1a\\1b\\1c\\1d-\\1e\\1f-\\1g\\1h-\\1i\\1j\\1k-\\1l]/g,M=/[\\\\\\"\\x00-\\x1f\\x7f-\\x9f\\17\\18-\\19\\1a\\1b\\1c\\1d-\\1e\\1f-\\1g\\1h-\\1i\\1j\\1k-\\1l]/g,8,D,1m={\'\\b\':\'\\\\b\',\'\\t\':\'\\\\t\',\'\\n\':\'\\\\n\',\'\\f\':\'\\\\f\',\'\\r\':\'\\\\r\',\'"\':\'\\\\"\',\'\\\\\':\'\\\\\\\\\'},o;5 N(p){M.1n=0;7 M.R(p)?\'"\'+p.E(M,5(a){q c=1m[a];7 6 c===\'p\'?c:\'\\\\u\'+(\'1o\'+a.1p(0).S(16)).1q(-4)})+\'"\':\'"\'+p+\'"\'}5 G(h,z){q i,k,v,e,H=8,9,2=z[h];3(2&&6 2===\'A\'&&6 2.w===\'5\'){2=2.w(h)}3(6 o===\'5\'){2=o.O(z,h,2)}switch(6 2){I\'p\':7 N(2);I\'U\':7 14(2)?Q(2):\'y\';I\'boolean\':I\'y\':7 Q(2);I\'A\':3(!2){7\'y\'}8+=D;9=[];3(V.x.S.apply(2)===\'[A Array]\'){e=2.e;J(i=0;i<e;i+=1){9[i]=G(i,2)||\'y\'}v=9.e===0?\'[]\':8?\'[\\n\'+8+9.P(\',\\n\'+8)+\'\\n\'+H+\']\':\'[\'+9.P(\',\')+\']\';8=H;7 v}3(o&&6 o===\'A\'){e=o.e;J(i=0;i<e;i+=1){k=o[i];3(6 k===\'p\'){v=G(k,2);3(v){9.1r(N(k)+(8?\': \':\':\')+v)}}}}W{J(k in 2){3(V.1t.O(2,k)){v=G(k,2);3(v){9.1r(N(k)+(8?\': \':\':\')+v)}}}}v=9.e===0?\'{}\':8?\'{\\n\'+8+9.P(\',\\n\'+8)+\'\\n\'+H+\'}\':\'{\'+9.P(\',\')+\'}\';8=H;7 v}}3(6 l.X!==\'5\'){l.X=5(2,B,K){q i;8=\'\';D=\'\';3(6 K===\'U\'){J(i=0;i<K;i+=1){D+=\' \'}}W 3(6 K===\'p\'){D=K}o=B;3(B&&6 B!==\'5\'&&(6 B!==\'A\'||6 B.e!==\'U\')){1u 1v Error(\'l.X\');}7 G(\'\',{\'\':2})}}3(6 l.Y!==\'5\'){l.Y=5(C,11){q j;5 12(z,h){q k,v,2=z[h];3(2&&6 2===\'A\'){J(k in 2){3(V.1t.O(2,k)){v=12(2,k);3(v!==undefined){2[k]=v}W{delete 2[k]}}}}7 11.O(z,h,2)}L.1n=0;3(L.R(C)){C=C.E(L,5(a){7\'\\\\u\'+(\'1o\'+a.1p(0).S(16)).1q(-4)})}3(/^[\\],:{}\\s]*$/.R(C.E(/\\\\(?:["\\\\\\/bfnrt]|u[0-9a-fA-F]{4})/g,\'@\').E(/"[^"\\\\\\n\\r]*"|true|false|y|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?/g,\']\').E(/(?:^|:|,)(?:\\s*\\[)+/g,\'\'))){j=eval(\'(\'+C+\')\');7 6 11===\'5\'?12({\'\':j},\'\'):j}1u 1v SyntaxError(\'l.Y\');}}}());',[],94,'||value|if||function|typeof|return|gap|partial|||||length|||key||||JSON|this||rep|string|var||||||toJSON|prototype|null|holder|object|replacer|text|indent|replace||str|mind|case|for|space|cx|escapable|quote|call|join|String|test|toString||number|Object|else|stringify|parse|||reviver|walk|Date|isFinite|valueOf||u00ad|u0600|u0604|u070f|u17b4|u17b5|u200c|u200f|u2028|u202f|u2060|u206f|ufeff|ufff0|uffff|meta|lastIndex|0000|charCodeAt|slice|push||hasOwnProperty|throw|new'.split('|'),0,{}))

//		jQuery缓动类备用
//		jQuery.extend(jQuery.easing,{
//			def:'easeOutQuad',
//			swing:function(x,t,b,c,d){
//				//alert(jQuery.easing.default);
//				return jQuery.easing[jQuery.easing.def](x,t,b,c,d);
//			},
//			easeInQuad:function(x,t,b,c,d){
//				return c*(t/=d)*t+b;
//			},
//			easeOutQuad:function(x,t,b,c,d){
//				return -c*(t/=d)*(t-2)+b;
//			},
//			easeInOutQuad:function(x,t,b,c,d){
//				if((t/=d/2)<1)return c/2*t*t+b;
//				return -c/2*((--t)*(t-2)-1)+b;
//			},
//			easeInCubic:function(x,t,b,c,d){
//				return c*(t/=d)*t*t+b;
//			},
//			easeOutCubic:function(x,t,b,c,d){
//				return c*((t=t/d-1)*t*t+1)+b;
//			},
//			easeInOutCubic:function(x,t,b,c,d){
//				if((t/=d/2)<1)return c/2*t*t*t+b;
//				return c/2*((t-=2)*t*t+2)+b;
//			},
//			easeInQuart:function(x,t,b,c,d){
//				return c*(t/=d)*t*t*t+b;
//			},
//			easeOutQuart:function(x,t,b,c,d){
//				return -c*((t=t/d-1)*t*t*t-1)+b;
//			},
//			easeInOutQuart:function(x,t,b,c,d){
//				if((t/=d/2)<1)return c/2*t*t*t*t+b;
//				return -c/2*((t-=2)*t*t*t-2)+b;
//			},
//			easeInQuint:function(x,t,b,c,d){
//				return c*(t/=d)*t*t*t*t+b;
//			},
//			easeOutQuint:function(x,t,b,c,d){
//				return c*((t=t/d-1)*t*t*t*t+1)+b;
//			},
//			easeInOutQuint:function(x,t,b,c,d){
//				if((t/=d/2)<1)return c/2*t*t*t*t*t+b;
//				return c/2*((t-=2)*t*t*t*t+2)+b;
//			},
//			easeInSine:function(x,t,b,c,d){
//				return -c*Math.cos(t/d*(Math.PI/2))+c+b;
//			},
//			easeOutSine:function(x,t,b,c,d){
//				return c*Math.sin(t/d*(Math.PI/2))+b;
//			},
//			easeInOutSine:function(x,t,b,c,d){
//				return -c/2*(Math.cos(Math.PI*t/d)-1)+b;
//			},
//			easeInExpo:function(x,t,b,c,d){
//				return (t==0)?b:c*Math.pow(2,10*(t/d-1))+b;
//			},
//			easeOutExpo:function(x,t,b,c,d){
//				return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;
//			},
//			easeInOutExpo:function(x,t,b,c,d){
//				if(t==0)return b;
//				if(t==d)return b+c;
//				if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;
//				return c/2*(-Math.pow(2,-10*--t)+2)+b;
//			},
//			easeInCirc:function(x,t,b,c,d){
//				return -c*(Math.sqrt(1-(t/=d)*t)-1)+b;
//			},
//			easeOutCirc:function(x,t,b,c,d){
//				return c*Math.sqrt(1-(t=t/d-1)*t)+b;
//			},
//			easeInOutCirc:function(x,t,b,c,d){
//				if((t/=d/2)<1)return -c/2*(Math.sqrt(1-t*t)-1)+b;
//				return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;
//			},
//			easeInElastic:function(x,t,b,c,d){
//				var s=1.70158;var p=0;var a=c;
//				if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;
//				if(a<Math.abs(c)){a=c;vars=p/4;}
//				else{var s=p/(2*Math.PI)*Math.asin(c/a);}
//				return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
//			},
//			easeOutElastic:function(x,t,b,c,d){
//				var s=1.70158;var p=0;var a=c;
//				if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;
//				if(a<Math.abs(c)){a=c;var s=p/4;}
//				else{var s=p/(2*Math.PI)*Math.asin(c/a);}
//				return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;
//			},
//			easeInOutElastic:function(x,t,b,c,d){
//				var s=1.70158;var p=0;var a=c;
//				if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);
//				if(a<Math.abs(c)){a=c;var s=p/4;}
//				else{var s=p/(2*Math.PI)*Math.asin(c/a);}
//				if(t<1)return -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
//				return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;
//			},
//			easeInBack:function(x,t,b,c,d,s){
//				if(s==undefined)s=1.70158;
//				return c*(t/=d)*t*((s+1)*t-s)+b;
//			},
//			easeOutBack:function(x,t,b,c,d,s){
//				if(s==undefined)s=1.70158;
//				return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
//			},
//			easeInOutBack:function(x,t,b,c,d,s){
//				if(s==undefined)s=1.70158;
//				if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
//				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;
//			},
//			easeInBounce:function(x,t,b,c,d){
//				return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b;
//			},
//			easeOutBounce:function(x,t,b,c,d){
//				if((t/=d)<(1/2.75)){
//					return c*(7.5625*t*t)+b;
//				}else if(t<(2/2.75)){
//					return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;
//				}else if(t<(2.5/2.75)){
//					return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;
//				}else{
//					return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;
//				}
//			},
//			easeInOutBounce:function(x,t,b,c,d){
//				if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;
//				return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b;
//			}
//		});


//e.preventDefault();
//e.stopPropagation();
//var et=null;try{et=$.event.fix(window.event || arguments.callee.caller.arguments[0]);}catch(e){}
//if(et)et.stopPropagation();