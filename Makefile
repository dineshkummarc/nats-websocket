dist : link 
	jsmin < nats-websocket.js > nats-websocket-min.js

link : lib/querystring.js lib/url.js lib/nats-websocket.js
	cat  lib/querystring.js lib/url.js lib/nats-websocket.js > nats-websocket.js
