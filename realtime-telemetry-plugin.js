/** @typedef {import('openmct/dist/openmct').OpenMCT} OpenMCT */
function RealtimeTelemetryPlugin(){
  /**
   * @param {OpenMCT} openmct
   */
  return function install(openmct) {
    const ws = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
    const realtimeTelemetryProvider = {
      supportsSubscribe(domainObject) {
        return true;
      },
      subscribe(domainObject, callback) {
        ws.send(`subscribe ${domainObject.identifier.key}`);

        function decodeMessage(message) {
          const parsedMessage = JSON.parse(message.data);
          if (parsedMessage.id === domainObject.identifier.key){
            callback(parsedMessage);
          }
        }

        ws.addEventListener('message', decodeMessage);
        return function unsubscribe() {
          ws.send(`unsubscribe ${domainObject.identifier.key}`);
          ws.removeEventListener('message', decodeMessage);
        }
      }
    }
    openmct.telemetry.addProvider(realtimeTelemetryProvider);
  }
}