;var punycode=(function(root){var
freeDefine=typeof define=='function'&&typeof define.amd=='object'&&define.amd&&define,freeExports=typeof exports=='object'&&exports,freeModule=typeof module=='object'&&module,freeRequire=typeof require=='function'&&require,maxInt=2147483647,base=36,tMin=1,tMax=26,skew=38,damp=700,initialBias=72,initialN=128,delimiter='-',regexNonASCII=/[^ -~]/,regexPunycode=/^xn--/,errors={'overflow':'Overflow: input needs wider integers to process.','ucs2decode':'UCS-2(decode): illegal sequence','ucs2encode':'UCS-2(encode): illegal value','not-basic':'Illegal input >= 0x80 (not a basic code point)','invalid-input':'Invalid input'},baseMinusTMin=base-tMin,floor=Math.floor,stringFromCharCode=String.fromCharCode,key;function error(type){throw RangeError(errors[type]);}
function map(array,fn){var length=array.length;while(length--){array[length]=fn(array[length]);}
return array;}
function mapDomain(string,fn){var glue='.';return map(string.split(glue),fn).join(glue);}
function ucs2decode(string){var output=[],counter=0,length=string.length,value,extra;while(counter<length){value=string.charCodeAt(counter++);if((value&0xF800)==0xD800){extra=string.charCodeAt(counter++);if((value&0xFC00)!=0xD800||(extra&0xFC00)!=0xDC00){error('ucs2decode');}
value=((value&0x3FF)<<10)+(extra&0x3FF)+0x10000;}
output.push(value);}
return output;}
function ucs2encode(array){return map(array,function(value){var output='';if((value&0xF800)==0xD800){error('ucs2encode');}
if(value>0xFFFF){value-=0x10000;output+=stringFromCharCode(value>>>10&0x3FF|0xD800);value=0xDC00|value&0x3FF;}
output+=stringFromCharCode(value);return output;}).join('');}
function basicToDigit(codePoint){return codePoint-48<10?codePoint-22:codePoint-65<26?codePoint-65:codePoint-97<26?codePoint-97:base;}
function digitToBasic(digit,flag){return digit+22+75*(digit<26)-((flag!=0)<<5);}
function adapt(delta,numPoints,firstTime){var k=0;delta=firstTime?floor(delta/damp):delta>>1;delta+=floor(delta/numPoints);for(;delta>baseMinusTMin*tMax>>1;k+=base){delta=floor(delta/baseMinusTMin);}
return floor(k+(baseMinusTMin+1)*delta/(delta+skew));}
function encodeBasic(codePoint,flag){codePoint-=(codePoint-97<26)<<5;return codePoint+(!flag&&codePoint-65<26)<<5;}
function decode(input){var output=[],inputLength=input.length,out,i=0,n=initialN,bias=initialBias,basic,j,index,oldi,w,k,digit,t,length,baseMinusT;basic=input.lastIndexOf(delimiter);if(basic<0){basic=0;}
for(j=0;j<basic;++j){if(input.charCodeAt(j)>=0x80){error('not-basic');}
output.push(input.charCodeAt(j));}
for(index=basic>0?basic+1:0;index<inputLength;){for(oldi=i,w=1,k=base;;k+=base){if(index>=inputLength){error('invalid-input');}
digit=basicToDigit(input.charCodeAt(index++));if(digit>=base||digit>floor((maxInt-i)/w)){error('overflow');}
i+=digit*w;t=k<=bias?tMin:(k>=bias+tMax?tMax:k-bias);if(digit<t){break;}
baseMinusT=base-t;if(w>floor(maxInt/baseMinusT)){error('overflow');}
w*=baseMinusT;}
out=output.length+1;bias=adapt(i-oldi,out,oldi==0);if(floor(i/out)>maxInt-n){error('overflow');}
n+=floor(i/out);i%=out;output.splice(i++,0,n);}
return ucs2encode(output);}
function encode(input){var n,delta,handledCPCount,basicLength,bias,j,m,q,k,t,currentValue,output=[],inputLength,handledCPCountPlusOne,baseMinusT,qMinusT;input=ucs2decode(input);inputLength=input.length;n=initialN;delta=0;bias=initialBias;for(j=0;j<inputLength;++j){currentValue=input[j];if(currentValue<0x80){output.push(stringFromCharCode(currentValue));}}
handledCPCount=basicLength=output.length;if(basicLength){output.push(delimiter);}
while(handledCPCount<inputLength){for(m=maxInt,j=0;j<inputLength;++j){currentValue=input[j];if(currentValue>=n&&currentValue<m){m=currentValue;}}
handledCPCountPlusOne=handledCPCount+1;if(m-n>floor((maxInt-delta)/handledCPCountPlusOne)){error('overflow');}
delta+=(m-n)*handledCPCountPlusOne;n=m;for(j=0;j<inputLength;++j){currentValue=input[j];if(currentValue<n&&++delta>maxInt){error('overflow');}
if(currentValue==n){for(q=delta,k=base;;k+=base){t=k<=bias?tMin:(k>=bias+tMax?tMax:k-bias);if(q<t){break;}
qMinusT=q-t;baseMinusT=base-t;output.push(stringFromCharCode(digitToBasic(t+qMinusT%baseMinusT,0)));q=floor(qMinusT/baseMinusT);}
output.push(stringFromCharCode(digitToBasic(q,0)));bias=adapt(delta,handledCPCountPlusOne,handledCPCount==basicLength);delta=0;++handledCPCount;}}
++delta;++n;}
return output.join('');}
function toUnicode(domain){return mapDomain(domain,function(string){return regexPunycode.test(string)?decode(string.slice(4).toLowerCase()):string;});}
function toASCII(domain){return mapDomain(domain,function(string){return regexNonASCII.test(string)?'xn--'+encode(string):string;});}
return{'version':'1.0.0','ucs2':{'decode':ucs2decode,'encode':ucs2encode},'decode':decode,'encode':encode,'toASCII':toASCII,'toUnicode':toUnicode};}(this));var QueryString=(function(){var QueryString={};var urlDecode=decodeURI;function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop);}
function charCode(c){return c.charCodeAt(0);}
QueryString.unescapeBuffer=function(s,decodeSpaces){var out=new Buffer(s.length);var state='CHAR';var n,m,hexchar;for(var inIndex=0,outIndex=0;inIndex<=s.length;inIndex++){var c=s.charCodeAt(inIndex);switch(state){case'CHAR':switch(c){case charCode('%'):n=0;m=0;state='HEX0';break;case charCode('+'):if(decodeSpaces)c=charCode(' ');default:out[outIndex++]=c;break;}
break;case'HEX0':state='HEX1';hexchar=c;if(charCode('0')<=c&&c<=charCode('9')){n=c-charCode('0');}else if(charCode('a')<=c&&c<=charCode('f')){n=c-charCode('a')+10;}else if(charCode('A')<=c&&c<=charCode('F')){n=c-charCode('A')+10;}else{out[outIndex++]=charCode('%');out[outIndex++]=c;state='CHAR';break;}
break;case'HEX1':state='CHAR';if(charCode('0')<=c&&c<=charCode('9')){m=c-charCode('0');}else if(charCode('a')<=c&&c<=charCode('f')){m=c-charCode('a')+10;}else if(charCode('A')<=c&&c<=charCode('F')){m=c-charCode('A')+10;}else{out[outIndex++]=charCode('%');out[outIndex++]=hexchar;out[outIndex++]=c;break;}
out[outIndex++]=16*n+m;break;}}
return out.slice(0,outIndex-1);};QueryString.unescape=function(s,decodeSpaces){return QueryString.unescapeBuffer(s,decodeSpaces).toString();};QueryString.escape=function(str){return encodeURIComponent(str);};var stringifyPrimitive=function(v){switch(typeof v){case'string':return v;case'boolean':return v?'true':'false';case'number':return isFinite(v)?v:'';default:return'';}};QueryString.stringify=QueryString.encode=function(obj,sep,eq,name){sep=sep||'&';eq=eq||'=';obj=(obj===null)?undefined:obj;switch(typeof obj){case'object':return Object.keys(obj).map(function(k){if(Array.isArray(obj[k])){return obj[k].map(function(v){return QueryString.escape(stringifyPrimitive(k))+
eq+
QueryString.escape(stringifyPrimitive(v));}).join(sep);}else{return QueryString.escape(stringifyPrimitive(k))+
eq+
QueryString.escape(stringifyPrimitive(obj[k]));}}).join(sep);default:if(!name)return'';return QueryString.escape(stringifyPrimitive(name))+eq+
QueryString.escape(stringifyPrimitive(obj));}};QueryString.parse=QueryString.decode=function(qs,sep,eq,options){sep=sep||'&';eq=eq||'=';var obj={},maxKeys=1000;if(options&&typeof options.maxKeys==='number'){maxKeys=options.maxKeys;}
if(typeof qs!=='string'||qs.length===0){return obj;}
var regexp=/\+/g;qs=qs.split(sep);if(maxKeys>0){qs=qs.slice(0,maxKeys);}
for(var i=0,len=qs.length;i<len;++i){var x=qs[i].replace(regexp,'%20'),idx=x.indexOf(eq),kstr=x.substring(0,idx),vstr=x.substring(idx+1),k,v;try{k=decodeURIComponent(kstr);v=decodeURIComponent(vstr);}catch(e){k=QueryString.unescape(kstr,true);v=QueryString.unescape(vstr,true);}
if(!hasOwnProperty(obj,k)){obj[k]=v;}else if(!Array.isArray(obj[k])){obj[k]=[obj[k],v];}else{obj[k].push(v);}}
return obj;};return QueryString;})();if(typeof url=="undefined"){var url=(function(){if(typeof punycode=="undefined"){console.error("punycode is required");return;}
if(typeof QueryString=="undefined"){console.error("QueryString is required");return;}
var protocolPattern=/^([a-z0-9.+-]+:)/i,portPattern=/:[0-9]*$/,delims=['<','>','"','`',' ','\r','\n','\t'],unwise=['{','}','|','\\','^','~','`'].concat(delims),autoEscape=['\''],nonHostChars=['%','/','?',';','#'].concat(unwise).concat(autoEscape),nonAuthChars=['/','@','?','#'].concat(delims),hostnameMaxLen=255,hostnamePartPattern=/^[a-zA-Z0-9][a-z0-9A-Z_-]{0,62}$/,hostnamePartStart=/^([a-zA-Z0-9][a-z0-9A-Z_-]{0,62})(.*)$/,unsafeProtocol={'javascript':true,'javascript:':true},hostlessProtocol={'javascript':true,'javascript:':true},pathedProtocol={'http':true,'https':true,'ftp':true,'gopher':true,'file':true,'http:':true,'ftp:':true,'gopher:':true,'file:':true},slashedProtocol={'http':true,'https':true,'ftp':true,'gopher':true,'file':true,'http:':true,'https:':true,'ftp:':true,'gopher:':true,'file:':true},querystring=QueryString;function urlParse(url,parseQueryString,slashesDenoteHost){if(url&&typeof(url)==='object'&&url.href)return url;if(typeof url!=='string'){throw new TypeError("Parameter 'url' must be a string, not "+typeof url);}
var out={},rest=url;for(var i=0,l=rest.length;i<l;i++){if(delims.indexOf(rest.charAt(i))===-1)break;}
if(i!==0)rest=rest.substr(i);var proto=protocolPattern.exec(rest);if(proto){proto=proto[0];var lowerProto=proto.toLowerCase();out.protocol=lowerProto;rest=rest.substr(proto.length);}
if(slashesDenoteHost||proto||rest.match(/^\/\/[^@\/]+@[^@\/]+/)){var slashes=rest.substr(0,2)==='//';if(slashes&&!(proto&&hostlessProtocol[proto])){rest=rest.substr(2);out.slashes=true;}}
if(!hostlessProtocol[proto]&&(slashes||(proto&&!slashedProtocol[proto]))){var atSign=rest.indexOf('@');if(atSign!==-1){var auth=rest.slice(0,atSign);var hasAuth=true;for(var i=0,l=nonAuthChars.length;i<l;i++){if(auth.indexOf(nonAuthChars[i])!==-1){hasAuth=false;break;}}
if(hasAuth){out.auth=decodeURIComponent(auth);rest=rest.substr(atSign+1);}}
var firstNonHost=-1;for(var i=0,l=nonHostChars.length;i<l;i++){var index=rest.indexOf(nonHostChars[i]);if(index!==-1&&(firstNonHost<0||index<firstNonHost))firstNonHost=index;}
if(firstNonHost!==-1){out.host=rest.substr(0,firstNonHost);rest=rest.substr(firstNonHost);}else{out.host=rest;rest='';}
var p=parseHost(out.host);var keys=Object.keys(p);for(var i=0,l=keys.length;i<l;i++){var key=keys[i];out[key]=p[key];}
out.hostname=out.hostname||'';var ipv6Hostname=out.hostname[0]==='['&&out.hostname[out.hostname.length-1]===']';if(out.hostname.length>hostnameMaxLen){out.hostname='';}else if(!ipv6Hostname){var hostparts=out.hostname.split(/\./);for(var i=0,l=hostparts.length;i<l;i++){var part=hostparts[i];if(!part)continue;if(!part.match(hostnamePartPattern)){var newpart='';for(var j=0,k=part.length;j<k;j++){if(part.charCodeAt(j)>127){newpart+='x';}else{newpart+=part[j];}}
if(!newpart.match(hostnamePartPattern)){var validParts=hostparts.slice(0,i);var notHost=hostparts.slice(i+1);var bit=part.match(hostnamePartStart);if(bit){validParts.push(bit[1]);notHost.unshift(bit[2]);}
if(notHost.length){rest='/'+notHost.join('.')+rest;}
out.hostname=validParts.join('.');break;}}}}
out.hostname=out.hostname.toLowerCase();if(!ipv6Hostname){var domainArray=out.hostname.split('.');var newOut=[];for(var i=0;i<domainArray.length;++i){var s=domainArray[i];newOut.push(s.match(/[^A-Za-z0-9_-]/)?'xn--'+punycode.encode(s):s);}
out.hostname=newOut.join('.');}
out.host=(out.hostname||'')+
((out.port)?':'+out.port:'');out.href+=out.host;if(ipv6Hostname){out.hostname=out.hostname.substr(1,out.hostname.length-2);if(rest[0]!=='/'){rest='/'+rest;}}}
if(!unsafeProtocol[lowerProto]){for(var i=0,l=autoEscape.length;i<l;i++){var ae=autoEscape[i];var esc=encodeURIComponent(ae);if(esc===ae){esc=escape(ae);}
rest=rest.split(ae).join(esc);}
var chop=rest.length;for(var i=0,l=delims.length;i<l;i++){var c=rest.indexOf(delims[i]);if(c!==-1){chop=Math.min(c,chop);}}
rest=rest.substr(0,chop);}
var hash=rest.indexOf('#');if(hash!==-1){out.hash=rest.substr(hash);rest=rest.slice(0,hash);}
var qm=rest.indexOf('?');if(qm!==-1){out.search=rest.substr(qm);out.query=rest.substr(qm+1);if(parseQueryString){out.query=querystring.parse(out.query);}
rest=rest.slice(0,qm);}else if(parseQueryString){out.search='';out.query={};}
if(rest)out.pathname=rest;if(slashedProtocol[proto]&&out.hostname&&!out.pathname){out.pathname='/';}
if(out.pathname||out.search){out.path=(out.pathname?out.pathname:'')+
(out.search?out.search:'');}
out.href=urlFormat(out);return out;}
function urlFormat(obj){if(typeof(obj)==='string')obj=urlParse(obj);var auth=obj.auth||'';if(auth){auth=encodeURIComponent(auth);auth=auth.replace(/%3A/i,':');auth+='@';}
var protocol=obj.protocol||'',pathname=obj.pathname||'',hash=obj.hash||'',host=false,query='';if(obj.host!==undefined){host=auth+obj.host;}else if(obj.hostname!==undefined){host=auth+(obj.hostname.indexOf(':')===-1?obj.hostname:'['+obj.hostname+']');if(obj.port){host+=':'+obj.port;}}
if(obj.query&&typeof obj.query==='object'&&Object.keys(obj.query).length){query=querystring.stringify(obj.query);}
var search=obj.search||(query&&('?'+query))||'';if(protocol&&protocol.substr(-1)!==':')protocol+=':';if(obj.slashes||(!protocol||slashedProtocol[protocol])&&host!==false){host='//'+(host||'');if(pathname&&pathname.charAt(0)!=='/')pathname='/'+pathname;}else if(!host){host='';}
if(hash&&hash.charAt(0)!=='#')hash='#'+hash;if(search&&search.charAt(0)!=='?')search='?'+search;return protocol+host+pathname+search+hash;}
function urlResolve(source,relative){return urlFormat(urlResolveObject(source,relative));}
function urlResolveObject(source,relative){if(!source)return relative;source=urlParse(urlFormat(source),false,true);relative=urlParse(urlFormat(relative),false,true);source.hash=relative.hash;if(relative.href===''){source.href=urlFormat(source);return source;}
if(relative.slashes&&!relative.protocol){relative.protocol=source.protocol;if(slashedProtocol[relative.protocol]&&relative.hostname&&!relative.pathname){relative.path=relative.pathname='/';}
relative.href=urlFormat(relative);return relative;}
if(relative.protocol&&relative.protocol!==source.protocol){if(!slashedProtocol[relative.protocol]){relative.href=urlFormat(relative);return relative;}
source.protocol=relative.protocol;if(!relative.host&&!hostlessProtocol[relative.protocol]){var relPath=(relative.pathname||'').split('/');while(relPath.length&&!(relative.host=relPath.shift()));if(!relative.host)relative.host='';if(!relative.hostname)relative.hostname='';if(relPath[0]!=='')relPath.unshift('');if(relPath.length<2)relPath.unshift('');relative.pathname=relPath.join('/');}
source.pathname=relative.pathname;source.search=relative.search;source.query=relative.query;source.host=relative.host||'';source.auth=relative.auth;source.hostname=relative.hostname||relative.host;source.port=relative.port;if(source.pathname!==undefined||source.search!==undefined){source.path=(source.pathname?source.pathname:'')+
(source.search?source.search:'');}
source.slashes=source.slashes||relative.slashes;source.href=urlFormat(source);return source;}
var isSourceAbs=(source.pathname&&source.pathname.charAt(0)==='/'),isRelAbs=(relative.host!==undefined||relative.pathname&&relative.pathname.charAt(0)==='/'),mustEndAbs=(isRelAbs||isSourceAbs||(source.host&&relative.pathname)),removeAllDots=mustEndAbs,srcPath=source.pathname&&source.pathname.split('/')||[],relPath=relative.pathname&&relative.pathname.split('/')||[],psychotic=source.protocol&&!slashedProtocol[source.protocol];if(psychotic){delete source.hostname;delete source.port;if(source.host){if(srcPath[0]==='')srcPath[0]=source.host;else srcPath.unshift(source.host);}
delete source.host;if(relative.protocol){delete relative.hostname;delete relative.port;if(relative.host){if(relPath[0]==='')relPath[0]=relative.host;else relPath.unshift(relative.host);}
delete relative.host;}
mustEndAbs=mustEndAbs&&(relPath[0]===''||srcPath[0]==='');}
if(isRelAbs){source.host=(relative.host||relative.host==='')?relative.host:source.host;source.hostname=(relative.hostname||relative.hostname==='')?relative.hostname:source.hostname;source.search=relative.search;source.query=relative.query;srcPath=relPath;}else if(relPath.length){if(!srcPath)srcPath=[];srcPath.pop();srcPath=srcPath.concat(relPath);source.search=relative.search;source.query=relative.query;}else if('search'in relative){if(psychotic){source.hostname=source.host=srcPath.shift();var authInHost=source.host&&source.host.indexOf('@')>0?source.host.split('@'):false;if(authInHost){source.auth=authInHost.shift();source.host=source.hostname=authInHost.shift();}}
source.search=relative.search;source.query=relative.query;if(source.pathname!==undefined||source.search!==undefined){source.path=(source.pathname?source.pathname:'')+
(source.search?source.search:'');}
source.href=urlFormat(source);return source;}
if(!srcPath.length){delete source.pathname;if(!source.search){source.path='/'+source.search;}else{delete source.path;}
source.href=urlFormat(source);return source;}
var last=srcPath.slice(-1)[0];var hasTrailingSlash=((source.host||relative.host)&&(last==='.'||last==='..')||last==='');var up=0;for(var i=srcPath.length;i>=0;i--){last=srcPath[i];if(last=='.'){srcPath.splice(i,1);}else if(last==='..'){srcPath.splice(i,1);up++;}else if(up){srcPath.splice(i,1);up--;}}
if(!mustEndAbs&&!removeAllDots){for(;up--;up){srcPath.unshift('..');}}
if(mustEndAbs&&srcPath[0]!==''&&(!srcPath[0]||srcPath[0].charAt(0)!=='/')){srcPath.unshift('');}
if(hasTrailingSlash&&(srcPath.join('/').substr(-1)!=='/')){srcPath.push('');}
var isAbsolute=srcPath[0]===''||(srcPath[0]&&srcPath[0].charAt(0)==='/');if(psychotic){source.hostname=source.host=isAbsolute?'':srcPath.length?srcPath.shift():'';var authInHost=source.host&&source.host.indexOf('@')>0?source.host.split('@'):false;if(authInHost){source.auth=authInHost.shift();source.host=source.hostname=authInHost.shift();}}
mustEndAbs=mustEndAbs||(source.host&&srcPath.length);if(mustEndAbs&&!isAbsolute){srcPath.unshift('');}
source.pathname=srcPath.join('/');if(source.pathname!==undefined||source.search!==undefined){source.path=(source.pathname?source.pathname:'')+
(source.search?source.search:'');}
source.auth=relative.auth||source.auth;source.slashes=source.slashes||relative.slashes;source.href=urlFormat(source);return source;}
function parseHost(host){var out={};var port=portPattern.exec(host);if(port){port=port[0];if(port!==':'){out.port=port.substr(1);}
host=host.substr(0,host.length-port.length);}
if(host)out.hostname=host;return out;}
return{parse:urlParse,resolve:urlResolve,resolveObject:urlResolveObject,format:urlFormat}})();}
var NATS=(function(){if(typeof EventEmitter!='function'){console.error('The EventEmitter library (https://github.com/Wolfy87/EventEmitter) is required');return;}
if(typeof url!='object'){console.error('The url library is required');return;}
var VERSION='0.2.7',DEFAULT_PORT=4222,DEFAULT_PRE='nats://localhost:',DEFAULT_URI=DEFAULT_PRE+DEFAULT_PORT,MAX_CONTROL_LINE_SIZE=512,AWAITING_CONTROL=0,AWAITING_MSG_PAYLOAD=1,DEFAULT_RECONNECT_TIME_WAIT=2*1000,DEFAULT_MAX_RECONNECT_ATTEMPTS=10,CONTROL_LINE=/^(.*)\r\n/,MSG=/^MSG\s+([^\s\r\n]+)\s+([^\s\r\n]+)\s+(([^\s\r\n]+)[^\S\r\n]+)?(\d+)\r\n/i,OK=/^\+OK\s*\r\n/i,ERR=/^-ERR\s+('.+')?\r\n/i,PING=/^PING\r\n/i,PONG=/^PONG\r\n/i,INFO=/^INFO\s+([^\r\n]+)\r\n/i,CR_LF='\r\n',CR_LF_LEN=CR_LF.length,EMPTY='',SPC=' ',PUB='PUB',SUB='SUB',UNSUB='UNSUB',CONNECT='CONNECT',PING_REQUEST='PING'+CR_LF,PONG_RESPONSE='PONG'+CR_LF,EMPTY='',Q_SUB=/^([^\.\*>\s]+|>$|\*)(\.([^\.\*>\s]+|>$|\*))*$/,Q_SUB_NO_WC=/^([^\.\*>\s]+)(\.([^\.\*>\s]+))*$/,FLUSH_THRESHOLD=65536;function hexRand(limit){return(parseInt(Math.random()*limit,16).toString(16));}
function byteLength(str){return unescape(encodeURIComponent(str)).length;}
function inherits(ctor,superCtor){ctor.super_=superCtor;ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:false,writable:true,configurable:true}});};var createInbox=function(){return('_INBOX.'+
hexRand(0x0010000)+
hexRand(0x0010000)+
hexRand(0x0010000)+
hexRand(0x0010000)+
hexRand(0x1000000));};function Client(opts){EventEmitter.call(this);this.parseOptions(opts);this.initState();this.createConnection();}
var connect=function(opts){return new Client(opts);};inherits(Client,EventEmitter);Client.prototype.createInbox=createInbox;Client.prototype.assignOption=function(opts,prop,assign){if(assign===undefined){assign=prop;}
if(opts[prop]!==undefined){this.options[assign]=opts[prop];}};Client.prototype.parseOptions=function(opts){var options=this.options={'url':DEFAULT_URI,'verbose':false,'pedantic':false,'reconnect':true,'maxReconnectAttempts':DEFAULT_MAX_RECONNECT_ATTEMPTS,'reconnectTimeWait':DEFAULT_RECONNECT_TIME_WAIT,'path':'/nats'};if('number'===typeof opts){options.url=DEFAULT_PRE+opts;}else if('string'===typeof opts){options.url=opts;}else if('object'===typeof opts){if(opts.port!==undefined){options.url=DEFAULT_PRE+opts.port;}
this.assignOption(opts,'url');this.assignOption(opts,'uri','url');this.assignOption(opts,'user');this.assignOption(opts,'pass');this.assignOption(opts,'password','pass');this.assignOption(opts,'verbose');this.assignOption(opts,'pedantic');this.assignOption(opts,'reconnect');this.assignOption(opts,'maxReconnectAttempts');this.assignOption(opts,'reconnectTimeWait');this.assignOption(opts,'path');}
options.uri=options.url;if(options.url!==undefined){this.url=url.parse(options.url);if(this.url.auth!==undefined){var auth=this.url.auth.split(':');if(options.user===undefined){options.user=auth[0];}
if(options.pass===undefined){options.pass=auth[1];}}}};Client.prototype.createConnection=function(){var client=this;client.pongs=[];client.pending=[];client.pSize=0;client.pstate=AWAITING_CONTROL;var scheme=(window.location.protocol||document.location.protocol)=="https:"?'wss://':'ws://';var stream=new WebSocket(scheme+window.location.host+client.options.path);client.stream=stream
stream.onopen=function(){var wasReconnecting=client.reconnecting;var event=wasReconnecting===true?'reconnect':'connect';client.connected=true;client.reconnecting=false;client.reconnects=0;client.flushPending();if(wasReconnecting){client.sendSubscriptions();}
client.flush(function(){client.emit(event,client);});};stream.onclose=function(hadError){if(hadError){return;}
client.closeStream();client.emit('disconnect');if(client.closed===true||client.options.reconnect===false||client.reconnects>=client.options.maxReconnectAttempts){client.emit('close');}else{client.scheduleReconnect();}};stream.onerror=function(exception){client.closeStream();if(client.reconnecting===false){client.emit('error',exception);}
client.emit('disconnect');if(client.reconnecting===true){if(client.closed===true||client.reconnects>=client.options.maxReconnectAttempts){client.emit('close');}else{client.scheduleReconnect();}}};stream.onmessage=function(wsmsg){var data=wsmsg.data
var m;client.inbound=client.inbound?client.inbound+data:data;while(!client.closed&&client.inbound&&client.inbound.length>0){switch(client.pstate){case AWAITING_CONTROL:if((m=MSG.exec(client.inbound))!=null){client.payload={subj:m[1],sid:m[2],reply:m[4],size:parseInt(m[5],10)};client.pstate=AWAITING_MSG_PAYLOAD;}else if((m=OK.exec(client.inbound))!=null){}else if((m=ERR.exec(client.inbound))!=null){client.emit('error',m[1]);}else if((m=PONG.exec(client.inbound))!=null){var cb=client.pongs.shift();if(cb){cb();}}else if((m=PING.exec(client.inbound))!=null){client.sendCommand(PONG_RESPONSE);}else if((m=INFO.exec(client.inbound))!=null){}else{return;}
break;case AWAITING_MSG_PAYLOAD:if(client.inbound.length<client.payload.size+CR_LF_LEN){return;}
client.payload.msg=client.inbound.slice(0,client.payload.size).toString();if(client.inbound.length===client.payload.size+CR_LF_LEN){client.inbound=null;}else{client.inbound=client.inbound.slice(client.payload.size+CR_LF_LEN);}
client.processMsg();}
if(m){var psize=m[0].length;if(psize>=client.inbound.length){client.inbound=null;}else{client.inbound=client.inbound.slice(psize);}}
m=null;}};var cs={'verbose':this.options.verbose,'pedantic':this.options.pedantic};if(this.options.user!==undefined){cs.user=this.options.user;cs.pass=this.options.pass;}
this.sendCommand(CONNECT+SPC+JSON.stringify(cs)+CR_LF);};Client.prototype.initState=function(){this.ssid=1;this.subs={};this.reconnects=0;this.connected=false;this.reconnecting=false;};Client.prototype.close=function(){this.closed=true;this.removeAllListeners();this.closeStream();this.ssid=-1;this.subs=null;this.pstate=-1;this.pongs=null;this.pending=null;this.pSize=0;};Client.prototype.closeStream=function(){if(this.stream!=null){this.stream.close();this.stream=null;}
if(this.connected===true||this.closed===true){this.pongs=null;this.pending=null;this.pSize=0;this.connected=false;}};Client.prototype.flushPending=function(){if(this.connected===false||this.pending==null||this.pending.length===0){return;}
this.stream.send(this.pending.join(EMPTY));this.pending=[];this.pSize=0;};Client.prototype.sendCommand=function(cmd){if(this.closed||this.pending==null){return;}
this.pending.push(cmd);this.pSize+=byteLength(cmd);if(this.connected===true){if(this.pending.length===1){var self=this;setTimeout(function(){self.flushPending();},1);}else if(this.pSize>FLUSH_THRESHOLD){this.flushPending();}}};Client.prototype.sendSubscriptions=function(){var proto;for(var sid in this.subs){if(this.subs.hasOwnProperty(sid)){var sub=this.subs[sid];if(sub.qgroup){proto=[SUB,sub.subject,sub.qgroup,sid+CR_LF];}else{proto=[SUB,sub.subject,sid+CR_LF];}
this.sendCommand(proto.join(SPC));}}};Client.prototype.processMsg=function(){var sub=this.subs[this.payload.sid];if(sub!=null){sub.received+=1;if(sub.timeout){if(sub.received>=sub.expected){clearTimeout(sub.timeout);sub.timeout=null;}}
if(sub.max!==undefined){if(sub.received===sub.max){delete this.subs[this.payload.sid];}else if(sub.received>sub.max){this.unsubscribe(this.payload.sid);sub.callback=null;}}
if(sub.callback){sub.callback(this.payload.msg,this.payload.reply,this.payload.subj);}}
this.pstate=AWAITING_CONTROL;this.payload=null;};Client.prototype.flush=function(opt_callback){if(typeof opt_callback==='function'){this.pongs.push(opt_callback);this.sendCommand(PING_REQUEST);}};Client.prototype.publish=function(subject,msg,opt_reply,opt_callback){if(!msg){msg=EMPTY;}
if(typeof msg==='function'){if(opt_callback||opt_reply){throw(new Error("Message can't be a function"));}
opt_callback=msg;msg=EMPTY;opt_reply=undefined;}
if(typeof opt_reply==='function'){if(opt_callback){throw(new Error("Reply can't be a function"));}
opt_callback=opt_reply;opt_reply=undefined;}
var proto=[PUB,subject];var pmsg=[byteLength(msg),CR_LF,msg,CR_LF];if(opt_reply!==undefined){proto.push(opt_reply);}
this.sendCommand(proto.concat(pmsg.join(EMPTY)).join(SPC));if(opt_callback!==undefined){this.flush(opt_callback);}};Client.prototype.subscribe=function(subject,opts,callback){var qgroup,max;if(typeof opts==='function'){callback=opts;opts=null;}else if(opts&&typeof opts==='object'){qgroup=opts.queue;max=opts.max;}
this.ssid+=1;this.subs[this.ssid]={'subject':subject,'callback':callback,'received':0};var proto;if(typeof qgroup==='string'){this.subs[this.ssid].qgroup=qgroup;proto=[SUB,subject,qgroup,this.ssid+CR_LF];}else{proto=[SUB,subject,this.ssid+CR_LF];}
this.sendCommand(proto.join(SPC));if(max){this.unsubscribe(this.ssid,max);}
return this.ssid;};Client.prototype.unsubscribe=function(sid,opt_max){if(!sid){return;}
var proto;if(opt_max){proto=[UNSUB,sid,opt_max+CR_LF];}else{proto=[UNSUB,sid+CR_LF];}
this.sendCommand(proto.join(SPC));var sub=this.subs[sid];if(sub==null){return;}
sub.max=opt_max;if(sub.max===undefined||(sub.received>=sub.max)){delete this.subs[sid];}};Client.prototype.timeout=function(sid,timeout,expected,callback){if(!sid){return;}
var sub=this.subs[sid];if(sub==null){return;}
sub.expected=expected;sub.timeout=setTimeout(function(){callback(sid);},timeout);};Client.prototype.request=function(subject,opt_msg,opt_options,callback){if(typeof opt_msg==='function'){callback=opt_msg;opt_msg=EMPTY;opt_options=null;}
if(typeof opt_options==='function'){callback=opt_options;opt_options=null;}
var inbox=createInbox();var s=this.subscribe(inbox,opt_options,function(msg,reply){callback(msg,reply);});this.publish(subject,opt_msg,inbox);return s;};Client.prototype.reconnect=function(){if(this.closed){return;}
this.reconnects+=1;this.createConnection();this.emit('reconnecting');};Client.prototype.scheduleReconnect=function(){var client=this;client.reconnecting=true;setTimeout(function(){client.reconnect();},this.options.reconnectTimeWait);};return{version:VERSION,createInbox:createInbox,connection:connect}})();