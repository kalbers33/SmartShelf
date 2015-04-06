

exports.pins = {
	Row1Column1: {type: "A2D"},
	Row1Column2: {type: "A2D"},
	Row1Column3: {type: "A2D"}
}

exports.configure = function() {
	this.Row1Column1.init();
    this.Row1Column2.init();
    this.Row1Column3.init();
}

var read = exports.read = function() {
    return { Row1Column1: this.Row1Column1.read(), Row1Column2: this.Row1Column2.read(), Row1Column3: this.Row1Column3.read() };
}
