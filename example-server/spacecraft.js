/*
 Spacecraft.js simulates a small spacecraft generating telemetry.
*/
const ONE_ROW_OF_DATA = [1.111, 2.222, 3.3333];

function Spacecraft() {
    this.state = {
    };
    this.listeners = [];

    setInterval(function () {
        this.generateTelemetry();
    }.bind(this), 1000);

    console.log("Example spacecraft launched!");
    console.log("Press Enter to toggle thruster state.");
};

/**
 * Takes a measurement of spacecraft state, stores in history, and notifies 
 * listeners.
 */
Spacecraft.prototype.generateTelemetry = function () {
    let timestamp = Date.now();
    let datum = {
        id: 'spectra',
        timestamp: timestamp,
        values: ONE_ROW_OF_DATA
    };
    this.notify(datum);
};

Spacecraft.prototype.notify = function (point) {
    this.listeners.forEach(function (l) {
        l(point);
    });
};

Spacecraft.prototype.listen = function (listener) {
    this.listeners.push(listener);
    return function () {
        this.listeners = this.listeners.filter(function (l) {
            return l !== listener;
        });
    }.bind(this);
};

module.exports = function () {
    return new Spacecraft()
};