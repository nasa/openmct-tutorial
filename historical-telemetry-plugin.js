/**
 * Basic historical telemetry plugin.
 */




function HistoricalTelemetryPlugin(openmct) {
    var provider = {
        supportsRequest: function (domainObject) {
            return domainObject.type === 'example.telemetry';
        },
        request: function (domainObject, options) {
            var url = 'http://localhost:8080/telemetry/' + 
                domainObject.telemetry.key +
                '?start=' + options.start +
                '&end=' + options.end;
        
            return atomic.get(url)
                    .then(function (resp) {
                        return resp.data;
                    })
        }
    };
    
    openmct.telemetry.addProvider(provider);
}
