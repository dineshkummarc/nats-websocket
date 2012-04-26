dist : lib/punycode.js lib/querystring.js lib/url.js lib/nats-websocket.js
	cat lib/punycode.js lib/querystring.js lib/url.js lib/nats-websocket.js | jsmin > nats-websocket-min.js

