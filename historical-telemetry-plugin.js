/** @typedef {import('openmct/dist/openmct').OpenMCT} OpenMCT */

function HistoricalTelemetryPlugin() {
  /**
   * @param {OpenMCT} openmct
   */
  return function install(openmct) {
    const historicalTelemetryProvider = {
      supportsRequest(domainObject) {
        return true;
      },
      async request(domainObject, options) {
        // const randomValues = [];
        // for (let i=0; i<=1000; i++) {
        //   randomValues.push({
        //     timestamp: Date.now() - i * 1000,
        //     value: Math.random() * 100
        //   })
        // }

        // return Promise.resolve(randomValues);
        const response = await fetch(`/history/${domainObject.identifier.key}?start=${options.start}&end=${options.end}`);
        const telemetry = await response.json();

        return telemetry;
      }
    };

    openmct.telemetry.addProvider(historicalTelemetryProvider);
  }
}