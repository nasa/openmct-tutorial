/**

Taxonomy Utilizes Roots, Composition, and object provider APIs.

Need to read a source dictionary, json file is fine.

Add single root
Add composition for root
Add subobjects


*/

(function () {

    var objectProvider = {
        get: function (identifier) {
            if (identifier.key === 'root') {
                console.log('getting object');
                return Promise.resolve({
                    identifier: identifier,
                    name: 'Tutorial Spacecraft',
                    type: 'folder',
                    location: 'ROOT'
                });
            }
        }
    };

    var compositionProvider = {
        appliesTo: function (domainObject) {
            return domainObject.identifier.namespace === 'example.taxonomy' &&
                   domainObject.type === 'folder';
        },
        load: function (domainObject) {
            return atomic.get('/dictionary.json')
                .then(function (results) {
                    // TODO: parse dictionary JSON
                    console.log('results', results);
                })
                .catch(function (err) {
                    console.log('err', err);
                });
        }
    };


    window.TaxonomyPlugin = function (openmct) {
        openmct.objects.addRoot({
            namespace: 'example.taxonomy',
            key: 'root'
        });

        openmct.objects.addProvider('example.taxonomy', objectProvider);

        openmct.composition.addProvider(compositionProvider);

    };

}());
