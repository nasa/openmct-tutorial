# Open MCT Integration Tutorials

These tutorials will walk you through the simple process of integrating your telemetry systems with Open MCT.  In case you don't have any telemetry systems, we've included a reference implementation of a historical and realtime server.  We'll walk you through the process of integrating those services with Open MCT.

## Tutorial Prerequisites

* [node.js](https://nodejs.org/en/)
* [git](https://git-scm.com/)

Neither git nor node.js are requirements for using Open MCT, however this tutorial assumes that both are installed. Also, command line familiarity is a plus, however the tutorial is written in such a way that it should be possible to copy-paste the steps verbatim into a POSIX command line.

## How to use this tutorial.

As with any good cat, there are many ways to skin it.  Same applies to this tutorial - there are many ways to follow it.  The reader may simply follow the instructions in this tutorial, manually writing the tutorial code as they go along. However, you are free to jump around from step to step. This repository has been tagged at each step so that you can checkout the code at any point.  To skip to a specific section, `git checkout part-a-step-5`

## Glossary

* Object: An object is anything that can be represented in Open MCT. Telemetry sources, telemetry points, and views for visualizing telemetry data are all represented as objects in Open MCT. Objects are displayed in a tree in Open MCT, and allow a user to view telemetry data, and compose layouts from multiple view objects.
* Telemetry Source: A service that provides telemetry. Telemetry can be provided in response to a request, or as a subscription. 
* Telemetry Point: A telemetry point is a `thing` about which telemetry values are produced by a telemetry source. For example, a telemetry source might expose telemetry points for various instruments and subsystems on a spacecraft as telemetry points.

# Getting started

## Installing the tutorials

```
mkdir openmct
cd openmct
git clone ...something
```

Although this is not necessary if you are following the tutorials manually, this will give you a blank slate from which you can skip ahead to any step in the tutorials. 

The tutorials can be checked out from github (somehow - branch in main repo?) 

Initially you will be checked out at step 1 of part A the tutorial. You can skip ahead to any step by typing
```
git checkout part-X-step-N
```

Substituting the appropriate part and step numbers as necessary.

## Installing Open MCT

```
npm install openmct
```

The latest version of Open MCT can be installed via npm. The command above will install Open MCT and its dependencies in your current directory

## Including Open MCT

```html
<!DOCTYPE html>
<html>
<head>
    <title>Open MCT Tutorials</title>
    <script src="node_modules/openmct/openmct.js"></script>
</head>
<body>
    <script>
        openmct.setAssetPath('node_modules/openmct');
        // Enable browser storage to persist user-created objects locally
        openmct.install(openmct.plugins.LocalStorage());
        // Enable the 'MyItems' root for persisting user created objects
        openmct.install(openmct.plugins.MyItems());
        // Enable the 'Espresso' theme
        openmct.install(openmct.plugins.Espresso());
        // The UTC time system plugin adds support for representing UTC time in Open MCT.
        openmct.install(openmct.plugins.UTCTimeSystem());
        // Bootstrap the Open MCT application
        openmct.start();
    </script>
</body>
</html>
```
In the example above, Open MCT is included in a web page using a simple `script` tag. This will make the openmct API universally accessible as a global variable named `openmct`.
 
Alternatively, Open MCT supports UMD (Universal Module Definition), and can be included using UMD compatible libraries such as [RequireJS](http://requirejs.org/) and [CommonJS](http://www.commonjs.org/)

API documentation for Open MCT is available [on our website](https://nasa.github.io/openmct/docs/api/). In this tutorial we will start with a basic HTML page

# Part A - Populating the Object Tree
## Introduction
In Open MCT everything is represented as an object, this includes sources of telemetry, telemetry points, and views for visualizing telemetry. Objects are accessible from the object tree 

INSERT SCREENSHOT HERE.

In the first part of this tutorial we are going to populate the object tree with telemetry points representing instruments on our fictional spacecraft. 

The object tree is a hierarchical representation of all of the objects available in Open MCT. At the root of an object hierarchy is a root object. For this tutorial, we are going to create a new root object representing our spacecraft, and then populate it with objects representing the telemetry producing subsystems on our fictional spacecraft.

## Step 1 - Defining a new plugin

```javascript
(function () {
    window.DictionaryPlugin = function (openmct) {
      // A plugin adds functionality through calls to the openmct API
      // eg. openmct.telemetry.addProvider(...);
      ...
    };
}());
```
[dictionary-plugin.js]() 

A plugin is simply defined as an initialization function which receives a single argument - the Open MCT API. For the purposes of this tutorial, we define a new `DictionaryPlugin` inside of an [immediately invoked function expression](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression), but this particular approach is not a requirement.

Open MCT supports extension through its plugin architecture. A plugin is used to encapsulate all of the code, resources (such as HTML, images, and CSS), and dependencies necessary to extend Open MCT.

We are going to create a new plugin named 'DictionaryPlugin' which will fetch a data dictionary describing the telemetry available for a spacecraft, and use it to populate the object tree. We will define this plugin in a separate file named [dictionary-plugin.js](), and include it from [index.html]() using a script tag. 

Once defined, a plugin can be installed by passing its initialization function to the `install` function on the openmct object.
```
  openmct.install(DictionaryPlugin);
```
[index.html]() 

## Step 2 - Creating a new root object node

```javascript
  openmct.objects.addRoot({
      namespace: 'example.taxonomy',
      key: 'spacecraft'
  });
```
_Snippet from [dictionary-plugin.js]()_

__To jump to this step, use the command `git checkout part-a-step-3` to checkout all content from the previous step__

A new root can be added to the object tree using the `addRoot` function exposed by the Open MCT API. `addRoot` accepts an object identifier, defined as a javascript object with a `namespace` and a `key` attribute. 

The object tree is populated with Domain Objects. Domain Objects are javascript objects with a simple structure that includes an `identifier`. The full details of the structure of Domain Objects is described in our documentation. A root is added by calling `addRoot` with the identifier of an object. This identifier will be used to fetch an object representing the tree node (in this case a root node). Objects are fetched and populated by Object Providers. In step 3 we will define an Object Provider that will provide an object for this root node.
 
The `openmct` object is made available to a plugin's initializer function, so the code above can be placed inside the initializer function in [dictionary-plugin.js]()

__RELOAD APP AT THIS POINT TO SEE THE ROOT NODE ?__.

## Step 3 - Providing objects

__To jump to this step, use the command `git checkout part-a-step-3` to checkout all content from the previous step__

In order to access our telemetry, we need to provide Open MCT with some objects that represent the parts of the spacecraft that produce telemetry data, such as subsystems and instruments. Let's call these telemetry producing things "telemetry points".
 
We will first define a new "telemetry point" object type. Registering a new type in Open MCT is simple -

``` javascript
openmct.types.addType('example.telemetry', {
    name: 'Example Telemetry Point',
    description: 'Example telemetry point from our happy tutorial.',
    cssClass: 'icon-telemetry'
});
```
_Snippet from [dictionary-plugin.js]()_

Here we define a new type with a key of `example.telemetry`. In a moment we will define some objects of this type, and use this key to reference the type. We give the type definition the following attributes -

* `name`: A human readable name. This name will appear in places where metadata about objects of this type is displayed, such as the object inspector panel. If this were a user-creatable object type (it's not), then this name would appear in the create menu.
* `description`: A brief, human readable description of the object type.
* `cssClass`: A css class that will be applied to all objects of this type. This will be used to determine the icon used to graphically represent objects of this type. Any css class can be used here. Open MCT uses a number of built-in icon classes available. The list of available icons will be made available as part of an Open MCT style guide which will be available soon.

Next we need to provide Open MCT with some objects of our new object type. At a minimum, an object provider must define a `get` function. This function should return a promise that resolves with a single object. 

``` javascript
var objectProvider = {
    get: function (identifier) {
      ...
    }
};
    
openmct.objects.addProvider('example.taxonomy', objectProvider);
```
__To jump to this step, use the command `git checkout part-a-step-3` to checkout all content from the previous step__

Objects in Open MCT have a minimal standard structure. For more details on objects, and object providers, please see the associated [API documentation]().

Let's fill in some blanks for the object provider. In a typical scenario, a telemetry server will provide a dictionary describing the telemetry available for requests and subscriptions. To simulate this, our tutorial telemetry server will expose a static telemetry dictionary in JSON format. This dictionary will be used to populate a number of Domain Objects of our new `example.telemetry` type, and a folder to hold them all.

``` javascript
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
__To jump to this step, use the command `git checkout part-a-step-3` to checkout all content from the previous step__

The object provider fetches a dictionary using the `getDictionary()` function (included below), and uses the information in the dictionary to populate and return a Domain Object, given an identifier. The properties of Domain Object are described in the [API documentation](). 

We have defined a root object with the key `spacecraft`, and our object provider will return a populated Domain Object when this key is requested. It will be represented as a folder for holding the various spacecraft measurements. This same provider will also return populated Domain Objects for the measurements provided by the spacecraft. 

If we reload the app at this point, we should see the `Example Spacecraft` object in the tree. Although we have defined an object provider for both the Example Spacecraft and its children (the telemetry measurements) there's a final step involved in populating the object tree with all of the measurements available from the spacecraft.

## Step 4 - Populating the tree

The object tree has a hierarchical structure from the root down to the leaf nodes, and is made up of Domain Objects. We have defined a root node in [Step 1]() and we have provided some objects that will appear in the tree. Finally we need to provide structure to the tree and define the relationships between the objects. This is achieved with a [Composition Provider](). A composition provider accepts a Domain Object, and simply returns the children of that object. Resolution of the function is deferred via a returned `Promise` that will resolve with an array of identifiers for the children of the given object.  

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
_Snippet from [dictionary-plugin.js]()_

# Part B - Requesting Telemetry

## Introduction
## Step 1
## Step 2
## Step 3

# Part B - Subscribing to Telemetry

## Introduction
## Step 1
## Step 2
## Step 3







## Running the tutorial server:

```
npm install
npm start
```

# Outline

* getting started
  downloading and installing 
* installing some basic plugins
  this is how you add some persistence, a basic root folder, and a theme.
* adding objects to the tree.
* providing historical telemetry.
* providing realtime telemetry.

# 

