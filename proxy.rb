
# ruby proxy.rb

require "sinatra"
require 'sinatra-websocket'

set :server, 'thin'

get '/nats/?' do
  return erb(:index) unless request.websocket?
  request.websocket do |ws|
    EM.connect('127.0.0.1', 4222, Module.new {attr_accessor :ws }) do |mnats|
      mnats.ws = ws

      def mnats.receive_data(d)
        ws.send(d.force_encoding('UTF-8'))
      end

      def mnats.unbind
        ws.close_connection_after_writing
      end

      ws.onmessage { |m| mnats.send_data(m) }
      ws.onclose { mnats.close_connection_after_writing }
    end
  end
end

__END__

@@ index
<html>
  <head>
    <script type="text/javascript" src="/EventEmitter.js" ></script>
    <script type="text/javascript" src="/nats-websocket-min.js" ></script>
  </head>
  <body>

  </body>
</html>
