/** @typedef {import('openmct/dist/openmct').OpenMCT} OpenMCT */

const objectProvider = {
  get: async (identifier) => {
    const dictionary = await getDictionary();
    if (identifier.key === 'spacecraft') {
      return {
        identifier,
        name: "Spacecraft",
        type: "folder",
        location: "ROOT",
        composition: dictionary.measurements.map((measurement) => {
          return {
            namespace: identifier.namespace,
            key: measurement.key
          }
        })
      };
    } else {
      const measurement = dictionary.measurements.find((m) => m.key === identifier.key);
      return {
        identifier,
        name: measurement.name,
        type: 'example.telemetry',
        telemetry: {
          values: measurement.values
        }
      }
    }
  }
}

function DictionaryPlugin() {
  /**
   * @param {OpenMCT} openmct
   */
  return function install(openmct) {
    console.log("Hello Izmir!");
    openmct.objects.addRoot({
      namespace: 'example.taxonomy',
      key: 'spacecraft'
    });
    openmct.objects.addProvider('example.taxonomy', objectProvider);
    openmct.types.addType('example.telemetry', {
      name: 'Example Telemetry Point',
      description: 'Example telemetry point from our happy tutorial.',
      cssClass: 'icon-telemetry'
    });
    
  }
}




async function getDictionary() {
  const response = await fetch('/dictionary.json');
  const responseJson = await response.json();

  return responseJson;
}