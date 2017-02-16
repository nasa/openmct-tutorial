/**
*
Telemetry utilizes telemetry provider apis.

Type definitions are also very important in Telemetry.

WebSocket server is a big part of this.

*/

// GET /telemetry/:pointId?start=&end=


var HistoricalTelemetryProvider = {
    supportsRequest: function (domainObject) {
        console.log('checking for applicability');
        return domainObject.type === 'example.telemetry';
    },
    request: function (domainObject, options) {
        console.log('attempting to provide for the children');
        var url = 'http://localhost:8081/telemetry/' + 
            domainObject.telemetry.key +
            '?start=' + options.start +
            '&end=' + options.end;
        
        return atomic.get(url)
                .then(function (resp) {
                    return resp.data;
                })
    }
};

var RealtimeTelemetryProvider = {
    supportsSubscription: function (domainObject) {
        console.log('checking for applicability');
        return domainObject.type === 'example.telemetry';
    },
    subscribe: function (domainObject, callback, options) {
        console.log('attempting to subscribe to the status quo.');
        return function () {};
    }
};


function TelemetryPlugin(openmct) {
    openmct.telemetry.addProvider(TelemetryProvider);
    openmct.telemetry.addProvider(RealtimeTelemetryProvider);
}
