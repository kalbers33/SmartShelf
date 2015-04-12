//Weight Sensor simulators for Pet Feeder devices

var PinsSimulators = require('PinsSimulators');

var PinSimulatorArray = [];
var pinExport = {};
var numberOfShelves = 6;

for( i = 0; i < numberOfShelves; i++)
{
	PinSimulatorArray[i] = new PinsSimulators.AnalogInputAxisDescription(
	{
		valueLabel : "Shelf " + i.toString(),
		valueID : "Shelf" + i.toString(),
		value : 0,
		maxValue : 3000,
		defaultControl : PinsSimulators.SLIDER
	});
	pinExport["Shelf" + i.toString()] = {type: "A2D"};
}//*/

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
		header : {
			label : "Item Weights",
			name : "Shelf Items Current Weights",
			iconVariant : PinsSimulators.SENSOR_GUAGE
		},
		axes : PinSimulatorArray
	});
}

var close = exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

var read = exports.read = function() {
	return this.pinsSimulator.delegate("getValue");
}

exports.pins = pinExport;

exports.numberOfShelves = numberOfShelves;
				