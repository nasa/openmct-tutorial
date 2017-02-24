/**
 * Basic historical telemetry plugin.
 */

function HistoricalTelemetryPlugin(openmct) {
    var provider = {
        supportsRequest: function (domainObject) {
            return domainObject.type === 'example.telemetry';
        },
        request: function (domainObject, options) {
            var url = 'http://localhost:8081/telemetry/' +
                domainObject.telemetry.key +
                '?start=' + options.start +
                '&end=' + options.end;

            return http.get(url)
                .then(function (resp) {
                    return resp.data;
                });
        }
    };

    openmct.telemetry.addProvider(provider);
}