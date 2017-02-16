/**
 * Basic Realtime telemetry plugin using websockets.
 */

function RealtimeTelemetryPlugin(openmct) {
    var socket = new WebSocket('ws://localhost:8081');
    var listeners = {};

    socket.onmessage = function (event) {
        point = JSON.parse(event.data);
        if (listeners[point.id]) {
            listeners[point.id].forEach(function (l) {
                l(point);
            });
        }
    };
    
    var provider = {
        supportsSubscribe: function (domainObject) {
            return domainObject.type === 'example.telemetry';
        },
        subscribe: function (domainObject, callback, options) {
            if (!listeners[domainObject.telemetry.key]) {
                listeners[domainObject.telemetry.key] = [];
            }
            if (!listeners[domainObject.telemetry.key].length) {
                socket.send('subscribe ' + domainObject.telemetry.key);
            }
            listeners[domainObject.telemetry.key].push(callback);
            return function () {
                console.log('unsubscribe');
                listeners[domainObject.telemetry.key] = 
                    listeners[domainObject.telemetry.key].filter(function (c) {
                        return c !== callback;
                    });

                if (!listeners[domainObject.telemetry.key].length) {
                    socket.send('unsubscribe ' + domainObject.telemetry.key);
                }
            };
        }
    };
    
    openmct.telemetry.addProvider(provider);
}