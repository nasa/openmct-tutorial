/**
*
Telemetry utilizes telemetry provider apis.

Type definitions are also very important in Telemetry.

WebSocket server is a big part of this.

*/


var TelemetryProvider = {
    appliesTo: function (domainObject) {
        return domainObject.type === 'example.telemetry';
    }
};
