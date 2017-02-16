/**
 * Basic implementation of a history and realtime server.
 */

var Spacecraft = require('./spacecraft');
var RealtimeServer = require('./realtime-server');
var HistoryServer = require('./history-server');


var spacecraft = new Spacecraft();
var realtimeServer = new RealtimeServer(spacecraft, 8081);
var historyServer = new HistoryServer(spacecraft, 8080);

