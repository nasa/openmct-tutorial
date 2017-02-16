var WebSocketServer = require('ws').Server;

function RealtimeServer(spacecraft, port) {
    this.spacecraft = spacecraft;
    this.server = new WebSocketServer({ port: port });
    this.server.on('connection', this.handleConnection.bind(this));
    console.log('Realtime server started at ws://localhost:' + port);
};

RealtimeServer.prototype.handleConnection = function (ws) {
    var unlisten = this.spacecraft.listen(notifySubscribers);
        subscribed = {}, // Active subscriptions for this connection
        handlers = { // Handlers for specific requests
            subscribe: function (id) {
                subscribed[id] = true;
            },
            unsubscribe: function (id) {
                delete subscribed[id];
            }
        };

    function notifySubscribers(point) {
        if (subscribed[point.id]) {
            ws.send(JSON.stringify(point));
        }
    }

    // Listen for requests
    ws.on('message', function (message) {
        var parts = message.split(' '),
            handler = handlers[parts[0]];
        if (handler) {
            handler.apply(handlers, parts.slice(1));
        }
    });

    // Stop sending telemetry updates for this connection when closed
    ws.on('close', unlisten);
};



module.exports = RealtimeServer;