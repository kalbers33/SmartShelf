//Weight Sensor simulators for Pet Feeder devices

var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
		header : {
			label : "Item Weights",
			name : "Shelf Items Current Weights",
			iconVariant : PinsSimulators.SENSOR_GUAGE
		},
		axes : [
			new PinsSimulators.AnalogInputAxisDescription(
			{
				valueLabel : "1_1",
				valueID : "Row1Column1",
				value : 0,
				maxValue : 3000,
				defaultControl : PinsSimulators.SLIDER
			}),
			new PinsSimulators.AnalogInputAxisDescription(
			{
				valueLabel : "1_2",
				valueID : "Row1Column2",
				value : 0,
				maxValue : 3000,
				defaultControl : PinsSimulators.SLIDER
			}),
			new PinsSimulators.AnalogInputAxisDescription(
			{
				valueLabel : "1_3",
				valueID : "Row1Column3",
				value : 0,
				maxValue : 3000,
				defaultControl : PinsSimulators.SLIDER
			})
		]
	});
}

var close = exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

var read = exports.read = function() {
	return this.pinsSimulator.delegate("getValue");
}

exports.pins = {
	Row1Column1: {type: "A2D"},
	Row1Column2: {type: "A2D"},
	Row1Column3: {type: "A2D"}
}
				