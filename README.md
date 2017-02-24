# Open MCT Integration Tutorials

These tutorials will walk you through the simple process of integrating your telemetry systems with Open MCT.  In case you don't have any telemetry systems, we've included a reference implementation of a historical and realtime server.  We'll walk you through the process of integrating those services with Open MCT.

## Tutorial Prerequisites

* [node.js](https://nodejs.org/en/)
    * Mac OS: We recommend using [Homebrew](https://brew.sh/) to install node.
    ```
    $ brew install node
    ```
    * Windows: https://nodejs.org/en/download/
    * linux: https://nodejs.org/en/download/
* [git](https://git-scm.com/)
    * Mac OS: If XCode is installed, git is likely to already be available from your command line. If not, git can be installed using [Homebrew](https://brew.sh/).
    ```
    $ brew install git
    ```
    * Windows: https://git-scm.com/downloads
    * linux: https://git-scm.com/downloads

Neither git nor node.js are requirements for using Open MCT, however this tutorial assumes that both are installed. Also, command line familiarity is a plus, however the tutorial is written in such a way that it should be possible to copy-paste the steps verbatim into a POSIX command line.

## Installing the tutorials

```
git clone git@github.com:larkin/openmct-tutorials-sprint.git
cd openmct-tutorials-sprint
npm install
npm start
```

This will clone the tutorials and install Open MCT from NPM.  It will also install the dependencies needed to run the reference implementation of a telemetry server, and then it will start the tutorial server.

At this point, you will be able to browse the tutorials in their completed state.  However, if you would like to follow along, you can skip to specific steps in the tutorial at any point by typing

```
git checkout -f part-X-step-N
```

Substituting the appropriate part and step numbers as necessary.

## Part A: Running Open MCT
**Shortcut**: `git checkout -f part-A`

We're going to define a single `index.html` page.  We'll include the Open MCT library, configure a number of plugins, and then start the application.

[index.html]()
```html
<!DOCTYPE html>
<html>
<head>
    <title>Open MCT Tutorials</title>
    <script src="node_modules/openmct/dist/openmct.js"></script>
</head>
<body>
    <script>
        openmct.setAssetPath('node_modules/openmct/dist');
        openmct.install(openmct.plugins.LocalStorage());
        openmct.install(openmct.plugins.MyItems());
        openmct.install(openmct.plugins.Espresso());
        openmct.install(openmct.plugins.UTCTimeSystem());
        openmct.start();
    </script>
</body>
</html>
```

# Part B - Populating the Object Tree
## Introduction
In Open MCT everything is represented as a Domain Object, this includes sources of telemetry, telemetry points, and views for visualizing telemetry. Domain Objects are accessible from the object tree 

![Domain Objects are accessible from the object tree](images/object-tree.png)

The object tree is a hierarchical representation of all of the objects available in Open MCT. At the root of an object hierarchy is a root object. For this tutorial, we are going to create a new root object representing our spacecraft, and then populate it with objects representing the telemetry producing subsystems on our fictional spacecraft.

## Step 1 - Defining a new plugin
**Shortcut:** `git checkout -f part-b-step-1`
Let's create a new javascript file, `dictionary-plugin.js` for our new plugin.  We'll then install that plugin into Open MCT to validate that we are loading the plugin

[dictionary-plugin.js]()
```javascript
var DictionaryPlugin = function () {
    
    return function install() {
        console.log("I've been installed!");
    }
};
```

Then, we'll update index.html to include the file:

[index.html]()
```html
<!DOCTYPE html>
<html>
<head>
    <title>Open MCT Tutorials</title>
    <script src="node_modules/openmct/dist/openmct.js"></script>
    <script src="dictionary-plugin.js"></script>
</head>
<body>
    <script>
        openmct.setAssetPath('node_modules/openmct');
        openmct.install(openmct.plugins.LocalStorage());
        openmct.install(openmct.plugins.MyItems());
        openmct.install(openmct.plugins.Espresso());
        openmct.install(openmct.plugins.UTCTimeSystem());
        
        openmct.install(DictionaryPlugin());
        openmct.start();
    </script>
</body>
</html>
```

If we reload the browser now, and open a javascript console, we should see our message - `I've been installed`. The process of opening a javascript console differs depending on the browser being used. Instructions for launching the browser console in most modern browsers are [available here](http://webmasters.stackexchange.com/a/77337).

I summary, an Open MCT plugin is very simple: it's an initialization function which receives a single argument - the Open MCT API.  It then uses the provided API to extend Open MCT.  Generally, we like plugins to return an initialization function so they can receive configuration.

[Learn more about plugins here](api/plugin-overview.md)

## Step 2 - Creating a new root node
**Shortcut:** `git checkout -f part-b-step-2`

To be able to access our spacecraft objects from the tree, we first need to define a root. A new root can be added to the object tree using the `addRoot` function exposed by the Open MCT API. `addRoot` accepts an object identifier, defined as a javascript object with a `namespace` and a `key` attribute.

_[dictionary-plugin.js]()_
```javascript
var DictionaryPlugin = function () {
    return function install(openmct) {
        openmct.objects.addRoot({
          namespace: 'example.taxonomy',
          key: 'spacecraft'
        });
    }
};
```

If we reload the browser now, we should see a new object in the tree. Currently it will appear as a question mark with "Unknown Object" next to it. This is because Open MCT can't find an object with the provided identifier. In the next step, we will define an Object Provider, which will provide Open MCT with an object for this root.

## Step 3 - Providing objects
**Shortcut:** `git checkout -f part-b-step-3`

Now that we have added a new root to the object tree, we can start populating the tree with objects. Objects are provided to Open MCT by an Object Provider. An object provider receives an object identifier, and returns a promise that resolve with an object for the given identifier (if available).  In this step we will produce some objects to represent the parts of the spacecraft that produce telemetry data, such as subsystems and instruments. Let's call these telemetry producing things "telemetry points".

_Snippet from [dictionary-plugin.js]()_
```
function getDictionary() {
    return http.get('/dictionary.json')
        .then(function (result) {
            return result.data;
        });
}
var objectProvider = {
    get: function (identifier) {
        return getDictionary().then(function (dictionary) {
            if (identifier.key === 'spacecraft') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            }
        });
    }
};
openmct.objects.addProvider('example.taxonomy', objectProvider);
```

Here we define and register an Object Provider that provides an object for our `spacecraft` root object registered in the previous step.

If we reload our browser now, the unknown object in our tree should be replaced with an object named `Example Spacecraft` with a folder icon. 

The root object uses the builtin type `folder`. For the objects representing the telemetry points for our spacecraft, we will now register a new object type.

_Snippet from [dictionary-plugin.js]()_
```javascript
openmct.types.addType('example.telemetry', {
    name: 'Example Telemetry Point',
    description: 'Example telemetry point from our happy tutorial.',
    cssClass: 'icon-telemetry'
});
```

Here we define a new type with a key of `example.telemetry`. For details on the attributes used to specify a new Type, please [see our documentation on object Types]()
 
Finally, let's modify our object provider to return objects of ourly newly registered type.

```javascript
var objectProvider = {
    get: function (identifier) {
        return getDictionary().then(function (dictionary) {
            if (identifier.key === 'spacecraft') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } else {
                var measurement = dictionary.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'example.telemetry',
                    telemetry: measurement,
                    location: 'example.taxonomy:spacecraft'
                };
            }
        });
    }
};
```

Although we have now defined an object provider for both the Example Spacecraft and its children (the telemetry measurements) there's a final step involved in populating the object tree with all of the measurements available from the spacecraft.

## Step 4 - Populating the tree
**Shortcut:** `git checkout -f part-b-step-3`

We have defined a root node in [Step 1]() and we have provided some objects that will appear in the tree. Finally we need to provide structure to the tree and define the relationships between the objects. This is achieved with a [Composition Provider](). A composition provider accepts a Domain Object, and provides identifiers for the children of that object.

_Snippet from [dictionary-plugin.js]()_
```javascript
var compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'example.taxonomy' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getDictionary()
            .then(function (dictionary) {
                return dictionary.measurements.map(function (m) {
                    return {
                        namespace: 'example.taxonomy',
                        key: m.key
                    };
                });
            });
    }
};

openmct.composition.addProvider(compositionProvider);
```

Our dictionary plugin should now look like this -

_[dictionary-plugin.js]()_
```javascript
(function () {
    
    function getDictionary() {
        return http.get('/dictionary.json')
            .then(function (result) {
                return result.data;
            });
    }
    
    var objectProvider = {
        get: function (identifier) {
            return getDictionary().then(function (dictionary) {
                if (identifier.key === 'spacecraft') {
                    return {
                        identifier: identifier,
                        name: dictionary.name,
                        type: 'folder',
                        location: 'ROOT'
                    };
                } else {
                    var measurement = dictionary.measurements.filter(function (m) {
                        return m.key === identifier.key;
                    })[0];
                    return {
                        identifier: identifier,
                        name: measurement.name,
                        type: 'example.telemetry',
                        telemetry: measurement,
                        location: 'example.taxonomy:spacecraft'
                    };
                }
            });
        }
    };
    
    var compositionProvider = {
        appliesTo: function (domainObject) {
            return domainObject.identifier.namespace === 'example.taxonomy' &&
                   domainObject.type === 'folder';
        },
        load: function (domainObject) {
            return getDictionary()
                .then(function (dictionary) {
                    return dictionary.measurements.map(function (m) {
                        return {
                            namespace: 'example.taxonomy',
                            key: m.key
                        };
                    });
                });
        }
    };
    
    var DictionaryPlugin = function (openmct) {
        openmct.objects.addRoot({
            namespace: 'example.taxonomy',
            key: 'spacecraft'
        });
    
        openmct.objects.addProvider('example.taxonomy', objectProvider);
    
        openmct.composition.addProvider(compositionProvider);
    
        openmct.types.addType('example.telemetry', {
            name: 'Example Telemetry Point',
            description: 'Example telemetry point from our happy tutorial.',
            cssClass: 'icon-telemetry'
        });
    
    };
}());

```

At this point, if we reload the page we should see a fully populated object tree. Clicking on our telemetry points will display views of those objects, but for now we don't have any telemetry for them. The tutorial telemetry server will provide telemetry for these points, and in the following steps we will define some telemetry adapters to retrieve telemetry data from the server, and provide it to Open MCT. 

# Part C - Integrate/Provide/Request Telemetry
**Shortcut:** `git checkout -f part-c`

Open MCT supports receiving telemetry by interrogating a telemetry store, and by subscribing to real-time telemetry updates. In this part of the tutorial we will define and register a telemetry adapter for retrieving historical telemetry from our tutorial telemetry server.

_[historical-telemetry-plugin.js]()_
```javascript
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
```

The telemetry adapter above defines two functions. The first of these, `supportsRequest`, is necesssary to indicate that this telemetry adapter supports requesting telemetry from a telemetry store. The `request` function will retrieve telemetry data and return it to the Open MCT application for display.

With our adapter defined, we need to update `index.html` to include it.

_[index.html]()_
```html
<!DOCTYPE html>
<html>
<head>
    <title>Open MCT Tutorials</title>
    <script src="node_modules/openmct/dist/openmct.js"></script>
    <script src="dictionary-plugin.js"></script>
    <script src="historical-telemetry-plugin.js"></script>
</head>
<body>
    <script>
        openmct.setAssetPath('node_modules/openmct');
        openmct.install(openmct.plugins.LocalStorage());
        openmct.install(openmct.plugins.MyItems());
        openmct.install(openmct.plugins.Espresso());
        openmct.install(openmct.plugins.UTCTimeSystem());
        
        openmct.install(DictionaryPlugin());
        openmct.start();
    </script>
</body>
</html>
```

At this point If we refresh the page we should now see some telemetry for our telemetry points. For example, navigating to the 'BLAH' telemetry point should show us a plot of the telemetry generated since the server started running. It should look something like the screenshot below.

# Part D - Subscribing to New Telemetry
**Shortcut:** `git checkout -f part-d`

We are now going to define a telemetry adapter that allows Open MCT to subscribe to our tutorial server for new telemetry as it becomes available. The process of defining a telemetry adapter for subscribing to real-time telemetry is similar to our previous adapter, except that we define a `supportsSubscribe` function to indicate that this adapter provides telemetry subscriptions, and a `subscribe` function. This adapter uses a simple messaging system for subscribing to telemetry updates over a websocket connection. 

```javascript
/**
 * Basic Realtime telemetry plugin using websockets.
 */

function RealtimeTelemetryPlugin(openmct) {
    var socket = new WebSocket('ws://localhost:8082');
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
```

The subscribe function accepts as arguments the domain object for which we are interested in telemetry, and a callback function. The callback function will be invoked with telemetry data as they become available.

If we refresh the page, we should now see telemetry flowing for our telemetry points. For example, navigating to the 'BLAH' telemetry point should show us a plot of the telemetry point's telemetry.

## Glossary

* Domain Object: An object is anything that can be represented in Open MCT. Telemetry sources, telemetry points, and views for visualizing telemetry data are all represented as objects in Open MCT. Objects are displayed in a tree in Open MCT, and allow a user to view telemetry data, and compose layouts from multiple view objects.
* Telemetry Source: A service that provides telemetry. Telemetry can be provided in response to a request, or as a subscription. 
* Telemetry Point: A telemetry point is a `thing` about which telemetry values are produced by a telemetry source. For example, a telemetry source might expose telemetry points for various instruments and subsystems on a spacecraft as telemetry points.