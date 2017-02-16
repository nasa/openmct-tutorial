/**
 * Basic implementation of a history and realtime server.
 */

var Spacecraft = require('./spacecraft');
var RealtimeServer = require('./realtime-server');
var HistoryServer = require('./history-server');
var StaticServer = require('./static-server');


var spacecraft = new Spacecraft();
var realtimeServer = new RealtimeServer(spacecraft, 8082);
var historyServer = new HistoryServer(spacecraft, 8081);
var staticServer = new StaticServer(8080);

