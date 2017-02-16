/**
*
Telemetry utilizes telemetry provider apis.

Type definitions are also very important in Telemetry.

WebSocket server is a big part of this.

*/


var TelemetryProvider = {
    supportsRequest: function (domainObject) {
        console.log('checking for applicability');
        return domainObject.type === 'example.telemetry';
    },
    supportsSubscription: function (domainObject) {
        console.log('checking for applicability');
        return domainObject.type === 'example.telemetry';
    },
    request: function (domainObject, options) {
        console.log('attempting to provide for the children');
        return Promise.resolve([]);
    },
    subscribe: function (domainObject, callback, options) {
        console.log('attempting to subscribe to the status quo.');
        return function () {};
    }
};


function TelemetryPlugin(openmct) {
    openmct.telemetry.addProvider(TelemetryProvider);
}
